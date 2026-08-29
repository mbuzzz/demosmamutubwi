<?php

namespace App\Http\Controllers;

use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TahunAjaranController extends Controller
{
    /**
     * GET /api/tahun-ajarans
     * Listing semua tahun ajaran (urut: aktif dulu, lalu terbaru).
     * Role: superadmin/admin/kurikulum/kepala_sekolah (override di route).
     */
    public function index(Request $request)
    {
        $items = TahunAjaran::orderByDesc('is_active')
            ->orderByDesc('id')
            ->get();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:20|unique:tahun_ajarans,nama',
            'label' => 'nullable|string|max:50',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'status' => 'sometimes|in:draft,aktif,selesai',
            'keterangan' => 'nullable|string|max:500',
        ]);
        $tahunAjaran = TahunAjaran::create($validated);
        return response()->json([
            'message' => 'Tahun ajaran berhasil dibuat',
            'tahun_ajaran' => $tahunAjaran,
        ], 201);
    }

    public function show($id)
    {
        return response()->json(TahunAjaran::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $tahunAjaran = TahunAjaran::findOrFail($id);
        $validated = $request->validate([
            'nama' => ['sometimes', 'string', 'max:20', Rule::unique('tahun_ajarans', 'nama')->ignore($id)],
            'label' => 'nullable|string|max:50',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'status' => 'sometimes|in:draft,aktif,selesai',
            'keterangan' => 'nullable|string|max:500',
        ]);
        $tahunAjaran->update($validated);
        return response()->json([
            'message' => 'Tahun ajaran diperbarui',
            'tahun_ajaran' => $tahunAjaran->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $tahunAjaran = TahunAjaran::findOrFail($id);
        if ($tahunAjaran->is_active) {
            return response()->json([
                'message' => 'Tidak dapat menghapus tahun ajaran yang sedang aktif',
            ], 422);
        }
        $tahunAjaran->delete();
        return response()->json(null, 204);
    }

    /**
     * POST /api/tahun-ajarans/{id}/activate
     * Aktifkan tahun ajaran ini (nonaktifkan yang lain secara atomik).
     */
    public function activate($id)
    {
        $tahunAjaran = TahunAjaran::findOrFail($id);
        $tahunAjaran->activate();
        return response()->json([
            'message' => "Tahun ajaran '{$tahunAjaran->nama}' sekarang aktif",
            'tahun_ajaran' => $tahunAjaran->fresh(),
        ]);
    }
}
