<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use App\Models\SistemKonfigurasi;
use Illuminate\Http\Request;

class JadwalController extends Controller
{
    // GET /api/jadwal
    public function index(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id'
        ]);

        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

        $jadwals = Jadwal::with(['mapel', 'guru'])
            ->where('kelas_id', $request->kelas_id)
            ->where('tahun_ajaran', $tahunAjaran)
            ->orderBy('urutan_jam')
            ->get();

        return response()->json($jadwals);
    }

    // POST /api/jadwal/bulk
    public function storeBulk(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'schedules' => 'required|array',
            'schedules.*.hari' => 'required|string',
            'schedules.*.urutan_jam' => 'required|integer',
            'schedules.*.jam_mulai' => 'required|date_format:H:i',
            'schedules.*.jam_selesai' => 'required|date_format:H:i',
            'schedules.*.is_break' => 'required|boolean',
            'schedules.*.label' => 'nullable|string',
            'schedules.*.mapel_id' => 'nullable|exists:mapels,id',
            'schedules.*.guru_id' => 'nullable|exists:users,id',
        ]);

        $kelasId = $request->kelas_id;
        $schedules = $request->schedules;

        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

        // Start a database transaction
        \DB::beginTransaction();

        try {
            // Delete old schedules for this class and active year
            Jadwal::where('kelas_id', $kelasId)
                ->where('tahun_ajaran', $tahunAjaran)
                ->delete();

            // Insert new schedules
            $insertData = [];
            foreach ($schedules as $item) {
                $insertData[] = [
                    'kelas_id' => $kelasId,
                    'hari' => $item['hari'],
                    'urutan_jam' => $item['urutan_jam'],
                    'jam_mulai' => $item['jam_mulai'],
                    'jam_selesai' => $item['jam_selesai'],
                    'is_break' => $item['is_break'],
                    'label' => $item['label'] ?? null,
                    'mapel_id' => $item['mapel_id'] ?? null,
                    'guru_id' => $item['guru_id'] ?? null,
                    'tahun_ajaran' => $tahunAjaran,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            Jadwal::insert($insertData);

            \DB::commit();

            return response()->json([
                'message' => 'Jadwal pelajaran berhasil disimpan',
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan jadwal.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
