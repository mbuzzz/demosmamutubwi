<?php

namespace App\Http\Controllers;

use App\Models\SistemKonfigurasi;
use App\Models\Kurikulum;
use Illuminate\Http\Request;

class SistemKonfigurasiController extends Controller
{
    public function show()
    {
        $config = SistemKonfigurasi::with('kurikulumAktif')->first();
        if (!$config) {
            $config = SistemKonfigurasi::create([
                'tahun_ajaran_aktif' => '2025/2026',
                'semester_aktif' => 'ganjil',
                'kurikulum_aktif_id' => null,
            ]);
        }
        return response()->json($config);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran_aktif' => 'sometimes|string',
            'semester_aktif' => 'sometimes|string|in:ganjil,genap',
            'kurikulum_aktif_id' => 'sometimes|nullable|exists:kurikulums,id',
            'nama_sekolah' => 'sometimes|string',
            'slogan' => 'sometimes|nullable|string',
            'telepon' => 'sometimes|nullable|string',
            'email' => 'sometimes|nullable|email',
            'alamat' => 'sometimes|nullable|string',
            'google_maps_embed' => 'sometimes|nullable|string',
            'facebook' => 'sometimes|nullable|string',
            'instagram' => 'sometimes|nullable|string',
            'twitter' => 'sometimes|nullable|string',
            // SPMB Content
            'spmb_alur_online' => 'sometimes|nullable|string',
            'spmb_alur_verifikasi' => 'sometimes|nullable|string',
            'spmb_alur_pembayaran' => 'sometimes|nullable|string',
            'spmb_alur_tes' => 'sometimes|nullable|string',
            'spmb_alur_pengumuman' => 'sometimes|nullable|string',
            'spmb_biaya_info' => 'sometimes|nullable|string',
        ]);

        $config = SistemKonfigurasi::first();
        if (!$config) {
            $config = SistemKonfigurasi::create($validated);
        } else {
            $config->update($validated);
        }

        if ($request->hasFile('logo_sekolah')) {
            $path = $request->file('logo_sekolah')->store('images', 'public');
            $config->update(['logo_sekolah' => '/storage/' . $path]);
        }

        if ($request->hasFile('kop_surat')) {
            $path = $request->file('kop_surat')->store('images', 'public');
            $config->update(['kop_surat' => '/storage/' . $path]);
        }

        return response()->json([
            'message' => 'Konfigurasi sistem berhasil diperbarui',
            'config' => $config->load('kurikulumAktif'),
        ]);
    }

    public function getAvailableOptions()
    {
        $kurikulums = Kurikulum::orderBy('nama')->get(['id', 'nama', 'tahun_ajaran', 'status']);
        return response()->json([
            'kurikulums' => $kurikulums,
        ]);
    }
}
