<?php

namespace App\Http\Controllers;

use App\Models\Jurnal;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Penugasan;
use App\Models\SistemKonfigurasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JurnalController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Jurnal::with(['kelas', 'mapel', 'guru']);

        if ($user->role === 'guru') {
            $query->where('guru_id', $user->id);
        }

        if ($request->has('kelas_id') && $request->kelas_id) {
            $query->where('kelas_id', $request->kelas_id);
        }

        if ($request->has('mapel_id') && $request->mapel_id) {
            $query->where('mapel_id', $request->mapel_id);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'mapel_id' => 'required|exists:mapels,id',
            'tanggal' => 'required|date',
            'topik' => 'required|string|max:255',
            'jam_mulai' => 'nullable|string',
            'jam_selesai' => 'nullable|string',
            'kehadiran_json' => 'nullable|array',
        ]);

        // If guru, verify they teach this mapel in this class
        if ($user->role === 'guru') {
            $config = SistemKonfigurasi::first();
            $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';
            $hasPenugasan = Penugasan::where('guru_id', $user->id)
                ->where('kelas_id', $validated['kelas_id'])
                ->where('mapel_id', $validated['mapel_id'])
                ->where('tahun_ajaran', $tahunAjaran)
                ->exists();

            if (!$hasPenugasan) {
                abort(403, 'Anda tidak ditugaskan mengajar mapel tersebut di kelas ini.');
            }
        }

        $validated['guru_id'] = $user->role === 'guru' ? $user->id : ($request->input('guru_id') ?: $user->id);

        $jurnal = Jurnal::create($validated);

        return response()->json([
            'message' => 'Jurnal mengajar berhasil disimpan',
            'data' => $jurnal->load(['kelas', 'mapel', 'guru']),
        ], 201);
    }

    public function show($id)
    {
        $jurnal = Jurnal::with(['kelas', 'mapel', 'guru'])->findOrFail($id);
        return response()->json($jurnal);
    }

    public function update(Request $request, $id)
    {
        $jurnal = Jurnal::findOrFail($id);
        $validated = $request->validate([
            'topik' => 'sometimes|required|string|max:255',
            'jam_mulai' => 'nullable|string',
            'jam_selesai' => 'nullable|string',
            'kehadiran_json' => 'nullable|array',
        ]);

        $jurnal->update($validated);

        return response()->json([
            'message' => 'Jurnal mengajar berhasil diperbarui',
            'data' => $jurnal->load(['kelas', 'mapel', 'guru']),
        ]);
    }

    public function destroy($id)
    {
        $jurnal = Jurnal::findOrFail($id);
        $jurnal->delete();

        return response()->json([
            'message' => 'Jurnal mengajar berhasil dihapus',
        ]);
    }
}
