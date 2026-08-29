<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BankSoal;
use App\Models\HasilUjian;
use App\Models\JawabanSiswa;
use App\Models\PengumpulanTugas;
use App\Models\SesiUjian;
use App\Models\Tugas;
use App\Models\User;
use App\Services\WaliKelasSyncService;
use Illuminate\Http\Request;

/**
 * Monitoring untuk role kurikulum/kepsek/admin.
 * Aggregat:
 *  - Bank soal: berapa bank soal per guru per mapel (dibuat/dipublikasi/draft)
 *  - Sesi ujian: berapa sesi per mapel (aktif/berakhir)
 *  - Partisipasi siswa per sesi: sudah/belum/sedang mengerjakan
 *  - Tugas: per guru & partisipasi siswa (sudah/belum/menunggu nilai)
 */
class MonitoringController extends Controller
{
    public function cbt(Request $request)
    {
        $tahunAjaran = WaliKelasSyncService::getTahunAjaran();
        $semester = $request->input('semester');

        // 1) Bank soal agregat per guru
        $bankPerGuru = BankSoal::with('guru:id,name,username', 'mapel:id,nama')
            ->where('tahun_ajaran', $tahunAjaran)
            ->when($semester, fn ($q) => $q->where('semester', $semester))
            ->selectRaw('guru_id, mapel_id, status, COUNT(*) as total')
            ->groupBy('guru_id', 'mapel_id', 'status')
            ->get()
            ->groupBy('guru_id')
            ->map(function ($rows) {
                $first = $rows->first();
                $guru = $first->guru;
                $byMapel = $rows->groupBy('mapel_id')->map(function ($m) {
                    $first = $m->first();
                    return [
                        'mapel_id' => $first->mapel_id,
                        'mapel_nama' => $first->mapel?->nama,
                        'draft' => $m->where('status', 'draft')->sum('total'),
                        'published' => $m->where('status', 'published')->sum('total'),
                        'total' => $m->sum('total'),
                    ];
                })->values();
                return [
                    'guru' => $guru ? [
                        'id' => $guru->id,
                        'name' => $guru->name,
                        'username' => $guru->username,
                    ] : null,
                    'mapel' => $byMapel,
                    'total_bank_soal' => $rows->sum('total'),
                ];
            })->values();

        // 2) Sesi ujian agregat (per mapel & kelas) + partisipasi siswa
        $sesi = SesiUjian::with(['bankSoal.mapel', 'kelas', 'hasilUjians.siswa'])
            ->where('waktu_selesai', '>=', now()->subDays(60))
            ->when($semester, fn ($q) => $q->where('semester', $semester))
            ->orderByDesc('waktu_mulai')
            ->get()
            ->map(function ($s) {
                $totalSiswa = $s->kelas
                    ? User::whereHasAnyRole(['siswa'])->where('kelas', $s->kelas->nama)->count()
                    : 0;
                $hasilIds = $s->hasilUjians->pluck('id');
                $totalDikerjakan = $hasilIds->count();
                $totalSelesai = $s->hasilUjians->where('status', 'selesai')->count();
                $sedangMengerjakan = $s->hasilUjians->where('status', 'mengerjakan')->count();
                $belumMengerjakan = max(0, $totalSiswa - $totalDikerjakan);

                $avgNilai = $s->hasilUjians->whereNotNull('nilai_pg')->avg('nilai_pg');

                return [
                    'sesi_id' => $s->id,
                    'nama_sesi' => $s->nama_sesi,
                    'mapel' => $s->bankSoal?->mapel?->nama,
                    'kelas' => $s->kelas?->nama,
                    'waktu_mulai' => $s->waktu_mulai,
                    'waktu_selesai' => $s->waktu_selesai,
                    'is_aktif' => (bool) $s->is_aktif,
                    'total_siswa' => $totalSiswa,
                    'sudah_dikerjakan' => $totalDikerjakan,
                    'selesai' => $totalSelesai,
                    'sedang_mengerjakan' => $sedangMengerjakan,
                    'belum_mengerjakan' => $belumMengerjakan,
                    'avg_nilai_pg' => $avgNilai !== null ? round($avgNilai, 1) : null,
                ];
            })->values();

        return response()->json([
            'tahun_ajaran' => $tahunAjaran,
            'ringkasan' => [
                'total_guru_dengan_bank' => $bankPerGuru->count(),
                'total_bank_soal' => $bankPerGuru->sum('total_bank_soal'),
                'total_sesi_aktif' => $sesi->where('is_aktif', true)->count(),
                'total_siswa_belum_mengerjakan' => $sesi->sum('belum_mengerjakan'),
            ],
            'bank_per_guru' => $bankPerGuru,
            'sesi' => $sesi,
        ]);
    }

