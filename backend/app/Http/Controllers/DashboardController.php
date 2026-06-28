<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Kelas;
use App\Models\PembayaranTagihan;
use App\Models\PembayaranTransaksi;
use App\Models\Absensi;
use App\Models\Penugasan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        $stats = [];

        if (in_array($role, ['superadmin', 'kepala_sekolah'])) {
            // Total Users
            $stats['total_siswa'] = User::where('role', 'siswa')->count();
            $stats['total_guru'] = User::where('role', 'guru')->count();
            $stats['total_admin'] = User::where('role', 'admin')->count();

            // Total Kelas
            $stats['total_kelas'] = Kelas::count();

            // Total Tagihan / Kas Masuk (simplification: total sum of successful transactions)
            $stats['total_kas_masuk'] = PembayaranTransaksi::where('status', 'sukses')->sum('jumlah');

            // Kehadiran hari ini
            $today = Carbon::today()->toDateString();
            $stats['kehadiran_hari_ini'] = [
                'hadir' => Absensi::whereDate('tanggal', $today)->whereIn('status', ['hadir', 'tap_masuk', 'tap_pulang'])->count(),
                'alpha' => Absensi::whereDate('tanggal', $today)->where('status', 'alpha')->count(),
                'terlambat' => Absensi::whereDate('tanggal', $today)->where('terlambat', true)->count(),
            ];
            
            // Generate some cards array format common in dashoards
            $stats['cards'] = [
                [
                    'name' => 'Total Siswa',
                    'value' => $stats['total_siswa'],
                    'icon' => 'Users',
                    'color' => 'bg-blue-500'
                ],
                [
                    'name' => 'Total Guru',
                    'value' => $stats['total_guru'],
                    'icon' => 'GraduationCap',
                    'color' => 'bg-green-500'
                ],
                [
                    'name' => 'Total Kelas',
                    'value' => $stats['total_kelas'],
                    'icon' => 'BookOpen',
                    'color' => 'bg-purple-500'
                ],
                [
                    'name' => 'Kas Masuk',
                    'value' => 'Rp ' . number_format($stats['total_kas_masuk'], 0, ',', '.'),
                    'icon' => 'Wallet',
                    'color' => 'bg-emerald-500'
                ]
            ];
            
            $stats['kehadiran'] = [
                ['name' => 'Hadir', 'value' => $stats['kehadiran_hari_ini']['hadir'], 'color' => '#10B981'],
                ['name' => 'Terlambat', 'value' => $stats['kehadiran_hari_ini']['terlambat'], 'color' => '#F59E0B'],
                ['name' => 'Alpha/Izin/Sakit', 'value' => $stats['kehadiran_hari_ini']['alpha'], 'color' => '#EF4444'],
            ];
            
        } elseif (in_array($role, ['guru', 'walikelas'])) {
            $guruId = $user->id;
            
            $stats['total_kelas_diajar'] = Penugasan::where('guru_id', $guruId)->distinct('kelas_id')->count('kelas_id');
            // Assuming tasks might be related to penugasan or mapel
            $stats['total_tugas'] = 0; // Replace with actual task count if you have a Tugas model
            
            $walikelasKelas = Kelas::where('wali_kelas_id', $guruId)->first();
            $stats['is_walikelas'] = $walikelasKelas ? true : false;
            
            $stats['cards'] = [
                [
                    'name' => 'Kelas Diajar',
                    'value' => $stats['total_kelas_diajar'],
                    'icon' => 'BookOpen',
                    'color' => 'bg-blue-500'
                ],
                [
                    'name' => 'Total Tugas',
                    'value' => $stats['total_tugas'],
                    'icon' => 'ClipboardList',
                    'color' => 'bg-green-500'
                ],
            ];
            
            if ($walikelasKelas) {
                // Get attendance for wali kelas's students today
                $today = Carbon::today()->toDateString();
                $siswaIds = User::where('role', 'siswa')->where('kelas_id', $walikelasKelas->id)->pluck('id');
                
                $hadir = Absensi::whereIn('user_id', $siswaIds)->whereDate('tanggal', $today)->whereIn('status', ['hadir', 'tap_masuk', 'tap_pulang'])->count();
                $totalSiswa = count($siswaIds);
                
                $stats['kehadiran_kelas_binaan'] = [
                    'hadir' => $hadir,
                    'total' => $totalSiswa,
                    'persentase' => $totalSiswa > 0 ? round(($hadir / $totalSiswa) * 100) : 0
                ];
                
                $stats['cards'][] = [
                    'name' => 'Kehadiran Kelas',
                    'value' => $stats['kehadiran_kelas_binaan']['persentase'] . '%',
                    'icon' => 'UserCheck',
                    'color' => 'bg-purple-500'
                ];
            }

        } elseif ($role === 'siswa') {
            $siswaId = $user->id;
            
            $tagihanBelumLunas = PembayaranTagihan::where('siswa_id', $siswaId)->where('status', '!=', 'lunas')->sum('sisa_tagihan');
            $stats['tagihan_belum_lunas'] = $tagihanBelumLunas;
            
            $totalHari = Absensi::where('user_id', $siswaId)->count();
            $totalHadir = Absensi::where('user_id', $siswaId)->whereIn('status', ['hadir', 'tap_masuk', 'tap_pulang'])->count();
            
            $persentaseKehadiran = $totalHari > 0 ? round(($totalHadir / $totalHari) * 100) : 100;
            $stats['persentase_kehadiran'] = $persentaseKehadiran;
            
            $stats['cards'] = [
                [
                    'name' => 'Kehadiran',
                    'value' => $persentaseKehadiran . '%',
                    'icon' => 'UserCheck',
                    'color' => 'bg-green-500'
                ],
                [
                    'name' => 'Tagihan Belum Lunas',
                    'value' => 'Rp ' . number_format($tagihanBelumLunas, 0, ',', '.'),
                    'icon' => 'CreditCard',
                    'color' => 'bg-red-500'
                ],
            ];

        } elseif ($role === 'bendahara') {
            $startOfMonth = Carbon::now()->startOfMonth();
            $endOfMonth = Carbon::now()->endOfMonth();
            
            $kasBulanIni = PembayaranTransaksi::where('status', 'sukses')
                            ->whereBetween('tanggal_bayar', [$startOfMonth, $endOfMonth])
                            ->sum('jumlah');
                            
            $totalTunggakan = PembayaranTagihan::where('status', '!=', 'lunas')->sum('sisa_tagihan');
            
            $stats['kas_bulan_ini'] = $kasBulanIni;
            $stats['total_tunggakan'] = $totalTunggakan;
            
            $stats['cards'] = [
                [
                    'name' => 'Kas Masuk Bulan Ini',
                    'value' => 'Rp ' . number_format($kasBulanIni, 0, ',', '.'),
                    'icon' => 'TrendingUp',
                    'color' => 'bg-green-500'
                ],
                [
                    'name' => 'Total Tunggakan',
                    'value' => 'Rp ' . number_format($totalTunggakan, 0, ',', '.'),
                    'icon' => 'AlertCircle',
                    'color' => 'bg-red-500'
                ],
            ];
        } else {
            // Default empty or basic cards
            $stats['cards'] = [];
        }

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }
}
