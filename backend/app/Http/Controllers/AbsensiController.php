<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\KartuRfid;
use App\Models\KonfigurasiAbsensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $tanggal = $request->query('tanggal', Carbon::today()->toDateString());
        $kelasId = $request->query('kelas_id');

        $query = Absensi::with(['siswa', 'admin'])->where('tanggal', $tanggal);

        if ($kelasId) {
            $query->whereHas('siswa.kelas', function ($q) use ($kelasId) {
                $q->where('id', $kelasId);
            });
        }

        $absensi = $query->get();

        return response()->json($absensi);
    }

    public function rekap(Request $request)
    {
        $bulan = $request->query('bulan', Carbon::now()->month);
        $tahun = $request->query('tahun', Carbon::now()->year);
        $kelasId = $request->query('kelas_id');

        $query = Absensi::with('siswa.kelas')
            ->select('siswa_id', 
                DB::raw('count(case when status_masuk = "hadir" then 1 end) as hadir'),
                DB::raw('count(case when status_masuk = "sakit" then 1 end) as sakit'),
                DB::raw('count(case when status_masuk = "izin" then 1 end) as izin'),
                DB::raw('count(case when status_masuk = "alpha" then 1 end) as alpha'),
                DB::raw('count(case when status_masuk = "terlambat" then 1 end) as terlambat')
            )
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);

        if ($kelasId) {
            $query->whereHas('siswa.kelas', function ($q) use ($kelasId) {
                $q->where('id', $kelasId);
            });
        }

        $rekap = $query->groupBy('siswa_id')->get();

        return response()->json($rekap);
    }

    public function rekapSiswa($id)
    {
        $absensi = Absensi::where('siswa_id', $id)->orderBy('tanggal', 'desc')->get();
        return response()->json($absensi);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:users,id',
            'tanggal' => 'required|date',
            'jam_masuk' => 'nullable|date_format:H:i:s',
            'jam_pulang' => 'nullable|date_format:H:i:s',
            'status_masuk' => 'required|in:hadir,izin,sakit,alpha,terlambat',
            'status_pulang' => 'nullable|in:hadir,pulang_awal,alpha',
            'metode' => 'required|in:manual,rfid',
            'catatan' => 'nullable|string',
        ]);

        $validated['created_by'] = $request->user()->id;

        $absensi = Absensi::create($validated);

        return response()->json($absensi, 201);
    }

    public function update(Request $request, $id)
    {
        $absensi = Absensi::findOrFail($id);

        $validated = $request->validate([
            'jam_masuk' => 'nullable|date_format:H:i:s',
            'jam_pulang' => 'nullable|date_format:H:i:s',
            'status_masuk' => 'nullable|in:hadir,izin,sakit,alpha,terlambat',
            'status_pulang' => 'nullable|in:hadir,pulang_awal,alpha',
            'catatan' => 'nullable|string',
        ]);

        $absensi->update($validated);

        return response()->json($absensi);
    }

    public function tap(Request $request)
    {
        $validated = $request->validate([
            'uid' => 'required|string'
        ]);

        $kartu = KartuRfid::where('uid', $validated['uid'])->with('siswa')->first();

        if (!$kartu) {
            return response()->json(['message' => 'Kartu tidak terdaftar'], 404);
        }

        if ($kartu->status !== 'aktif') {
            return response()->json(['message' => 'Kartu tidak aktif'], 403);
        }

        $config = KonfigurasiAbsensi::first();
        if (!$config) {
            return response()->json(['message' => 'Konfigurasi absensi belum diatur'], 500);
        }

        $now = Carbon::now();
        $tanggalHariIni = $now->toDateString();
        $jamSekarang = $now->format('H:i:s');

        $absensiHariIni = Absensi::where('siswa_id', $kartu->siswa_id)
            ->where('tanggal', $tanggalHariIni)
            ->first();

        if (!$absensiHariIni) {
            // Belum absen masuk
            $statusMasuk = 'hadir';
            
            $jamMasukConfig = Carbon::createFromFormat('H:i:s', $config->jam_masuk);
            $toleransiTerlambat = Carbon::createFromFormat('H:i:s', $config->jam_masuk)->addMinutes($config->toleransi_terlambat);
            $batasAlpha = Carbon::createFromFormat('H:i:s', $config->batas_alpha);

            if ($now->format('H:i:s') > $config->batas_alpha) {
                $statusMasuk = 'alpha';
            } elseif ($now->format('H:i:s') > $toleransiTerlambat->format('H:i:s')) {
                $statusMasuk = 'terlambat';
            }

            $absensi = Absensi::create([
                'siswa_id' => $kartu->siswa_id,
                'tanggal' => $tanggalHariIni,
                'jam_masuk' => $jamSekarang,
                'status_masuk' => $statusMasuk,
                'metode' => 'rfid',
                'uid_rfid' => $kartu->uid,
            ]);

            return response()->json([
                'message' => 'Absen masuk berhasil',
                'status' => $statusMasuk,
                'siswa' => $kartu->siswa,
                'jam' => $jamSekarang
            ]);
        } else {
            // Sudah absen masuk, lakukan absen pulang
            if ($absensiHariIni->jam_pulang) {
                return response()->json([
                    'message' => 'Sudah melakukan absen pulang hari ini',
                    'siswa' => $kartu->siswa
                ], 400);
            }

            $statusPulang = 'hadir';
            $jamPulangConfig = Carbon::createFromFormat('H:i:s', $config->jam_pulang);

            if ($now->format('H:i:s') < $config->jam_pulang) {
                $statusPulang = 'pulang_awal';
            }

            $absensiHariIni->update([
                'jam_pulang' => $jamSekarang,
                'status_pulang' => $statusPulang,
            ]);

            return response()->json([
                'message' => 'Absen pulang berhasil',
                'status' => $statusPulang,
                'siswa' => $kartu->siswa,
                'jam' => $jamSekarang
            ]);
        }
    }
}