    public function cbtSesiDetail(Request $request, $sesiId)
    {
        $sesi = SesiUjian::with(['bankSoal.mapel', 'kelas', 'hasilUjians.siswa'])->findOrFail($sesiId);
        $kelasNama = $sesi->kelas?->nama;
        $siswaList = User::whereHasAnyRole(['siswa'])
            ->when($kelasNama, fn ($q) => $q->where('kelas', $kelasNama))
            ->orderBy('name')
            ->get();

        $hasilBySiswa = $sesi->hasilUjians->keyBy('siswa_id');

        $peserta = $siswaList->map(function ($s) use ($hasilBySiswa, $sesi) {
            $h = $hasilBySiswa->get($s->id);
            $dijawab = 0;
            if ($h) {
                $dijawab = JawabanSiswa::where('hasil_ujian_id', $h->id)->count();
            }
            return [
                'siswa_id' => $s->id,
                'nama_siswa' => $s->name,
                'username' => $s->username,
                'status' => $h?->status ?? 'belum',
                'dijawab' => $dijawab,
                'total_soal' => $sesi->bankSoal?->soals?->count() ?? 0,
                'nilai_pg' => $h?->nilai_pg,
                'waktu_mulai' => $h?->waktu_mulai,
                'waktu_selesai' => $h?->waktu_selesai,
            ];
        })->values();

        return response()->json([
            'sesi' => [
                'id' => $sesi->id,
                'nama_sesi' => $sesi->nama_sesi,
                'mapel' => $sesi->bankSoal?->mapel?->nama,
                'kelas' => $kelasNama,
            ],
            'peserta' => $peserta,
        ]);
    }

    public function lms(Request $request)
    {
        $tahunAjaran = WaliKelasSyncService::getTahunAjaran();
        $semester = $request->input('semester');

        // 1) Tugas per guru
        $tugasPerGuru = Tugas::with('guru:id,name,username', 'mapel:id,nama', 'kelas')
            ->where('tahun_ajaran', $tahunAjaran)
            ->when($semester, fn ($q) => $q->where('semester', $semester))
            ->orderByDesc('id')
            ->get()
            ->groupBy('guru_id')
            ->map(function ($rows) {
                $first = $rows->first();
                return [
                    'guru' => $first->guru ? [
                        'id' => $first->guru->id,
                        'name' => $first->guru->name,
                        'username' => $first->guru->username,
                    ] : null,
                    'total_tugas' => $rows->count(),
                    'tugas' => $rows->map(function ($t) {
                        return [
                            'id' => $t->id,
                            'judul' => $t->judul,
                            'mapel' => $t->mapel?->nama,
                            'kelas' => $t->kelas->pluck('nama'),
                            'tenggat' => $t->tenggat_waktu,
                            'status' => $t->status,
                        ];
                    })->values(),
                ];
            })->values();

        // 2) Partisipasi per tugas: total siswa di kelas tugas vs pengumpulan
        $tugasPartisipasi = Tugas::with(['kelas', 'pengumpulanTugas'])
            ->where('tahun_ajaran', $tahunAjaran)
            ->when($semester, fn ($q) => $q->where('semester', $semester))
            ->get()->map(function ($t) {
            $kelasNames = $t->kelas->pluck('nama')->all();
            $totalSiswa = User::whereHasAnyRole(['siswa'])
                ->whereIn('kelas', $kelasNames)
                ->count();
            $kumpul = $t->pengumpulanTugas->count();
            $sudahDinilai = $t->pengumpulanTugas->where('status', 'sudah_dinilai')->count();
            $menunggu = $t->pengumpulanTugas->where('status', 'belum_dinilai')->count();
            $terlambat = $t->pengumpulanTugas->where('status', 'telat')->count();
            $belumKumpul = max(0, $totalSiswa - $kumpul);
            return [
                'tugas_id' => $t->id,
                'judul' => $t->judul,
                'guru_id' => $t->guru_id,
                'kelas' => $kelasNames,
                'tenggat' => $t->tenggat_waktu,
                'total_siswa' => $totalSiswa,
                'sudah_kumpul' => $kumpul,
                'sudah_dinilai' => $sudahDinilai,
                'menunggu_nilai' => $menunggu,
                'terlambat' => $terlambat,
                'belum_kumpul' => $belumKumpul,
            ];
        })->values();

        return response()->json([
            'tahun_ajaran' => $tahunAjaran,
            'ringkasan' => [
                'total_tugas' => $tugasPerGuru->sum('total_tugas'),
                'total_tugas_aktif' => $tugasPartisipasi->where('tenggat', '>=', now())->count(),
                'total_siswa_belum_kumpul' => $tugasPartisipasi->sum('belum_kumpul'),
            ],
            'tugas_per_guru' => $tugasPerGuru,
            'tugas_partisipasi' => $tugasPartisipasi,
        ]);
    }
}
