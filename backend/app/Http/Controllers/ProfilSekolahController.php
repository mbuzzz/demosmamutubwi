<?php

namespace App\Http\Controllers;

use App\Models\ProfilSekolah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfilSekolahController extends Controller
{
    public function show()
    {
        $profil = ProfilSekolah::firstOrCreate([]);
        $config = \App\Models\SistemKonfigurasi::first();
        
        $data = $profil->toArray();
        $data['nama_sekolah'] = $config ? $config->nama_sekolah : 'SMAS Muhammadiyah 1 Banyuwangi';
        $data['akreditasi'] = 'A'; // Or store in SistemKonfigurasi later

        return response()->json($data);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'sejarah_teks' => 'sometimes|nullable|string',
            'visi_teks' => 'sometimes|nullable|string',
            'misi_list' => 'sometimes|nullable|array',
            'kepsek_nama' => 'sometimes|nullable|string',
            'kepsek_nip' => 'sometimes|nullable|string',
            'kepsek_sambutan' => 'sometimes|nullable|string',
        ]);

        $profil = ProfilSekolah::firstOrCreate([]);
        $profil->update($validated);

        if ($request->hasFile('sejarah_foto')) {
            if ($profil->sejarah_foto) Storage::disk('public')->delete($profil->sejarah_foto);
            $path = $request->file('sejarah_foto')->store('images/profil', 'public');
            $profil->update(['sejarah_foto' => $path]);
        }

        if ($request->hasFile('kepsek_foto')) {
            if ($profil->kepsek_foto) Storage::disk('public')->delete($profil->kepsek_foto);
            $path = $request->file('kepsek_foto')->store('images/profil', 'public');
            $profil->update(['kepsek_foto' => $path]);
        }

        return response()->json([
            'message' => 'Profil sekolah berhasil diperbarui',
            'data' => $profil,
        ]);
    }
}
