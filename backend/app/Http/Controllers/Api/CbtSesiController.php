<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SesiUjian;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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
        ]);

        $bankSoal = \App\Models\BankSoal::findOrFail($validated['bank_soal_id']);
        if ($user) {
            $user->ensureOwnsResource($bankSoal->guru_id);
            $user->ensurePenugasanMapel((int) $bankSoal->mapel_id, (int) $validated['kelas_id']);
        }

        $pengawasIds = $validated['pengawas_ids'] ?? null;
        unset($validated['pengawas_ids']);

        $validated['token'] = $this->generateToken();

        $sesiUjian = SesiUjian::create($validated);

        if ($pengawasIds) {
            $sesiUjian->pengawas()->sync($pengawasIds);
        }
        $sesiUjian->load('pengawas');

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

    private function generateToken($length = 6)
    {
        return strtoupper(Str::random($length));
    }
}
