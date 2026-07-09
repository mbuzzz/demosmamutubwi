<?php

namespace App\Http\Controllers;

use App\Models\KartuRfid;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KartuRfidController extends Controller
{
    public function index()
    {
        $kartu = KartuRfid::with('user')->get();
        return response()->json($kartu);
    }

    public function store(Request $request)
    {
        $payload = $request->all();
        // Map frontend fields if present
        if (isset($payload['uid_rfid'])) $payload['uid'] = $payload['uid_rfid'];
        if (isset($payload['user_id'])) $payload['siswa_id'] = $payload['user_id'];

        $request->merge($payload);

        $validated = $request->validate([
            'uid' => 'required|string|unique:kartu_rfids,uid',
            'siswa_id' => 'required|exists:users,id',
            'status' => 'required|in:aktif,nonaktif,hilang',
        ]);

        // Nonaktifkan kartu lama siswa jika ada
        KartuRfid::where('siswa_id', $validated['siswa_id'])->update(['status' => 'nonaktif']);

        $validated['terdaftar'] = now();

        $kartu = KartuRfid::create($validated);

        return response()->json($kartu, 201);
    }

    public function update(Request $request, $id)
    {
        $kartu = KartuRfid::findOrFail($id);

        $payload = $request->all();
        // Map frontend fields if present
        if (isset($payload['uid_rfid'])) $payload['uid'] = $payload['uid_rfid'];
        if (isset($payload['user_id'])) $payload['siswa_id'] = $payload['user_id'];

        $request->merge($payload);

        $validated = $request->validate([
            'uid' => ['required', 'string', Rule::unique('kartu_rfids')->ignore($kartu->id)],
            'siswa_id' => 'required|exists:users,id',
            'status' => 'required|in:aktif,nonaktif,hilang',
        ]);

        $kartu->update($validated);

        return response()->json($kartu);
    }

    public function destroy($id)
    {
        $kartu = KartuRfid::findOrFail($id);
        $kartu->delete();

        return response()->json(null, 204);
    }
}
