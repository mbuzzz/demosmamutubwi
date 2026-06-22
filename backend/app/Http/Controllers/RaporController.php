<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rapor;
use App\Models\Nilai;
use Illuminate\Support\Facades\Auth;

class RaporController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role === 'siswa') {
            $rapors = Rapor::where('siswa_id', $user->id)->get();
        } else {
            $rapors = Rapor::with('siswa')->get();
        }

        return response()->json($rapors);
    }

    public function show($id)
    {
        $rapor = Rapor::with('siswa')->findOrFail($id);
        $user = Auth::user();

        if ($user->role === 'siswa' && $rapor->siswa_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $nilais = Nilai::where('siswa_id', $rapor->siswa_id)
            ->where('tahun_ajaran', $rapor->tahun_ajaran)
            ->where('semester', $rapor->semester)
            ->get();

        return response()->json([
            'rapor' => $rapor,
            'nilais' => $nilais,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role === 'siswa') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'siswa_id' => 'required|exists:users,id',
            'tahun_ajaran' => 'required|string',
            'semester' => 'required|string',
            'catatan_wali_kelas' => 'nullable|string',
            'status' => 'nullable|string|in:draft,published',
        ]);

        $rapor = Rapor::updateOrCreate(
            [
                'siswa_id' => $validated['siswa_id'],
                'tahun_ajaran' => $validated['tahun_ajaran'],
                'semester' => $validated['semester'],
            ],
            $validated
        );

        return response()->json([
            'message' => 'Rapor saved successfully',
            'rapor' => $rapor,
        ]);
    }
}
