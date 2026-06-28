<?php

namespace App\Http\Controllers;

use App\Models\Penugasan;
use App\Models\User;
use Illuminate\Http\Request;

class PenugasanController extends Controller
{
    // GET /api/penugasan (Teaching Assignments)
    public function index(Request $request)
    {
        $query = Penugasan::with(['guru', 'mapel', 'kelas']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('guru', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    // POST /api/penugasan
    public function store(Request $request)
    {
        $validated = $request->validate([
            'guru_id' => 'required|exists:users,id',
            'mapel_id' => 'required|exists:mapels,id',
            'kelas_id' => 'required|exists:kelas,id',
            'total_jam' => 'required|integer|min:1',
        ]);

        // Check if duplicate assignment exists
        $exists = Penugasan::where('guru_id', $validated['guru_id'])
            ->where('mapel_id', $validated['mapel_id'])
            ->where('kelas_id', $validated['kelas_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Penugasan mengajar ini sudah ada.'
            ], 422);
        }

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
            'total_jam' => 'required|integer|min:1',
        ]);

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

    // GET /api/penugasan/struktural (Structural Tasks)
    public function getStruktural()
    {
        // Return all employees (roles other than student)
        $users = User::where('role', '!=', 'siswa')
            ->orderBy('name')
            ->get();
        return response()->json($users);
    }

    // PUT /api/penugasan/struktural/{id}
    public function updateStruktural(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'role' => 'required|string|in:superadmin,guru,walikelas,kepala_sekolah,kurikulum,bendahara,admin',
            'jabatan' => 'required|string|max:255',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Tugas struktural berhasil diperbarui',
            'user' => $user,
        ]);
    }
}
