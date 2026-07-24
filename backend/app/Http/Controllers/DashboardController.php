<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Kelas;
use App\Models\TagihanSiswa;
use App\Models\TransaksiPembayaran;
use App\Models\Absensi;
use App\Models\Penugasan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $user = $request->user();
        // Primary role for dashboard branch; multi-role checked via hasRole()
        $role = $user->role;

        $stats = [];

        if ($user->hasRole(['superadmin', 'kepala_sekolah'])) {
            // Total Users (multi-role aware)
            $stats['total_siswa'] = User::whereHasAnyRole(['siswa'])->count();
            $stats['total_guru'] = User::whereHasAnyRole(['guru', 'walikelas', 'kepala_sekolah', 'kurikulum'])->count();
            $stats['total_admin'] = User::whereHasAnyRole(['admin', 'superadmin'])->count();

            // Total Kelas
            $stats['total_kelas'] = Kelas::count();

            // Pendaftar SPMB
            $stats['total_pendaftar'] = \App\Models\Pendaftar::count();
            $stats['total_pendaftar_inden'] = \App\Models\Pendaftar::whereHas('gelombang', function($q) {
                $q->where('nama', 'like', '%inden%');
            })->count();

            // Total Tagihan / Kas Masuk (simplification: total sum of successful transactions)
            $stats['total_kas_masuk'] = TransaksiPembayaran::where('status', 'berhasil')->sum('jumlah_bayar');

            // Kehadiran hari ini
            $today = Carbon::today()->toDateString();
            $stats['kehadiran_hari_ini'] = [
                'hadir'     => Absensi::whereDate('tanggal', $today)->whereIn('status_masuk', ['hadir', 'terlambat'])->count(),
                'alpha'     => Absensi::whereDate('tanggal', $today)->where('status_masuk', 'alpha')->count(),
                'terlambat' => Absensi::whereDate('tanggal', $today)->where('status_masuk', 'terlambat')->count(),
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
                    'name' => 'Total Pendaftar',
                    'value' => $stats['total_pendaftar'],
                    'icon' => 'UserPlus',
                    'color' => 'bg-indigo-500'
                ],
                [
                    'name' => 'Pendaftar Inden',
                    'value' => $stats['total_pendaftar_inden'],
                    'icon' => 'Users',
                    'color' => 'bg-pink-500'
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
            
        } elseif ($user->hasRole(['guru', 'walikelas', 'kurikulum'])) {
            $guruId = $user->id;
            $config = \App\Models\SistemKonfigurasi::first();
            $tahunAjaran = $config?->tahun_ajaran_aktif ?? '2025/2026';

            $penugasans = Penugasan::where('guru_id', $guruId)
                ->where('tahun_ajaran', $tahunAjaran)
                ->get();

            $stats['total_kelas_diajar'] = $penugasans->pluck('kelas_id')->unique()->count();
            $stats['total_mapel'] = $penugasans->pluck('mapel_id')->unique()->count();
            $stats['total_jam_minggu'] = (int) $penugasans->sum('total_jam');

            // Tugas aktif guru + menunggu penilaian
            $tugasIds = \App\Models\Tugas::where('guru_id', $guruId)->pluck('id');
            $stats['total_tugas'] = $tugasIds->count();

            $pendingQuery = \App\Models\PengumpulanTugas::whereIn('tugas_id', $tugasIds)
                ->where(function ($q) {
                    $q->whereNull('nilai')
                        ->orWhere('status', '!=', 'sudah_dinilai');
                });

            $stats['tugas_menunggu_nilai'] = (clone $pendingQuery)->count();

            // Ringkas tugas pending untuk FE dashboard
            $stats['pending_tugas'] = (clone $pendingQuery)
                ->with(['tugas.kelas'])
                ->latest('dikumpulkan_pada')
                ->limit(30)
                ->get()
                ->groupBy('tugas_id')
                ->map(function ($group) {
                    $tugas = $group->first()->tugas;
                    // Relasi tugas↔kelas = many-to-many (collection)
                    $kelasNames = collect($tugas?->kelas ?? [])
                        ->pluck('nama')
                        ->filter()
                        ->values();
                    $kelasLabel = $kelasNames->isNotEmpty()
                        ? 'Kelas ' . $kelasNames->implode(', ')
                        : '—';

                    $totalSiswaKelas = $kelasNames->isNotEmpty()
                        ? User::whereHasAnyRole(['siswa'])
                            ->whereIn('kelas', $kelasNames->all())
                            ->count()
                        : $group->count();

                    return [
                        'id' => $tugas?->id,
                        'title' => $tugas?->judul ?? 'Tugas',
                        'kelas' => $kelasLabel,
                        'submitted' => $group->count(),
                        'total' => max($totalSiswaKelas, $group->count()),
                        'date' => optional($group->first()->dikumpulkan_pada)->diffForHumans() ?? 'Baru',
                    ];
                })
                ->values()
                ->take(5);

            $walikelasKelas = Kelas::where('wali_kelas_id', $guruId)->first();
            $stats['is_walikelas'] = (bool) $walikelasKelas;
            $stats['roles'] = $user->all_roles;

            $stats['cards'] = [
                [
                    'name' => 'Kelas Diajar',
                    'value' => $stats['total_kelas_diajar'],
                    'icon' => 'BookOpen',
                    'color' => 'bg-blue-500',
                ],
                [
                    'name' => 'Mapel Diampu',
                    'value' => $stats['total_mapel'],
                    'icon' => 'BookOpen',
                    'color' => 'bg-indigo-500',
                ],
                [
                    'name' => 'Jam / Minggu',
                    'value' => $stats['total_jam_minggu'] . ' jp',
                    'icon' => 'ClipboardList',
                    'color' => 'bg-green-500',
                ],
                [
                    'name' => 'Menunggu Nilai',
                    'value' => $stats['tugas_menunggu_nilai'],
                    'icon' => 'ClipboardList',
                    'color' => 'bg-amber-500',
                ],
            ];

            if ($walikelasKelas) {
                $today = Carbon::today()->toDateString();
                $siswaIds = User::whereHasAnyRole(['siswa'])
                    ->where('kelas', $walikelasKelas->nama)
                    ->pluck('id');

                $hadir = Absensi::whereIn('siswa_id', $siswaIds)
                    ->whereDate('tanggal', $today)
                    ->whereIn('status_masuk', ['hadir', 'terlambat'])
                    ->count();
                $totalSiswa = count($siswaIds);

                $stats['kehadiran_kelas_binaan'] = [
                    'hadir' => $hadir,
                    'total' => $totalSiswa,
                    'persentase' => $totalSiswa > 0 ? round(($hadir / $totalSiswa) * 100) : 0,
                ];

                $stats['cards'][] = [
                    'name' => 'Kehadiran Kelas',
                    'value' => $stats['kehadiran_kelas_binaan']['persentase'] . '%',
                    'icon' => 'UserCheck',
                    'color' => 'bg-purple-500',
                ];
            }

            // Pengumuman real dari berita terbit terbaru
            $stats['pengumuman'] = \App\Models\Berita::query()
                ->with('kategori')
                ->where('status', 'published')
                ->latest('published_at')
                ->limit(5)
                ->get()
                ->map(function ($b) {
                    return [
                        'tag' => $b->kategori?->nama ?? 'Akademik',
                        'title' => $b->judul,
                        'date' => optional($b->published_at)->diffForHumans()
                            ?? optional($b->created_at)->diffForHumans()
                            ?? '',
                        'id' => $b->id,
                    ];
                })
                ->values();

        } elseif ($user->isSiswa()) {
            $siswaId = $user->id;
            
            $tagihanBelumLunas = TagihanSiswa::where('siswa_id', $siswaId)
                ->where('status', '!=', 'lunas')
                ->get()
                ->sum(function ($tagihan) {
                    return $tagihan->nominal_tagihan - $tagihan->nominal_terbayar;
                });
            $stats['tagihan_belum_lunas'] = $tagihanBelumLunas;
            
            $totalHari = Absensi::where('siswa_id', $siswaId)->count();
            $totalHadir = Absensi::where('siswa_id', $siswaId)->whereIn('status_masuk', ['hadir', 'terlambat'])->count();
            
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

        } elseif ($user->hasRole(['bendahara'])) {
            $bulanIni = Carbon::now()->month;
            $tahunIni = Carbon::now()->year;
            
            $kasBulanIni = TransaksiPembayaran::where('status', 'berhasil')
                ->whereMonth('tanggal_bayar', $bulanIni)
                ->whereYear('tanggal_bayar', $tahunIni)
                ->sum('jumlah_bayar');
                            
            $totalTunggakan = TagihanSiswa::where('status', '!=', 'lunas')
                ->get()
                ->sum(function ($tagihan) {
                    return $tagihan->nominal_tagihan - $tagihan->nominal_terbayar;
                });
            
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
        } elseif ($user->isOrangTua()) {
            $siswaId = $user->siswa_id;
            
            if ($siswaId) {
                $tagihanBelumLunas = TagihanSiswa::where('siswa_id', $siswaId)
                    ->where('status', '!=', 'lunas')
                    ->get()
                    ->sum(function ($tagihan) {
                        return $tagihan->nominal_tagihan - $tagihan->nominal_terbayar;
                    });
                $stats['tagihan_belum_lunas'] = $tagihanBelumLunas;
                
                $totalHari = Absensi::where('siswa_id', $siswaId)->count();
                $totalHadir = Absensi::where('siswa_id', $siswaId)->whereIn('status_masuk', ['hadir', 'terlambat'])->count();
                
                $persentaseKehadiran = $totalHari > 0 ? round(($totalHadir / $totalHari) * 100) : 100;
                $stats['persentase_kehadiran'] = $persentaseKehadiran;
                
                $stats['cards'] = [
                    [
                        'name' => 'Kehadiran Anak',
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
            } else {
                $stats['cards'] = [];
            }
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
