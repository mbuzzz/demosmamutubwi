<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Nilai;
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
            'mata_pelajaran' => 'required|string',
            'nilai_pengetahuan' => 'required|integer|between:0,100',
            'nilai_keterampilan' => 'required|integer|between:0,100',
            'semester' => 'required|string',
            'tahun_ajaran' => 'required|string',
            'keterangan' => 'nullable|string',
        ]);

        $validated['guru_id'] = $user->id;
        $validated['nilai_akhir'] = intval(($validated['nilai_pengetahuan'] + $validated['nilai_keterampilan']) / 2);

        $nilai = Nilai::updateOrCreate(
            [
                'siswa_id' => $validated['siswa_id'],
                'mata_pelajaran' => $validated['mata_pelajaran'],
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
