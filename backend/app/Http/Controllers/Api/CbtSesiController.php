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
        $query = SesiUjian::with(['bankSoal.mapel', 'kelas']);

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
        $validated = $request->validate([
            'bank_soal_id' => 'required|exists:bank_soals,id',
            'kelas_id' => 'required|exists:kelas,id',
            'nama_sesi' => 'required|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'durasi_menit' => 'required|integer|min:1',
            'is_acak_soal' => 'boolean',
            'is_aktif' => 'boolean',
        ]);

        $validated['token'] = $this->generateToken();

        $sesiUjian = SesiUjian::create($validated);

        return response()->json([
            'message' => 'Sesi Ujian berhasil dibuat',
            'data' => $sesiUjian
        ], 201);
    }

    public function show(SesiUjian $sesiUjian)
    {
        $sesiUjian->load(['bankSoal.mapel', 'kelas', 'hasilUjians.siswa']);
        return response()->json($sesiUjian);
    }

    public function update(Request $request, SesiUjian $sesiUjian)
    {
        $validated = $request->validate([
            'bank_soal_id' => 'sometimes|exists:bank_soals,id',
            'kelas_id' => 'sometimes|exists:kelas,id',
            'nama_sesi' => 'sometimes|string',
            'waktu_mulai' => 'sometimes|date',
            'waktu_selesai' => 'sometimes|date|after:waktu_mulai',
            'durasi_menit' => 'sometimes|integer|min:1',
            'is_acak_soal' => 'boolean',
            'is_aktif' => 'boolean',
        ]);

        $sesiUjian->update($validated);

        return response()->json([
            'message' => 'Sesi Ujian berhasil diupdate',
            'data' => $sesiUjian
        ]);
    }

    public function destroy(SesiUjian $sesiUjian)
    {
        $sesiUjian->delete();

        return response()->json([
            'message' => 'Sesi Ujian berhasil dihapus'
        ]);
    }

    public function refreshToken(SesiUjian $sesiUjian)
    {
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
