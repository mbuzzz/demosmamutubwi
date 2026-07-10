<?php

namespace App\Http\Controllers;

use App\Models\PenugasanStruktural;
use App\Models\User;
use App\Models\Kelas;
use App\Models\SistemKonfigurasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PenugasanStrukturalController extends Controller
{
    public function index(Request $request)
    {
        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

        $query = PenugasanStruktural::with(['user', 'kelas'])
            ->where('tahun_ajaran', $tahunAjaran);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    /**
     * Public endpoint: Struktur Organisasi Sekolah (no auth required)
     */
    public function publicStruktural()
    {
        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

        $struktural = PenugasanStruktural::with('user')
            ->where('tahun_ajaran', $tahunAjaran)
            ->get();

        $result = $struktural->map(function ($item) {
            return [
                'id'         => $item->id,
                'jabatan'    => $item->jabatan,
                'role_akses' => $item->role_akses,
                'nama'       => $item->user?->name,
                'nip'        => $item->user?->nip_nisn,
                'foto'       => $item->user?->foto,
            ];
        });

        // Sort by role importance
        $roleOrder = [
            'kepala_sekolah' => 1,
            'superadmin'     => 2,
            'kurikulum'      => 3,
            'walikelas'      => 4,
            'bendahara'      => 5,
            'admin'          => 6,
            'guru'           => 7,
        ];

        $sorted = $result->sortBy(fn($item) => $roleOrder[$item['role_akses']] ?? 99)->values();

        return response()->json($sorted);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_akses' => 'required|string|in:superadmin,guru,walikelas,kepala_sekolah,kurikulum,bendahara,admin',
            'jabatan' => 'required_unless:role_akses,walikelas|string|max:255|nullable',
            'kelas_id' => 'required_if:role_akses,walikelas|exists:kelas,id|nullable',
        ]);

        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

        // Check if user already has a structural assignment for this academic year
        $exists = PenugasanStruktural::where('user_id', $validated['user_id'])
            ->where('tahun_ajaran', $tahunAjaran)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'User ini sudah memiliki penugasan struktural pada tahun ajaran aktif.'
            ], 422);
        }

        $validated['tahun_ajaran'] = $tahunAjaran;

        DB::beginTransaction();

        try {
            $user = User::findOrFail($validated['user_id']);

            // If user was previously walikelas, clear their old class
            if ($user->role === 'walikelas') {
                $oldKelas = Kelas::where('wali_kelas_id', $user->id)->first();
                if ($oldKelas) {
                    $oldKelas->update(['wali_kelas_id' => null]);
                    \App\Services\WaliKelasSyncService::cleanupUserWaliRole($user->id, $oldKelas->id, $tahunAjaran);
                }
            }

            if ($validated['role_akses'] === 'walikelas') {
                $kelas = Kelas::findOrFail($validated['kelas_id']);
                
                // Clear any user currently assigned to this class
                if ($kelas->wali_kelas_id) {
                    \App\Services\WaliKelasSyncService::cleanupUserWaliRole($kelas->wali_kelas_id, $kelas->id, $tahunAjaran);
                }

                $kelas->update(['wali_kelas_id' => $user->id]);
                
                // Sync uses updateOrCreate for PenugasanStruktural and sets role/kelas/jabatan on User
                \App\Services\WaliKelasSyncService::syncKelas($kelas);

                // Fetch the created penugasan
                $penugasan = PenugasanStruktural::where('user_id', $user->id)
                    ->where('tahun_ajaran', $tahunAjaran)
                    ->first();
            } else {
                $user->update([
                    'role' => $validated['role_akses'],
                    'kelas' => null,
                    'jabatan' => $validated['jabatan'],
                ]);
                $validated['kelas_id'] = null; // Clear kelas_id if not walikelas
                $penugasan = PenugasanStruktural::create($validated);
            }

            DB::commit();

            return response()->json([
                'message' => 'Penugasan struktural berhasil ditambahkan',
                'penugasan' => $penugasan->load(['user', 'kelas']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Gagal menambahkan penugasan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menambahkan penugasan.'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $penugasan = PenugasanStruktural::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_akses' => 'required|string|in:superadmin,guru,walikelas,kepala_sekolah,kurikulum,bendahara,admin',
            'jabatan' => 'required_unless:role_akses,walikelas|string|max:255|nullable',
            'kelas_id' => 'required_if:role_akses,walikelas|exists:kelas,id|nullable',
        ]);

        $config = SistemKonfigurasi::first();
        $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

        // Check if user already has a structural assignment for this academic year (excluding current)
        $exists = PenugasanStruktural::where('user_id', $validated['user_id'])
            ->where('tahun_ajaran', $tahunAjaran)
            ->where('id', '!=', $penugasan->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'User ini sudah memiliki penugasan struktural lain pada tahun ajaran aktif.'
            ], 422);
        }

        DB::beginTransaction();

        try {
            $user = User::findOrFail($validated['user_id']);
            $oldUser = User::findOrFail($penugasan->user_id);

            // 1. Clean up old user's assignment if user changed or if the role changed
            if ($oldUser->id !== $user->id || $penugasan->role_akses !== $validated['role_akses']) {
                if ($penugasan->role_akses === 'walikelas' && $penugasan->kelas_id) {
                    $oldKelas = Kelas::find($penugasan->kelas_id);
                    if ($oldKelas) {
                        $oldKelas->update(['wali_kelas_id' => null]);
                    }
                }
                
                // Revert old user's role to guru if they have no other structural role
                $otherPenugasans = PenugasanStruktural::where('user_id', $oldUser->id)
                    ->where('id', '!=', $penugasan->id)->count();
                if ($otherPenugasans === 0) {
                    $oldUser->update([
                        'role' => 'guru',
                        'kelas' => null,
                        'jabatan' => null,
                    ]);
                }
            }

            // 2. Clean up current user's role if they were previously assigned to another class
            if ($user->role === 'walikelas' && ($validated['role_akses'] !== 'walikelas' || $validated['kelas_id'] != $penugasan->kelas_id)) {
                Kelas::where('wali_kelas_id', $user->id)->update(['wali_kelas_id' => null]);
            }

            // 3. Apply new assignment
            if ($validated['role_akses'] === 'walikelas') {
                $kelas = Kelas::findOrFail($validated['kelas_id']);
                
                // Clear any user currently assigned to this class
                if ($kelas->wali_kelas_id && $kelas->wali_kelas_id != $user->id) {
                    \App\Services\WaliKelasSyncService::cleanupUserWaliRole($kelas->wali_kelas_id, $kelas->id, $tahunAjaran);
                }

                $kelas->update(['wali_kelas_id' => $user->id]);
                
                // Sync uses updateOrCreate for PenugasanStruktural and sets role/kelas/jabatan on User
                \App\Services\WaliKelasSyncService::syncKelas($kelas);
                
                // Refresh the assignment in-memory to match updated state
                $penugasan->refresh();
            } else {
                $user->update([
                    'role' => $validated['role_akses'],
                    'kelas' => null,
                    'jabatan' => $validated['jabatan'],
                ]);
                $validated['kelas_id'] = null;
                $penugasan->update($validated);
            }

            DB::commit();

            return response()->json([
                'message' => 'Penugasan struktural berhasil diperbarui',
                'penugasan' => $penugasan->load(['user', 'kelas']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Gagal memperbarui penugasan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal memperbarui penugasan.'], 500);
        }
    }

    public function destroy($id)
    {
        $penugasan = PenugasanStruktural::findOrFail($id);

        DB::beginTransaction();

        try {
            $user = User::find($penugasan->user_id);

            if ($user) {
                if ($penugasan->role_akses === 'walikelas' && $penugasan->kelas_id) {
                    $kelas = Kelas::find($penugasan->kelas_id);
                    if ($kelas) {
                        $kelas->update(['wali_kelas_id' => null]);
                    }
                }

                $otherPenugasans = PenugasanStruktural::where('user_id', $user->id)
                    ->where('id', '!=', $penugasan->id)->count();
                if ($otherPenugasans === 0) {
                    $user->update([
                        'role' => 'guru',
                        'kelas' => null,
                        'jabatan' => null,
                    ]);
                } else {
                    $other = PenugasanStruktural::where('user_id', $user->id)
                        ->where('id', '!=', $penugasan->id)->first();
                    if ($other) {
                        $user->update([
                            'role' => $other->role_akses,
                            'kelas' => $other->kelas_id ? (Kelas::find($other->kelas_id)?->nama ?? null) : null,
                            'jabatan' => $other->jabatan,
                        ]);
                    }
                }
            }

            $penugasan->delete();

            DB::commit();

            return response()->json([
                'message' => 'Penugasan struktural berhasil dihapus',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Gagal menghapus penugasan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menghapus penugasan.'], 500);
        }
    }
}
