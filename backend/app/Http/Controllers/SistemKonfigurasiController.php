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
        ]);

        $config = SistemKonfigurasi::first();
        if (!$config) {
            $config = SistemKonfigurasi::create($validated);
        } else {
            $config->update($validated);
        }

        if ($request->hasFile('logo_sekolah')) {
            $path = $request->file('logo_sekolah')->store('images', 'public');
            $config->update(['logo_sekolah' => $path]);
        }

        if ($request->hasFile('kop_surat')) {
            $path = $request->file('kop_surat')->store('images', 'public');
            $config->update(['kop_surat' => $path]);
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
