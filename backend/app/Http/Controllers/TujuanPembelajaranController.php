<?php

namespace App\Http\Controllers;

use App\Models\TujuanPembelajaran;
use Illuminate\Http\Request;

class TujuanPembelajaranController extends Controller
{
    public function index(Request $request)
    {
        $query = TujuanPembelajaran::with('mapel');

        if ($request->has('mapel_id') && $request->mapel_id) {
            $query->where('mapel_id', $request->mapel_id);
        }

        if ($request->has('tingkat') && $request->tingkat) {
            $query->where('tingkat', $request->tingkat);
        }

        return response()->json($query->orderBy('kode')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mapel_id' => 'required|exists:mapels,id',
            'tingkat' => 'required|string|in:X,XI,XII',
            'kode' => 'required|string|max:50',
            'deskripsi' => 'required|string',
        ]);

        $tp = TujuanPembelajaran::create($validated);

        return response()->json([
            'message' => 'Tujuan Pembelajaran berhasil ditambahkan',
            'tp' => $tp->load('mapel'),
        ], 201);
    }

    public function show($id)
    {
        $tp = TujuanPembelajaran::with('mapel')->findOrFail($id);
        return response()->json($tp);
    }

    public function update(Request $request, $id)
    {
        $tp = TujuanPembelajaran::findOrFail($id);

        $validated = $request->validate([
            'mapel_id' => 'required|exists:mapels,id',
            'tingkat' => 'required|string|in:X,XI,XII',
            'kode' => 'required|string|max:50',
            'deskripsi' => 'required|string',
        ]);

        $tp->update($validated);

        return response()->json([
            'message' => 'Tujuan Pembelajaran berhasil diperbarui',
            'tp' => $tp->load('mapel'),
        ]);
    }

    public function destroy($id)
    {
        $tp = TujuanPembelajaran::findOrFail($id);
        $tp->delete();

        return response()->json([
            'message' => 'Tujuan Pembelajaran berhasil dihapus',
        ]);
    }
}
