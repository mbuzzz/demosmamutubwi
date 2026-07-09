<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        $query = Berita::with(['kategori', 'penulis']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('kategori')) {
            $query->whereHas('kategori', function ($q) use ($request) {
                $q->where('slug', $request->kategori);
            });
        }

        return response()->json($query->latest()->get());
    }

    public function publicIndex(Request $request)
    {
        $query = Berita::with(['kategori', 'penulis'])
            ->where('status', 'published');

        if ($request->has('kategori')) {
            $query->whereHas('kategori', function ($q) use ($request) {
                $q->where('slug', $request->kategori);
            });
        }

        return response()->json($query->latest('published_at')->get());
    }

    public function show($id)
    {
        $berita = Berita::with(['kategori', 'penulis'])->findOrFail($id);
        return response()->json($berita);
    }

    public function publicShow($slug)
    {
        $berita = Berita::with(['kategori', 'penulis'])
            ->where('status', 'published')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($berita);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'kategori_id' => 'required|exists:kategori_beritas,id',
            'konten' => 'required|string',
            'cover_image' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published',
        ]);

        $baseSlug = !empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : Str::slug($validated['judul']);
        $validated['slug'] = $baseSlug ?: ('berita-' . Str::random(6));
        // Ensure uniqueness
        $original = $validated['slug'];
        $i = 1;
        while (Berita::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $original . '-' . $i;
            $i++;
        }

        $validated['penulis_id'] = auth()->id();

        if ($validated['status'] == 'published') {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('images/berita', 'public');
        }

        $berita = Berita::create($validated);
        return response()->json($berita->load(['kategori', 'penulis']), 201);
    }

    public function update(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'kategori_id' => 'required|exists:kategori_beritas,id',
            'konten' => 'required|string',
            'cover_image' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published',
        ]);

        if (!empty($validated['slug'])) {
            $slug = Str::slug($validated['slug']) ?: $berita->slug;
            $original = $slug;
            $i = 1;
            while (Berita::where('slug', $slug)->where('id', '!=', $berita->id)->exists()) {
                $slug = $original . '-' . $i;
                $i++;
            }
            $validated['slug'] = $slug;
        } elseif ($berita->judul !== $validated['judul']) {
            $validated['slug'] = Str::slug($validated['judul']) . '-' . Str::random(5);
        } else {
            unset($validated['slug']);
        }

        if ($berita->status !== 'published' && $validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            if ($berita->cover_image) Storage::disk('public')->delete($berita->cover_image);
            $validated['cover_image'] = $request->file('cover_image')->store('images/berita', 'public');
        }

        $berita->update($validated);
        return response()->json($berita->load(['kategori', 'penulis']));
    }

    public function destroy($id)
    {
        $berita = Berita::findOrFail($id);
        if ($berita->cover_image) Storage::disk('public')->delete($berita->cover_image);
        $berita->delete();
        return response()->json(['message' => 'Berita dihapus']);
    }
}
