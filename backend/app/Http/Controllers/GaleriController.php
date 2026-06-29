<?php

namespace App\Http\Controllers;

use App\Models\Galeri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GaleriController extends Controller
{
    public function index()
    {
        return response()->json(Galeri::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'image' => 'required|image|max:2048',
            'kategori' => 'required|string',
            'is_highlight' => 'boolean',
        ]);

        $validated['image_url'] = $request->file('image')->store('images/galeri', 'public');
        
        $galeri = Galeri::create($validated);
        return response()->json($galeri, 201);
    }

    public function update(Request $request, $id)
    {
        $galeri = Galeri::findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'kategori' => 'required|string',
            'is_highlight' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($galeri->image_url) Storage::disk('public')->delete($galeri->image_url);
            $validated['image_url'] = $request->file('image')->store('images/galeri', 'public');
        }

        $galeri->update($validated);
        return response()->json($galeri);
    }

    public function destroy($id)
    {
        $galeri = Galeri::findOrFail($id);
        if ($galeri->image_url) Storage::disk('public')->delete($galeri->image_url);
        $galeri->delete();
        return response()->json(['message' => 'Galeri dihapus']);
    }
}
