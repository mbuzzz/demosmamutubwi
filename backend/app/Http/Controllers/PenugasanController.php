<?php

namespace App\Http\Controllers;

use App\Models\Penugasan;
use App\Models\User;
use App\Models\SistemKonfigurasi;
use Illuminate\Http\Request;

class PenugasanController extends Controller
{
    // GET /api/penugasan (Teaching Assignments)
    public function index(Request $request)
    {
        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

        $query = Penugasan::with(['guru', 'mapel', 'kelas'])
            ->where('tahun_ajaran', $tahunAjaran);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('guru', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($request->has('guru_id') && $request->guru_id) {
            $query->where('guru_id', $request->guru_id);
        }

        if ($request->has('kelas_id') && $request->kelas_id) {
            $query->where('kelas_id', $request->kelas_id);
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    // POST /api/penugasan
    public function store(Request $request)
    {
        $validated = $request->validate([
            'guru_id' => 'required|exists:users,id',
            'mapel_id' => 'required|exists:mapels,id',
            'kelas_id' => 'required|exists:kelas,id',
            'total_jam' => 'required|integer|min:1|max:40',
        ]);

        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

        // Check if duplicate assignment exists in the same academic year
        $exists = Penugasan::where('guru_id', $validated['guru_id'])
            ->where('mapel_id', $validated['mapel_id'])
            ->where('kelas_id', $validated['kelas_id'])
            ->where('tahun_ajaran', $tahunAjaran)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Penugasan mengajar ini sudah ada pada tahun ajaran aktif.'
            ], 422);
        }

        $validated['tahun_ajaran'] = $tahunAjaran;
        $penugasan = Penugasan::create($validated);

        return response()->json([
            'message' => 'Penugasan mengajar berhasil ditambahkan',
            'penugasan' => $penugasan->load(['guru', 'mapel', 'kelas']),
        ], 201);
    }

    // PUT /api/penugasan/{id}
    public function update(Request $request, $id)
    {
        $penugasan = Penugasan::findOrFail($id);

        $validated = $request->validate([
            'guru_id' => 'required|exists:users,id',
            'mapel_id' => 'required|exists:mapels,id',
            'kelas_id' => 'required|exists:kelas,id',
            'total_jam' => 'required|integer|min:1|max:40',
        ]);

        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

        // Check if duplicate assignment exists (excluding current)
        $exists = Penugasan::where('guru_id', $validated['guru_id'])
            ->where('mapel_id', $validated['mapel_id'])
            ->where('kelas_id', $validated['kelas_id'])
            ->where('tahun_ajaran', $tahunAjaran)
            ->where('id', '!=', $penugasan->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Penugasan mengajar serupa sudah ada pada tahun ajaran aktif.'
            ], 422);
        }

        $penugasan->update($validated);

        return response()->json([
            'message' => 'Penugasan mengajar berhasil diperbarui',
            'penugasan' => $penugasan->load(['guru', 'mapel', 'kelas']),
        ]);
    }

    // DELETE /api/penugasan/{id}
    public function destroy($id)
    {
        $penugasan = Penugasan::findOrFail($id);
        $penugasan->delete();

        return response()->json([
            'message' => 'Penugasan mengajar berhasil dihapus',
        ]);
    }

    public function guruClasses(Request $request)
    {
        $guruId = $request->user()->id; // Or you could pass it as a parameter, but assuming auth

        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

        $classes = Penugasan::with(['kelas', 'mapel'])
            ->where('guru_id', $guruId)
            ->where('tahun_ajaran', $tahunAjaran)
            ->get()
            ->groupBy(function ($item) {
                return $item->kelas_id . '-' . $item->mapel_id;
            })
            ->map(function ($group) {
                return $group->first(); // Since it's grouped by both, there should only be one unique combination
            })
            ->values();

        return response()->json($classes);
    }
}
