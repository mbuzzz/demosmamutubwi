<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nilai;
use App\Models\Penugasan;
use App\Models\RiwayatKelas;
use App\Models\SistemKonfigurasi;
use App\Models\Kurikulum;
use Illuminate\Support\Facades\Auth;

class NilaiController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Nilai::with(['siswa', 'guru']);

        if ($user->role === 'siswa') {
            $query->where('siswa_id', $user->id);
        } else {
            if ($request->has('siswa_id')) {
                $query->where('siswa_id', $request->siswa_id);
            }
            if ($request->has('mapel_id')) {
                $query->where('mapel_id', $request->mapel_id);
            }
        }

        if ($request->has('tahun_ajaran')) {
            $query->where('tahun_ajaran', $request->tahun_ajaran);
        }
        if ($request->has('semester')) {
            $query->where('semester', $request->semester);
        }

        return response()->json($query->paginate($request->per_page ?? 50));
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role === 'siswa') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'siswa_id' => 'required|exists:users,id',
            'mapel_id' => 'required|exists:mapels,id',
            'nilai_tugas' => 'nullable|numeric|min:0|max:100',
            'nilai_uts' => 'nullable|numeric|min:0|max:100',
            'nilai_uas' => 'nullable|numeric|min:0|max:100',
            'semester' => 'required|string',
            'tahun_ajaran' => 'required|string',
            'catatan' => 'nullable|string',
        ]);

        if ($user->role === 'guru') {
            // Check if teacher teaches this mapel to this student's class in the given academic year
            $riwayatKelas = RiwayatKelas::where('siswa_id', $validated['siswa_id'])
                ->where('tahun_ajaran', $validated['tahun_ajaran'])
                ->first();

            if (!$riwayatKelas) {
                abort(403, 'Siswa tidak memiliki riwayat kelas di tahun ajaran tersebut.');
            }

            $penugasan = Penugasan::where('guru_id', $user->id)
                ->where('mapel_id', $validated['mapel_id'])
                ->where('kelas_id', $riwayatKelas->kelas_id)
                ->where('tahun_ajaran', $validated['tahun_ajaran'])
                ->exists();

            if (!$penugasan) {
                abort(403, 'Anda tidak ditugaskan mengajar mapel tersebut di kelas siswa ini.');
            }
        }

        $validated['guru_id'] = $user->id;

        // Auto calculate nilai_akhir and predikat
        $config = SistemKonfigurasi::first() ?: new SistemKonfigurasi([
            'tahun_ajaran_aktif' => '2025/2026',
            'semester_aktif' => 'ganjil',
        ]);

        $kurikulum = null;
        if ($config->kurikulum_aktif_id) {
            $kurikulum = Kurikulum::find($config->kurikulum_aktif_id);
        }
        if (!$kurikulum) {
            $kurikulum = Kurikulum::where('status', 'aktif')->first() ?: new Kurikulum([
                'kkm_default' => 75,
                'bobot_tugas' => 30,
                'bobot_uts' => 30,
                'bobot_uas' => 40,
            ]);
        }

        $nilaiTugas = $validated['nilai_tugas'] ?? 0;
        $nilaiUts = $validated['nilai_uts'] ?? 0;
        $nilaiUas = $validated['nilai_uas'] ?? 0;

        $bobotTugas = $kurikulum->bobot_tugas ?? 30;
        $bobotUts = $kurikulum->bobot_uts ?? 30;
        $bobotUas = $kurikulum->bobot_uas ?? 40;

        $totalBobot = $bobotTugas + $bobotUts + $bobotUas;
        if ($totalBobot <= 0) $totalBobot = 100;

        $nilaiAkhir = round(
            ($nilaiTugas * $bobotTugas +
             $nilaiUts * $bobotUts +
             $nilaiUas * $bobotUas) / $totalBobot
        );

        $validated['nilai_akhir'] = $nilaiAkhir;

        $kkm = $kurikulum->kkm_default;
        if ($nilaiAkhir >= 90) $predikat = 'A';
        elseif ($nilaiAkhir >= 80) $predikat = 'B';
        elseif ($nilaiAkhir >= $kkm) $predikat = 'C';
        else $predikat = 'D';

        $validated['predikat'] = $predikat;

        $nilai = Nilai::updateOrCreate(
            [
                'siswa_id' => $validated['siswa_id'],
                'mapel_id' => $validated['mapel_id'],
                'semester' => $validated['semester'],
                'tahun_ajaran' => $validated['tahun_ajaran'],
            ],
            $validated
        );

        return response()->json([
            'message' => 'Nilai saved successfully',
            'nilai' => $nilai,
        ]);
    }
}
