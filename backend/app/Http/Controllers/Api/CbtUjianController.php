<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HasilUjian;
use App\Models\JawabanSiswa;
use App\Models\OpsiJawaban;
use App\Models\SesiUjian;
use App\Models\Soal;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CbtUjianController extends Controller
{
    public function getSesiAktif(Request $request)
    {
        $user = $request->user();

        // Kelas aktif: string users.kelas → id, fallback riwayat
        $kelasId = $user->resolveSiswaKelasId();

        $query = SesiUjian::with(['bankSoal.mapel', 'template'])
            ->where('is_aktif', true)
            ->where('waktu_selesai', '>', now());

        if ($kelasId) {
            $query->where('kelas_id', $kelasId);
        } else {
            // Tanpa kelas: jangan expose semua sesi aktif
            $query->whereRaw('1 = 0');
        }

        $sesi = $query->get();

        return response()->json($sesi);
    }

    public function mulaiUjian(Request $request)
    {
        $request->validate([
            'sesi_ujian_id' => 'required|exists:sesi_ujians,id',
            'token' => 'required|string',
        ]);

        $sesi = SesiUjian::with('bankSoal.soals.opsiJawabans')->findOrFail($request->sesi_ujian_id);
        
        if ($sesi->token !== $request->token) {
            return response()->json(['message' => 'Token tidak valid'], 400);
        }

        $now = now();
        if ($now < $sesi->waktu_mulai || $now > $sesi->waktu_selesai) {
            return response()->json(['message' => 'Sesi ujian belum mulai atau sudah berakhir'], 400);
        }

        if (!$sesi->is_aktif) {
            return response()->json(['message' => 'Sesi ujian tidak aktif'], 400);
        }

        $user = $request->user();

        // Pastikan siswa hanya ujian di kelasnya
        $kelasId = $user->resolveSiswaKelasId();
        if (!$kelasId || (int) $sesi->kelas_id !== (int) $kelasId) {
            return response()->json(['message' => 'Sesi ujian tidak untuk kelas Anda'], 403);
        }

        // Check if already started
        $hasil = HasilUjian::firstOrCreate(
            ['sesi_ujian_id' => $sesi->id, 'siswa_id' => $user->id],
            [
                'waktu_mulai' => $now,
                'status' => 'mengerjakan'
            ]
        );

        if ($hasil->status === 'selesai') {
            return response()->json(['message' => 'Anda sudah menyelesaikan ujian ini'], 400);
        }

        $soals = $sesi->bankSoal->soals;

        if ($sesi->is_acak_soal) {
            $soals = $soals->shuffle();
        }

        // Format soals to hide is_benar and map existing answers
        $existingAnswers = JawabanSiswa::where('hasil_ujian_id', $hasil->id)
            ->get()
            ->keyBy('soal_id');

        $formattedSoals = $soals->map(function ($soal) use ($existingAnswers) {
            $opsi = $soal->opsiJawabans->map(function ($o) {
                return [
                    'id' => $o->id,
                    'teks_opsi' => $o->teks_opsi,
                ];
            });

            if ($soal->jenis === 'pg') { // also shuffle options if it's pg
                $opsi = $opsi->shuffle()->values();
            }

            $answer = $existingAnswers->get($soal->id);

            return [
                'id' => $soal->id,
                'jenis' => $soal->jenis,
                'pertanyaan' => $soal->pertanyaan,
                'file_media' => $soal->file_media,
                'opsi_jawabans' => $opsi,
                'jawaban_terpilih' => $answer ? $answer->opsi_jawaban_id : null,
                'jawaban_essay' => $answer ? $answer->jawaban_essay : null,
            ];
        });

        $elapsedSeconds = max(0, Carbon::parse($hasil->waktu_mulai)->diffInSeconds($now));
        $remainingSeconds = max(0, ($sesi->durasi_menit * 60) - $elapsedSeconds);

        return response()->json([
            'hasil_ujian_id' => $hasil->id,
            'waktu_mulai' => $hasil->waktu_mulai,
            'durasi_menit' => $sesi->durasi_menit,
            'durasi_tersisa_menit' => (int) ceil($remainingSeconds / 60),
            'soals' => $formattedSoals,
        ]);
    }

    public function simpanJawaban(Request $request)
    {
        $request->validate([
            'hasil_ujian_id' => 'required|exists:hasil_ujians,id',
            'soal_id' => 'required|exists:soals,id',
            'opsi_jawaban_id' => 'nullable|exists:opsi_jawabans,id',
            'jawaban_essay' => 'nullable|string',
        ]);

        $hasil = HasilUjian::findOrFail($request->hasil_ujian_id);

        if ($hasil->siswa_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($hasil->status === 'selesai') {
            return response()->json(['message' => 'Ujian sudah selesai'], 400);
        }

        $soalValid = $hasil->sesiUjian()->whereHas('bankSoal.soals', fn ($q) => $q->where('soals.id', $request->soal_id))->exists();
        if (!$soalValid) {
            return response()->json(['message' => 'Soal tidak termasuk dalam sesi ujian ini'], 422);
        }

        JawabanSiswa::updateOrCreate(
            ['hasil_ujian_id' => $hasil->id, 'soal_id' => $request->soal_id],
            [
                'opsi_jawaban_id' => $request->opsi_jawaban_id,
                'jawaban_essay' => $request->jawaban_essay,
            ]
        );

        return response()->json(['message' => 'Jawaban disimpan']);
    }

    public function selesaiUjian(Request $request)
    {
        $request->validate([
            'hasil_ujian_id' => 'required|exists:hasil_ujians,id',
        ]);

        $hasil = HasilUjian::with(['sesiUjian.bankSoal.soals.opsiJawabans', 'jawabanSiswas'])->findOrFail($request->hasil_ujian_id);

        if ($hasil->siswa_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($hasil->status === 'selesai') {
            return response()->json(['message' => 'Ujian sudah diselesaikan sebelumnya'], 400);
        }

        DB::beginTransaction();
        try {
            $totalSkorPg = 0;
            $soals = $hasil->sesiUjian->bankSoal->soals->keyBy('id');

            foreach ($hasil->jawabanSiswas as $jawaban) {
                $soal = $soals->get($jawaban->soal_id);
                if ($soal && $soal->jenis === 'pg') {
                    $opsiBenar = $soal->opsiJawabans->where('is_benar', true)->first();
                    if ($opsiBenar && $jawaban->opsi_jawaban_id === $opsiBenar->id) {
                        $skor = $soal->bobot_nilai;
                        $jawaban->update(['skor' => $skor]);
                        $totalSkorPg += $skor;
                    } else {
                        $jawaban->update(['skor' => 0]);
                    }
                } elseif ($soal && in_array($soal->jenis, ['pg_kompleks', 'pgk'], true)) {
                    $selected = collect(explode(',', (string) $jawaban->jawaban_essay))->filter()->map(fn ($id) => (int) trim($id))->sort()->values()->all();
                    $correct = $soal->opsiJawabans->where('is_benar', true)->pluck('id')->map(fn ($id) => (int) $id)->sort()->values()->all();
                    $skor = $selected === $correct ? $soal->bobot_nilai : 0;
                    $jawaban->update(['skor' => $skor]);
                    $totalSkorPg += $skor;
                } elseif ($soal && $soal->jenis === 'bs') {
                    $correct = $soal->opsiJawabans->where('is_benar', true)->first();
                    $isCorrect = $correct && strcasecmp(trim((string) $jawaban->jawaban_essay), trim((string) $correct->teks_opsi)) === 0;
                    $skor = $isCorrect ? $soal->bobot_nilai : 0;
                    $jawaban->update(['skor' => $skor]);
                    $totalSkorPg += $skor;
                }
                // Essay scoring is done manually by teacher later
            }

            // This calculates based on max possible score or just sum of weights?
            // Usually, standard score is (Total Bobot Benar / Total Bobot Maksimal PG) * 100
            $totalBobotMaksimalPg = $soals->whereIn('jenis', ['pg', 'pg_kompleks', 'pgk', 'bs'])->sum('bobot_nilai');
            
            $nilaiPg = 0;
            if ($totalBobotMaksimalPg > 0) {
                $nilaiPg = ($totalSkorPg / $totalBobotMaksimalPg) * 100;
            }

            $hasil->update([
                'status' => 'selesai',
                'waktu_selesai' => now(),
                'nilai_pg' => $nilaiPg,
                'total_nilai' => $nilaiPg, // Update later if essay is graded
            ]);

            // Sync nilai CBT ke tabel nilais untuk Rapor (jika ujian adalah UTS/UAS)
            $tipeUjian = $hasil->sesiUjian->bankSoal->tipe;
            $mapelId = $hasil->sesiUjian->bankSoal->mapel_id;
            $siswaId = $hasil->siswa_id;
            $config = \App\Models\SistemKonfigurasi::first();
            $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';
            $semester = $config ? $config->semester_aktif : 'ganjil';

            $nilaiField = null;
            if (in_array($tipeUjian, ['uts', 'ujian'])) {
                $nilaiField = 'nilai_uts';
            } elseif (in_array($tipeUjian, ['uas', 'ujian'])) {
                $nilaiField = 'nilai_uas';
            }

            if ($nilaiField && $mapelId) {
                \App\Models\Nilai::updateOrCreate(
                    [
                        'siswa_id' => $siswaId,
                        'mapel_id' => $mapelId,
                        'semester' => $semester,
                        'tahun_ajaran' => $tahunAjaran,
                    ],
                    [
                        $nilaiField => round($nilaiPg),
                        'nilai_akhir' => round($nilaiPg),
                        'predikat' => $nilaiPg >= 90 ? 'A' : ($nilaiPg >= 80 ? 'B' : ($nilaiPg >= 75 ? 'C' : 'D')),
                        'guru_id' => $hasil->sesiUjian->bankSoal->guru_id,
                    ]
                );
            }

            DB::commit();

            return response()->json(['message' => 'Ujian selesai', 'nilai_pg' => $nilaiPg]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal menyelesaikan ujian', 'error' => $e->getMessage()], 500);
        }
    }
}
