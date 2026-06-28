<?php

namespace App\Http\Controllers;

use App\Models\KonfigurasiAbsensi;
use Illuminate\Http\Request;

class KonfigurasiAbsensiController extends Controller
{
    public function show()
    {
        $config = KonfigurasiAbsensi::first();
        
        if (!$config) {
            // Default config if not exists
            $config = KonfigurasiAbsensi::create([
                'pin' => str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT),
                'jam_masuk' => '07:00:00',
                'jam_pulang' => '15:00:00',
                'toleransi_terlambat' => 15,
                'batas_alpha' => 60,
            ]);
        }

        return response()->json($config);
    }

    public function update(Request $request)
    {
        $config = KonfigurasiAbsensi::first();

        if (!$config) {
            $config = new KonfigurasiAbsensi();
        }

        $validated = $request->validate([
            'pin' => 'nullable|string',
            'jam_masuk' => 'required|date_format:H:i:s',
            'jam_pulang' => 'required|date_format:H:i:s',
            'toleransi_terlambat' => 'required|integer|min:0',
            'batas_alpha' => 'required|date_format:H:i:s',
        ]);

        if (isset($validated['pin'])) {
            $config->pin = $validated['pin'];
        }
        $config->jam_masuk = $validated['jam_masuk'];
        $config->jam_pulang = $validated['jam_pulang'];
        $config->toleransi_terlambat = $validated['toleransi_terlambat'];
        $config->batas_alpha = $validated['batas_alpha'];
        
        $config->save();

        return response()->json($config);
    }

    public function verifyPin(Request $request)
    {
        $request->validate([
            'pin' => 'required|string'
        ]);

        $config = KonfigurasiAbsensi::first();

        if (!$config || $config->pin !== $request->pin) {
            return response()->json(['message' => 'PIN tidak valid'], 401);
        }

        return response()->json(['message' => 'PIN valid']);
    }
}
