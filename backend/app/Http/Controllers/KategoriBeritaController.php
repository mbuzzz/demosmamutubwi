<?php

namespace App\Http\Controllers;

use App\Models\KategoriBerita;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KategoriBeritaController extends Controller
{
    public function index()
    {
        return response()->json(KategoriBerita::query()->orderBy('nama')->get());
    }

    public function publicIndex()
    {
        return response()->json(KategoriBerita::query()->orderBy('nama')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|unique:kategori_beritas,nama|max:255',
        ]);
        $validated['slug'] = Str::slug($validated['nama']);
        
        $kategori = KategoriBerita::create($validated);
        return response()->json($kategori, 201);
    }

    public function update(Request $request, $id)
    {
        $kategori = KategoriBerita::findOrFail($id);
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:kategori_beritas,nama,' . $id,
        ]);
        $validated['slug'] = Str::slug($validated['nama']);

        $kategori->update($validated);
        return response()->json($kategori);
    }

    public function destroy($id)
    {
        KategoriBerita::findOrFail($id)->delete();
        return response()->json(['message' => 'Kategori dihapus']);
    }
}
