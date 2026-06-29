<?php

namespace App\Http\Controllers;

use App\Models\Testimoni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TestimoniController extends Controller
{
    public function index()
    {
        return response()->json(Testimoni::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'peran' => 'required|string|max:255',
            'teks' => 'required|string',
            'foto' => 'nullable|image|max:2048',
            'is_tampil' => 'boolean',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('images/testimoni', 'public');
        }

        $testimoni = Testimoni::create($validated);
        return response()->json($testimoni, 201);
    }

    public function update(Request $request, $id)
    {
        $testimoni = Testimoni::findOrFail($id);
        
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'peran' => 'required|string|max:255',
            'teks' => 'required|string',
            'foto' => 'nullable|image|max:2048',
            'is_tampil' => 'boolean',
        ]);

        if ($request->hasFile('foto')) {
            if ($testimoni->foto) Storage::disk('public')->delete($testimoni->foto);
            $validated['foto'] = $request->file('foto')->store('images/testimoni', 'public');
        }

        $testimoni->update($validated);
        return response()->json($testimoni);
    }

    public function destroy($id)
    {
        $testimoni = Testimoni::findOrFail($id);
        if ($testimoni->foto) Storage::disk('public')->delete($testimoni->foto);
        $testimoni->delete();
        return response()->json(['message' => 'Testimoni dihapus']);
    }
}
