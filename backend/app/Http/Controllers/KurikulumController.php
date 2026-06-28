<?php

namespace App\Http\Controllers;

use App\Models\Kurikulum;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KurikulumController extends Controller
{
    public function index()
    {
        return response()->json(Kurikulum::orderBy('nama')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tahun_ajaran' => 'required|string',
            'status' => 'required|string|in:aktif,draft',
            'kkm_default' => 'required|integer|min:0|max:100',
            'metode_remedial' => 'required|string',
            'uses_tp' => 'required|boolean',
            'bobot_tugas' => 'required|integer|min:0|max:100',
            'bobot_uts' => 'required|integer|min:0|max:100',
            'bobot_uas' => 'required|integer|min:0|max:100',
            'rumus_penilaian' => 'nullable|array',
            'rapor_template' => 'nullable|array',
            'deskripsi_config' => 'nullable|array',
            'kelas_ids' => 'nullable|array',
            'kelas_ids.*' => 'exists:kelas,id',
        ]);

        // If setting this kurikulum to active, draft others
        if ($validated['status'] === 'aktif') {
            Kurikulum::where('status', 'aktif')->update(['status' => 'draft']);
        }

        $kurikulum = Kurikulum::create($validated);

        // Assign classes (multi-select)
        if (isset($validated['kelas_ids'])) {
            // Remove from other classes
            Kelas::where('kurikulum_id', $kurikulum->id)->update(['kurikulum_id' => null]);
            // Assign to new classes
            Kelas::whereIn('id', $validated['kelas_ids'])->update(['kurikulum_id' => $kurikulum->id]);
        }

        return response()->json([
            'message' => 'Kurikulum berhasil dibuat',
            'kurikulum' => $kurikulum,
        ], 201);
    }

    public function show($id)
    {
        $kurikulum = Kurikulum::findOrFail($id);
        $assignedKelasIds = Kelas::where('kurikulum_id', $id)->pluck('id')->toArray();
        
        return response()->json([
            'kurikulum' => $kurikulum,
            'kelas_ids' => $assignedKelasIds,
        ]);
    }

    public function update(Request $request, $id)
    {
        $kurikulum = Kurikulum::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tahun_ajaran' => 'required|string',
            'status' => 'required|string|in:aktif,draft',
            'kkm_default' => 'required|integer|min:0|max:100',
            'metode_remedial' => 'required|string',
            'uses_tp' => 'required|boolean',
            'bobot_tugas' => 'required|integer|min:0|max:100',
            'bobot_uts' => 'required|integer|min:0|max:100',
            'bobot_uas' => 'required|integer|min:0|max:100',
            'rumus_penilaian' => 'nullable|array',
            'rapor_template' => 'nullable|array',
            'deskripsi_config' => 'nullable|array',
            'kelas_ids' => 'nullable|array',
            'kelas_ids.*' => 'exists:kelas,id',
        ]);

        if ($validated['status'] === 'aktif') {
            Kurikulum::where('id', '!=', $kurikulum->id)->where('status', 'aktif')->update(['status' => 'draft']);
        }

        $kurikulum->update($validated);

        // Assign classes (multi-select)
        if (isset($validated['kelas_ids'])) {
            // Reset old assignments
            Kelas::where('kurikulum_id', $kurikulum->id)->update(['kurikulum_id' => null]);
            // Assign new
            Kelas::whereIn('id', $validated['kelas_ids'])->update(['kurikulum_id' => $kurikulum->id]);
        }

        return response()->json([
            'message' => 'Kurikulum berhasil diperbarui',
            'kurikulum' => $kurikulum,
        ]);
    }

    public function destroy($id)
    {
        $kurikulum = Kurikulum::findOrFail($id);
        $kurikulum->delete();

        return response()->json([
            'message' => 'Kurikulum berhasil dihapus',
        ]);
    }
}
