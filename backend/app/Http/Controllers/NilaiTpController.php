<?php

namespace App\Http\Controllers;

use App\Models\NilaiTujuanPembelajaran;
use App\Models\TujuanPembelajaran;
use App\Models\User;
use App\Models\Nilai;
use App\Models\Kelas;
use App\Models\Kurikulum;
use App\Models\SistemKonfigurasi;
use Illuminate\Http\Request;

class NilaiTpController extends Controller
{
    // GET /api/nilai-tp/siswa
    // Get all students in a class and their score for a specific TP
    public function getSiswaNilai(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mapel_id' => 'required|exists:mapels,id',
            'tujuan_pembelajaran_id' => 'required|exists:tujuan_pembelajarans,id',
        ]);

        // Get students in class (using users.kelas mapping or riwayat_kelas if seeded)
        $kelas = Kelas::findOrFail($request->class_id ?? $request->kelas_id);
        
        // Query students belonging to this class
        $students = User::where('role', 'siswa')
            ->where('kelas', $kelas->nama)
            ->orderBy('name')
            ->get();

        $tpId = $request->tujuan_pembelajaran_id;
        
        $data = $students->map(function ($student) use ($tpId, $request) {
            $nilaiRecord = NilaiTujuanPembelajaran::where('siswa_id', $student->id)
                ->where('tujuan_pembelajaran_id', $tpId)
                ->first();
                
            return [
                'siswa_id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'nip_nisn' => $student->nip_nisn,
                'nilai' => $nilaiRecord ? $nilaiRecord->nilai : 0,
            ];
        });

        return response()->json($data);
    }

    // POST /api/nilai-tp
    // Save scores for multiple students for a specific TP, and trigger auto-calculations
    public function store(Request $request)
    {
        $request->validate([
            'mapel_id' => 'required|exists:mapels,id',
            'tujuan_pembelajaran_id' => 'required|exists:tujuan_pembelajarans,id',
            'scores' => 'required|array',
            'scores.*.siswa_id' => 'required|exists:users,id',
            'scores.*.nilai' => 'required|integer|min:0|max:100',
        ]);

        $mapelId = $request->mapel_id;
        $tpId = $request->tujuan_pembelajaran_id;
        $guruId = $request->user()->id;

        // Get current academic config
        $config = SistemKonfigurasi::first() ?: new SistemKonfigurasi([
            'tahun_ajaran_aktif' => '2025/2026',
            'semester_aktif' => 'ganjil',
        ]);

        foreach ($request->scores as $scoreItem) {
            $siswaId = $scoreItem['siswa_id'];
            $scoreVal = $scoreItem['nilai'];

            // 1. Save TP score
            NilaiTujuanPembelajaran::updateOrCreate(
                [
                    'siswa_id' => $siswaId,
                    'mapel_id' => $mapelId,
                    'tujuan_pembelajaran_id' => $tpId,
                ],
                [
                    'nilai' => $scoreVal,
                ]
            );

            // 2. Trigger auto-calculations for final report card (Nilai Akhir & Deskripsi)
            $this->recalculateStudentFinalScore($siswaId, $mapelId, $guruId, $config);
        }

        return response()->json([
            'message' => 'Nilai Tujuan Pembelajaran berhasil disimpan dan dikalkulasi otomatis.',
        ]);
    }

    private function recalculateStudentFinalScore($siswaId, $mapelId, $guruId, $config)
    {
        // Get all TP scores for this student and subject
        $tpScores = NilaiTujuanPembelajaran::with('tujuanPembelajaran')
            ->where('siswa_id', $siswaId)
            ->where('mapel_id', $mapelId)
            ->get();

        if ($tpScores->isEmpty()) return;

        // Calculate average TP score (acts as Nilai Tugas / Harian)
        $averageTpScore = round($tpScores->avg('nilai'));

        // Retrieve active curriculum to get formula and description templates
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

        // Get or create Nilai record
        $nilaiRecord = Nilai::firstOrCreate(
            [
                'siswa_id' => $siswaId,
                'mapel_id' => $mapelId,
                'tahun_ajaran' => $config->tahun_ajaran_aktif,
                'semester' => $config->semester_aktif,
            ],
            [
                'guru_id' => $guruId,
                'nilai_tugas' => $averageTpScore,
                'nilai_uts' => 80, // mock default UTS if not filled
                'nilai_uas' => 85, // mock default UAS if not filled
            ]
        );

        // Update Tugas score to be the average of TPs
        $nilaiRecord->nilai_tugas = $averageTpScore;

        // Calculate Nilai Akhir dynamically based on weights
        $bobotTugas = $kurikulum->bobot_tugas ?? 30;
        $bobotUts = $kurikulum->bobot_uts ?? 30;
        $bobotUas = $kurikulum->bobot_uas ?? 40;

        $nilaiAkhir = round(
            ($nilaiRecord->nilai_tugas * $bobotTugas +
             $nilaiRecord->nilai_uts * $bobotUts +
             $nilaiRecord->nilai_uas * $bobotUas) / 100
        );

        $nilaiRecord->nilai_akhir = $nilaiAkhir;

        // Determine Predikat (A, B, C, D)
        $kkm = $kurikulum->kkm_default;
        if ($nilaiAkhir >= 90) $predikat = 'A';
        elseif ($nilaiAkhir >= 80) $predikat = 'B';
        elseif ($nilaiAkhir >= $kkm) $predikat = 'C';
        else $predikat = 'D';

        $nilaiRecord->predikat = $predikat;

        // 3. Generate Descriptive Text automatically based on highest & lowest TPs
        $descConfig = $kurikulum->deskripsi_config ?: [
            'threshold_tinggi' => 80,
            'threshold_rendah' => 75,
            'template_tinggi' => 'Menunjukkan penguasaan yang sangat baik dalam {deskripsi_tp}',
            'template_rendah' => 'perlu bimbingan lebih lanjut dalam {deskripsi_tp}',
            'template_gabungan' => '{kalimat_tinggi}, serta {kalimat_rendah}.'
        ];

        // Find highest TP score
        $highestTp = $tpScores->sortByDesc('nilai')->first();
        // Find lowest TP score
        $lowestTp = $tpScores->sortBy('nilai')->first();

        $kalimatTinggi = '';
        $kalimatRendah = '';

        if ($highestTp && $highestTp->nilai >= ($descConfig['threshold_tinggi'] ?? 80)) {
            $template = $descConfig['template_tinggi'] ?? 'Menunjukkan penguasaan yang sangat baik dalam {deskripsi_tp}';
            $kalimatTinggi = str_replace('{deskripsi_tp}', $highestTp->tujuanPembelajaran->deskripsi, $template);
        }

        if ($lowestTp && $lowestTp->nilai < ($descConfig['threshold_rendah'] ?? 75)) {
            $template = $descConfig['template_rendah'] ?? 'perlu bimbingan lebih lanjut dalam {deskripsi_tp}';
            $kalimatRendah = str_replace('{deskripsi_tp}', $lowestTp->tujuanPembelajaran->deskripsi, $template);
        }

        // Combine sentences
        $catatan = '';
        if ($kalimatTinggi && $kalimatRendah) {
            $template = $descConfig['template_gabungan'] ?? '{kalimat_tinggi}, serta {kalimat_rendah}.';
            $catatan = str_replace(['{kalimat_tinggi}', '{kalimat_rendah}'], [$kalimatTinggi, $kalimatRendah], $template);
        } elseif ($kalimatTinggi) {
            $catatan = $kalimatTinggi . '.';
        } elseif ($kalimatRendah) {
            // Capitalize first letter
            $catatan = ucfirst($kalimatRendah) . '.';
        } else {
            $catatan = 'Menunjukkan perkembangan kompetensi yang cukup pada semua tujuan pembelajaran.';
        }

        // Only save to catatan if the teacher hasn't manually overridden it yet
        if (empty($nilaiRecord->catatan) || str_contains($nilaiRecord->catatan, 'Menunjukkan penguasaan') || str_contains($nilaiRecord->catatan, 'Perlu bimbingan') || str_contains($nilaiRecord->catatan, 'Menunjukkan perkembangan')) {
            $nilaiRecord->catatan = $catatan;
        }

        $nilaiRecord->save();
    }
}
