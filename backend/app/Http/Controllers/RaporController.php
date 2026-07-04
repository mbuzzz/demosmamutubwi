<?php

namespace App\Http\Controllers;

use App\Models\Rapor;
use App\Models\User;
use App\Models\Nilai;
use App\Models\NilaiEkskul;
use App\Models\SistemKonfigurasi;
use App\Models\Kurikulum;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class RaporController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Rapor::with(['siswa', 'nilaiEkskuls.ekskul']);

        if ($user) {
            if ($user->role === 'siswa') {
                $query->where('siswa_id', $user->id);
            } elseif ($user->role === 'orang_tua') {
                $query->where('siswa_id', $user->siswa_id);
            }
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('siswa', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $rapor = Rapor::with(['siswa', 'nilaiEkskuls.ekskul', 'sikaps'])->findOrFail($id);
        $user = auth()->user();
        if ($user) {
            if ($user->role === 'siswa' && $rapor->siswa_id != $user->id) {
                abort(403, 'Unauthorized');
            }
            if ($user->role === 'orang_tua' && $rapor->siswa_id != $user->siswa_id) {
                abort(403, 'Unauthorized');
            }
        }
        $siswa = $rapor->siswa;

        // Get class info
        $kelas = Kelas::where('nama', $siswa->kelas)->first();
        
        // Get active curriculum
        $config = SistemKonfigurasi::first();
        $kurikulum = null;
        if ($kelas && $kelas->kurikulum_id) {
            $kurikulum = Kurikulum::find($kelas->kurikulum_id);
        }
        if (!$kurikulum && $config && $config->kurikulum_aktif_id) {
            $kurikulum = Kurikulum::find($config->kurikulum_aktif_id);
        }
        
        // Get student grades
        $nilais = Nilai::with('mapel')
            ->where('siswa_id', $siswa->id)
            ->where('tahun_ajaran', $rapor->tahun_ajaran)
            ->where('semester', $rapor->semester)
            ->get();

        // Create default sikaps if none exist
        if ($rapor->sikaps->isEmpty()) {
            $rapor->sikaps()->create([
                'sikap' => 'spiritual',
                'deskripsi' => 'Baik, sangat rajin melaksanakan sholat dhuha dan dhuhur berjamaah.'
            ]);
            $rapor->sikaps()->create([
                'sikap' => 'sosial',
                'deskripsi' => 'Sangat Baik, menunjukkan sikap santun kepada guru dan kepedulian tinggi terhadap teman.'
            ]);
            $rapor->load('sikaps');
        }

        return response()->json([
            'rapor' => $rapor,
            'nilais' => $nilais,
            'kurikulum' => $kurikulum,
            'wali_kelas_name' => $kelas && $kelas->wali_kelas_id ? optional(User::find($kelas->wali_kelas_id))->name ?? '—' : '—',
            'kepsek_name' => optional(User::where('role', 'kepala_sekolah')->first())->name ?? 'Drs. H. Sugeng, M.Pd',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:users,id',
            'tahun_ajaran' => 'required|string',
            'semester' => 'required|string|in:ganjil,genap',
            'catatan_wali_kelas' => 'nullable|string',
            'sakit' => 'integer|min:0',
            'izin' => 'integer|min:0',
            'alpha' => 'integer|min:0',
            'terlambat' => 'integer|min:0',
            'status' => 'string|in:draft,published',
        ]);

        $rapor = Rapor::create($validated);

        return response()->json([
            'message' => 'Rapor berhasil dibuat',
            'rapor' => $rapor,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $rapor = Rapor::findOrFail($id);

        $validated = $request->validate([
            'catatan_wali_kelas' => 'nullable|string',
            'sakit' => 'integer|min:0',
            'izin' => 'integer|min:0',
            'alpha' => 'integer|min:0',
            'terlambat' => 'integer|min:0',
            'status' => 'string|in:draft,published',
        ]);

        $rapor->update($validated);

        return response()->json([
            'message' => 'Rapor berhasil diperbarui',
            'rapor' => $rapor,
        ]);
    }

    public function publish($id)
    {
        $rapor = Rapor::findOrFail($id);
        $rapor->update(['status' => 'published']);

        return response()->json([
            'message' => 'Rapor berhasil dipublikasikan ke siswa',
            'rapor' => $rapor,
        ]);
    }

    // Generate Dynamic PDF Rapor
    public function exportPdf($id)
    {
        $rapor = Rapor::with('siswa')->findOrFail($id);
        $user = auth()->user();
        if ($user) {
            if ($user->role === 'siswa' && $rapor->siswa_id != $user->id) {
                abort(403, 'Unauthorized');
            }
            if ($user->role === 'orang_tua' && $rapor->siswa_id != $user->siswa_id) {
                abort(403, 'Unauthorized');
            }
        }
        $siswa = $rapor->siswa;

        // Get class info for this student
        // We can check riwayat_kelas or the student's current kelas field
        $kelas = Kelas::where('nama', $siswa->kelas)->first();
        
        // Get active curriculum
        $config = SistemKonfigurasi::first();
        $kurikulum = null;
        if ($kelas && $kelas->kurikulum_id) {
            $kurikulum = Kurikulum::find($kelas->kurikulum_id);
        }
        if (!$kurikulum && $config && $config->kurikulum_aktif_id) {
            $kurikulum = Kurikulum::find($config->kurikulum_aktif_id);
        }
        if (!$kurikulum) {
            $kurikulum = Kurikulum::where('status', 'aktif')->first() ?: new Kurikulum([
                'nama' => 'Kurikulum Merdeka',
                'rapor_template' => []
            ]);
        }

        // Get student grades
        $nilais = Nilai::with('mapel')
            ->where('siswa_id', $siswa->id)
            ->where('tahun_ajaran', $rapor->tahun_ajaran)
            ->where('semester', $rapor->semester)
            ->get();

        // Get extracurricular grades
        $nilaiEkskuls = NilaiEkskul::with('ekskul')
            ->where('rapor_id', $rapor->id)
            ->get();

        // Resolve dynamic signatures
        $waliKelasName = 'Belum Ditentukan';
        if ($kelas && $kelas->wali_kelas_id) {
            $wali = User::find($kelas->wali_kelas_id);
            if ($wali) $waliKelasName = $wali->name;
        }

        $kepsekName = 'Drs. H. Sugeng, M.Pd';
        $kepsek = User::where('role', 'kepala_sekolah')->first();
        if ($kepsek) {
            $kepsekName = $kepsek->name;
        }

        // Compile HTML template dynamically based on $kurikulum->rapor_template blocks
        $template = $kurikulum->rapor_template ?: [
            ['id' => 'kop', 'type' => 'kop_surat', 'visible' => true, 'properties' => ['mode' => 'text_only']],
            ['id' => 'biodata', 'type' => 'biodata_siswa', 'visible' => true],
            ['id' => 'nilai', 'type' => 'tabel_nilai', 'visible' => true],
            ['id' => 'ekskul', 'type' => 'tabel_ekskul', 'visible' => true],
            ['id' => 'absensi', 'type' => 'tabel_absensi', 'visible' => true],
            ['id' => 'ttd', 'type' => 'signatures', 'visible' => true, 'properties' => ['layout' => 'two_columns']]
        ];

        // We can pass all these variables to a master Blade view which will render the blocks conditionally
        $pdf = Pdf::loadView('exports.rapor_pdf', compact(
            'rapor',
            'siswa',
            'kelas',
            'kurikulum',
            'nilais',
            'nilaiEkskuls',
            'waliKelasName',
            'kepsekName',
            'template'
        ));

        return $pdf->download("rapor_{$siswa->name}_{$rapor->semester}.pdf");
    }

    public function storeEkskulNilai(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:users,id',
            'ekskul_id' => 'required|exists:ekskuls,id',
            'nilai' => 'required|string|size:1',
            'keterangan' => 'nullable|string',
        ]);

        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';
        $semester = $config ? $config->semester_aktif : 'ganjil';

        // Find or create draft Rapor for the student
        $rapor = Rapor::firstOrCreate([
            'siswa_id' => $request->siswa_id,
            'tahun_ajaran' => $tahunAjaran,
            'semester' => $semester,
        ], [
            'status' => 'draft',
            'sakit' => 0,
            'izin' => 0,
            'alpha' => 0,
            'terlambat' => 0,
        ]);

        $nilaiEkskul = \App\Models\NilaiEkskul::updateOrCreate([
            'rapor_id' => $rapor->id,
            'ekskul_id' => $request->ekskul_id,
        ], [
            'nilai' => $request->nilai,
            'keterangan' => $request->keterangan,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Nilai ekskul berhasil disimpan',
            'data' => $nilaiEkskul->load('ekskul')
        ]);
    }

    public function deleteEkskulNilai($id)
    {
        $nilaiEkskul = \App\Models\NilaiEkskul::findOrFail($id);
        $nilaiEkskul->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Nilai ekskul berhasil dihapus'
        ]);
    }
}
