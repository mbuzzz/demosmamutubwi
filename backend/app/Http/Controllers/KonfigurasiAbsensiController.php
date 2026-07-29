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
                'batas_alpha' => '08:00:00',
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

        // Warning: in production, hash the pin
        if (!$config || $config->pin !== $request->pin) {
            return response()->json(['message' => 'PIN absensi tidak valid'], 401);
        }

        return response()->json(['message' => 'PIN valid']);
    }

    public function verifyPinPembayaran(Request $request)
    {
        $request->validate([
            'pin' => 'required|string'
        ]);

        $config = \App\Models\SistemKonfigurasi::first();
        $pinPembayaran = $config ? $config->pin_pembayaran : '654321';

        // Timing safe string comparison
        if (!hash_equals($pinPembayaran, $request->pin)) {
            return response()->json(['message' => 'PIN terminal pembayaran salah'], 401);
        }

        // Issue a temporary token for the terminal (valid for 8 hours)
        // Since the terminal itself is not a specific user, we can create a mock token
        // Or better: require a real Bendahara to login, but for the kiosk flow 
        // we'll find a generic Bendahara or Superadmin to assign this terminal to.
        
        $bendahara = \App\Models\User::whereHasAnyRole(['bendahara', 'superadmin'])->first();
        if (!$bendahara) {
            return response()->json(['message' => 'Tidak ada akun bendahara/admin di sistem untuk menampung transaksi terminal.'], 500);
        }

        $token = $bendahara->createToken('terminal-pembayaran', ['pembayaran:kiosk'], now()->addHours(8))->plainTextToken;

        return response()->json([
            'message' => 'Terminal berhasil diaktifkan',
            'token' => $token,
            'petugas' => $bendahara->name
        ]);
    }
}
