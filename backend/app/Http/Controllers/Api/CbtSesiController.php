<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HasilUjian;
use App\Models\JawabanSiswa;
use App\Models\SesiUjian;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Services\NotificationService;

class CbtSesiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = SesiUjian::with(['bankSoal.mapel', 'kelas', 'pengawas', 'template']);

        // Guru hanya sesi dari bank soal miliknya / mapel penugasan
        if ($user && $user->shouldScopeAsGuru()) {
            $mapelIds = $user->penugasanMapelIds();
            $query->whereHas('bankSoal', function ($q) use ($user, $mapelIds) {
                $q->where('guru_id', $user->id);
                if (!empty($mapelIds)) {
                    $q->whereIn('mapel_id', $mapelIds);
                } else {
                    $q->whereRaw('1 = 0');
                }
            });
        }

        if ($request->has('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        if ($request->has('is_aktif')) {
            $query->where('is_aktif', $request->is_aktif);
        }

        if ($request->has('semester')) {
            $query->where('semester', $request->semester);
        }

        $sesiUjians = $query->latest()->paginate($request->per_page ?? 10);

        return response()->json($sesiUjians);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'bank_soal_id' => 'required|exists:bank_soals,id',
            'kelas_id' => 'required|exists:kelas,id',
            'nama_sesi' => 'required|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'durasi_menit' => 'required|integer|min:1',
            'is_acak_soal' => 'boolean',
            'is_aktif' => 'boolean',
            'pengawas_ids' => 'nullable|array',
            'pengawas_ids.*' => 'exists:users,id',
            'template_id' => 'nullable|exists:template_cbts,id',
            'semester' => 'sometimes|in:ganjil,genap',
        ]);

        $bankSoal = \App\Models\BankSoal::findOrFail($validated['bank_soal_id']);
        if ($user) {
            $user->ensureOwnsResource($bankSoal->guru_id);
            $user->ensurePenugasanMapel((int) $bankSoal->mapel_id, (int) $validated['kelas_id']);
        }

        $pengawasIds = $validated['pengawas_ids'] ?? null;
        unset($validated['pengawas_ids']);

        $validated['token'] = $this->generateToken();
        $validated['semester'] = $validated['semester'] ?? (\App\Models\SistemKonfigurasi::first()?->semester_aktif ?? 'ganjil');

        $sesiUjian = SesiUjian::create($validated);

        if ($pengawasIds) {
            $sesiUjian->pengawas()->sync($pengawasIds);
        }
        $sesiUjian->load('pengawas');

        // Jika admin/kurikulum membuat sesi untuk bank soal guru lain,
        // kirim CTA langsung ke editor bank soal guru tersebut.
        if ($bankSoal->guru_id && (int) $bankSoal->guru_id !== (int) ($user?->id ?? 0)) {
            try {
                NotificationService::notify(
                    (int) $bankSoal->guru_id,
                    'Ujian baru perlu disiapkan',
                    "Sesi '{$sesiUjian->nama_sesi}' dibuat untuk semester {$sesiUjian->semester}. Silakan lengkapi bank soal sekarang.",
                    'warning',
                    '/panel/guru/soal?bank_soal_id=' . $bankSoal->id
                );
            } catch (\Throwable $e) {
                \Log::warning('Gagal notifikasi bank soal ujian: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Sesi Ujian berhasil dibuat',
            'data' => $sesiUjian
        ], 201);
    }

    public function show(Request $request, SesiUjian $sesiUjian)
    {
        $user = $request->user();
        $sesiUjian->load(['bankSoal.mapel', 'kelas', 'hasilUjians.siswa', 'pengawas', 'template']);
        if ($user && $sesiUjian->bankSoal && $user->shouldScopeAsGuru()) {
            // Pemilik bank soal ATAU pengawas sesi
            $isOwner = (int) $sesiUjian->bankSoal->guru_id === (int) $user->id;
            $isPengawas = $sesiUjian->pengawas->contains('id', $user->id);
            if (!$isOwner && !$isPengawas) {
                abort(403, 'Anda tidak memiliki akses ke sesi ujian ini.');
            }
        }
        return response()->json($sesiUjian);
    }

    public function update(Request $request, SesiUjian $sesiUjian)
    {
        $user = $request->user();
        if ($user) {
            $sesiUjian->loadMissing('bankSoal');
            $user->ensureOwnsResource($sesiUjian->bankSoal?->guru_id);
        }

        $validated = $request->validate([
            'bank_soal_id' => 'sometimes|exists:bank_soals,id',
            'kelas_id' => 'sometimes|exists:kelas,id',
            'nama_sesi' => 'sometimes|string',
            'waktu_mulai' => 'sometimes|date',
            'waktu_selesai' => 'sometimes|date|after:waktu_mulai',
            'durasi_menit' => 'sometimes|integer|min:1',
            'is_acak_soal' => 'boolean',
            'is_aktif' => 'boolean',
            'pengawas_ids' => 'nullable|array',
            'pengawas_ids.*' => 'exists:users,id',
            'template_id' => 'nullable|exists:template_cbts,id',
        ]);

        if ($user && (isset($validated['bank_soal_id']) || isset($validated['kelas_id']))) {
            $bankId = $validated['bank_soal_id'] ?? $sesiUjian->bank_soal_id;
            $kelasId = $validated['kelas_id'] ?? $sesiUjian->kelas_id;
            $bankSoal = \App\Models\BankSoal::findOrFail($bankId);
            $user->ensureOwnsResource($bankSoal->guru_id);
            $user->ensurePenugasanMapel((int) $bankSoal->mapel_id, (int) $kelasId);
        }

        $pengawasIds = $validated['pengawas_ids'] ?? null;
        unset($validated['pengawas_ids']);

        $sesiUjian->update($validated);

        if ($request->has('pengawas_ids')) {
            $sesiUjian->pengawas()->sync($pengawasIds ?? []);
        }
        $sesiUjian->load('pengawas');

        return response()->json([
            'message' => 'Sesi Ujian berhasil diupdate',
            'data' => $sesiUjian
        ]);
    }

    public function destroy(Request $request, SesiUjian $sesiUjian)
    {
        $user = $request->user();
        if ($user) {
            $sesiUjian->loadMissing('bankSoal');
            $user->ensureOwnsResource($sesiUjian->bankSoal?->guru_id);
        }

        $sesiUjian->delete();

        return response()->json([
            'message' => 'Sesi Ujian berhasil dihapus'
        ]);
    }

    public function refreshToken(Request $request, SesiUjian $sesiUjian)
    {
        $user = $request->user();
        if ($user) {
            $sesiUjian->loadMissing('bankSoal');
            $user->ensureOwnsResource($sesiUjian->bankSoal?->guru_id);
        }

        $sesiUjian->update(['token' => $this->generateToken()]);

        return response()->json([
            'message' => 'Token berhasil diperbarui',
            'token' => $sesiUjian->token
        ]);
    }

    /**
     * Live monitor peserta ujian (polling FE).
     */
    public function monitor(Request $request, SesiUjian $sesiUjian)
    {
        $user = $request->user();
        $sesiUjian->load(['bankSoal.mapel', 'bankSoal.soals', 'kelas', 'hasilUjians.siswa', 'pengawas', 'template']);

        if ($user && $sesiUjian->bankSoal && $user->shouldScopeAsGuru()) {
            $isOwner = (int) $sesiUjian->bankSoal->guru_id === (int) $user->id;
            $isPengawas = $sesiUjian->pengawas->contains('id', $user->id);
            if (!$isOwner && !$isPengawas) {
                abort(403, 'Anda tidak memiliki akses monitor sesi ini.');
            }
        }

        $kelasNama = $sesiUjian->kelas?->nama;
        $totalSoal = $sesiUjian->bankSoal?->soals?->count() ?? 0;

        $siswaList = User::whereHasAnyRole(['siswa'])
            ->when($kelasNama, fn ($q) => $q->where('kelas', $kelasNama))
            ->orderBy('name')
            ->get();

        $hasilBySiswa = $sesiUjian->hasilUjians->keyBy('siswa_id');

        $peserta = $siswaList->map(function ($s) use ($hasilBySiswa, $totalSoal) {
            $h = $hasilBySiswa->get($s->id);
            $dijawab = 0;
            if ($h) {
                $dijawab = JawabanSiswa::where('hasil_ujian_id', $h->id)->count();
            }

            return [
                'siswa_id' => $s->id,
                'name' => $s->name,
                'nip_nisn' => $s->nip_nisn,
                'status' => $h?->status ?? 'belum',
                'dijawab' => $dijawab,
                'total_soal' => $totalSoal,
                'nilai_pg' => $h?->nilai_pg,
                'total_nilai' => $h?->total_nilai,
                'waktu_mulai' => $h?->waktu_mulai,
                'waktu_selesai' => $h?->waktu_selesai,
                'hasil_ujian_id' => $h?->id,
            ];
        })->values();

        $now = now();
        $sisaDetik = null;
        if ($sesiUjian->waktu_selesai) {
            $sisaDetik = max(0, $now->diffInSeconds($sesiUjian->waktu_selesai, false));
            if ($sisaDetik < 0) {
                $sisaDetik = 0;
            }
        }

        return response()->json([
            'sesi' => [
                'id' => $sesiUjian->id,
                'nama_sesi' => $sesiUjian->nama_sesi,
                'kelas' => $sesiUjian->kelas?->nama,
                'mapel' => $sesiUjian->bankSoal?->mapel?->nama,
                'token' => $sesiUjian->token,
                'is_aktif' => $sesiUjian->is_aktif,
                'waktu_mulai' => $sesiUjian->waktu_mulai,
                'waktu_selesai' => $sesiUjian->waktu_selesai,
                'durasi_menit' => $sesiUjian->durasi_menit,
                'total_soal' => $totalSoal,
                'sisa_detik' => $sisaDetik,
            ],
            'peserta' => $peserta,
            'stats' => [
                'total' => $peserta->count(),
                'selesai' => $peserta->where('status', 'selesai')->count(),
                'mengerjakan' => $peserta->where('status', 'mengerjakan')->count(),
                'belum' => $peserta->where('status', 'belum')->count(),
            ],
        ]);
    }

    /**
     * Paksa selesaikan ujian 1 siswa.
     */
    public function forceSelesai(Request $request, SesiUjian $sesiUjian, $siswaId)
    {
        $user = $request->user();
        $sesiUjian->load(['bankSoal', 'pengawas']);

        if ($user && $sesiUjian->bankSoal && $user->shouldScopeAsGuru()) {
            $isOwner = (int) $sesiUjian->bankSoal->guru_id === (int) $user->id;
            $isPengawas = $sesiUjian->pengawas->contains('id', $user->id);
            if (!$isOwner && !$isPengawas) {
                abort(403, 'Anda tidak berhak memaksa selesai ujian ini.');
            }
        }

        $hasil = HasilUjian::where('sesi_ujian_id', $sesiUjian->id)
            ->where('siswa_id', $siswaId)
            ->first();

        if (!$hasil) {
            return response()->json(['message' => 'Siswa belum memulai ujian.'], 422);
        }

        if ($hasil->status === 'selesai') {
            return response()->json(['message' => 'Siswa sudah selesai ujian.', 'data' => $hasil]);
        }

        $hasil->update([
            'status' => 'selesai',
            'waktu_selesai' => now(),
        ]);

        return response()->json([
            'message' => 'Ujian siswa dipaksa selesai.',
            'data' => $hasil,
        ]);
    }

    /**
     * Nonaktifkan sesi (akhiri ujian massal).
     */
    public function endSesi(Request $request, SesiUjian $sesiUjian)
    {
        $user = $request->user();
        $sesiUjian->load(['bankSoal', 'pengawas']);

        if ($user && $sesiUjian->bankSoal && $user->shouldScopeAsGuru()) {
            $isOwner = (int) $sesiUjian->bankSoal->guru_id === (int) $user->id;
            $isPengawas = $sesiUjian->pengawas->contains('id', $user->id);
            if (!$isOwner && !$isPengawas) {
                abort(403, 'Anda tidak berhak mengakhiri sesi ini.');
            }
        }

        $sesiUjian->update(['is_aktif' => false]);

        // Force-finish all in progress
        HasilUjian::where('sesi_ujian_id', $sesiUjian->id)
            ->where('status', 'mengerjakan')
            ->update([
                'status' => 'selesai',
                'waktu_selesai' => now(),
            ]);

        return response()->json([
            'message' => 'Sesi ujian diakhiri. Semua peserta yang masih mengerjakan dipaksa selesai.',
            'data' => $sesiUjian->fresh(),
        ]);
    }

    private function generateToken($length = 6)
    {
        return strtoupper(Str::random($length));
    }
}
