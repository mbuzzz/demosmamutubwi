<?php

namespace App\Http\Controllers;

use App\Models\PenugasanStruktural;
use App\Models\User;
use App\Models\Kelas;
use App\Models\SistemKonfigurasi;
use App\Services\WaliKelasSyncService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

        $sorted = $result->sortBy(fn ($item) => $roleOrder[$item['role_akses']] ?? 99)->values();

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

        // Multi jabatan: boleh beberapa struktural/user/tahun, tapi unik per role_akses
        // (kecuali walikelas: unik per kelas)
        $dupQuery = PenugasanStruktural::where('user_id', $validated['user_id'])
            ->where('tahun_ajaran', $tahunAjaran)
            ->where('role_akses', $validated['role_akses']);

        if ($validated['role_akses'] === 'walikelas' && !empty($validated['kelas_id'])) {
            $dupQuery->where('kelas_id', $validated['kelas_id']);
        }

        if ($dupQuery->exists()) {
            return response()->json([
                'message' => 'User ini sudah memiliki penugasan struktural dengan role/jabatan yang sama pada tahun ajaran aktif.',
            ], 422);
        }

        $validated['tahun_ajaran'] = $tahunAjaran;

        DB::beginTransaction();

        try {
            $user = User::findOrFail($validated['user_id']);

            // Jika user sebelumnya wali di kelas lain, bersihkan
            if ($user->hasRole(['walikelas'])) {
                $oldKelas = Kelas::where('wali_kelas_id', $user->id)->first();
                if ($oldKelas && ($validated['role_akses'] !== 'walikelas' || (int) $validated['kelas_id'] !== (int) $oldKelas->id)) {
                    $oldKelas->update(['wali_kelas_id' => null]);
                    WaliKelasSyncService::cleanupUserWaliRole($user->id, $oldKelas->id, $tahunAjaran);
                    $user->refresh();
                }
            }

            if ($validated['role_akses'] === 'walikelas') {
                $kelas = Kelas::findOrFail($validated['kelas_id']);

                if ($kelas->wali_kelas_id && (int) $kelas->wali_kelas_id !== (int) $user->id) {
                    WaliKelasSyncService::cleanupUserWaliRole($kelas->wali_kelas_id, $kelas->id, $tahunAjaran);
                }

                $kelas->update(['wali_kelas_id' => $user->id]);
                WaliKelasSyncService::syncKelas($kelas);

                $penugasan = PenugasanStruktural::where('user_id', $user->id)
                    ->where('tahun_ajaran', $tahunAjaran)
                    ->first();
            } else {
                // Multi-role safe: tambah role + set label jabatan
                $jabatanLabel = $validated['jabatan'];
                WaliKelasSyncService::applyStrukturalRole($user, $validated['role_akses'], $jabatanLabel);

                $validated['kelas_id'] = null;
                $penugasan = PenugasanStruktural::create($validated);
            }

            DB::commit();

            return response()->json([
                'message' => 'Penugasan struktural berhasil ditambahkan',
                'penugasan' => $penugasan?->load(['user', 'kelas']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal menambahkan penugasan: ' . $e->getMessage());
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

        $dupQuery = PenugasanStruktural::where('user_id', $validated['user_id'])
            ->where('tahun_ajaran', $tahunAjaran)
            ->where('role_akses', $validated['role_akses'])
            ->where('id', '!=', $penugasan->id);

        if ($validated['role_akses'] === 'walikelas' && !empty($validated['kelas_id'])) {
            $dupQuery->where('kelas_id', $validated['kelas_id']);
        }

        if ($dupQuery->exists()) {
            return response()->json([
                'message' => 'User ini sudah memiliki penugasan struktural dengan role/jabatan yang sama pada tahun ajaran aktif.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $user = User::findOrFail($validated['user_id']);
            $oldUser = User::findOrFail($penugasan->user_id);

            // 1. Clean up old assignment
            if ($oldUser->id !== $user->id || $penugasan->role_akses !== $validated['role_akses']) {
                if ($penugasan->role_akses === 'walikelas' && $penugasan->kelas_id) {
                    $oldKelas = Kelas::find($penugasan->kelas_id);
                    if ($oldKelas) {
                        $oldKelas->update(['wali_kelas_id' => null]);
                    }
                }

                // Cabut role lama dari multi-role (role lain tetap); exclude record yang sedang diedit
                WaliKelasSyncService::removeStrukturalRole(
                    $oldUser,
                    $penugasan->role_akses,
                    $tahunAjaran,
                    $penugasan->id
                );
            }

            // 2. Clean current user if leaving wali role
            if ($user->hasRole(['walikelas']) && ($validated['role_akses'] !== 'walikelas' || (int) $validated['kelas_id'] !== (int) $penugasan->kelas_id)) {
                Kelas::where('wali_kelas_id', $user->id)->update(['wali_kelas_id' => null]);
            }

            // 3. Apply new assignment
            if ($validated['role_akses'] === 'walikelas') {
                $kelas = Kelas::findOrFail($validated['kelas_id']);

                if ($kelas->wali_kelas_id && (int) $kelas->wali_kelas_id !== (int) $user->id) {
                    WaliKelasSyncService::cleanupUserWaliRole($kelas->wali_kelas_id, $kelas->id, $tahunAjaran);
                }

                $kelas->update(['wali_kelas_id' => $user->id]);
                WaliKelasSyncService::syncKelas($kelas);
                $penugasan->refresh();
            } else {
                WaliKelasSyncService::applyStrukturalRole($user, $validated['role_akses'], $validated['jabatan']);
                $validated['kelas_id'] = null;
                $penugasan->update($validated);
            }

            DB::commit();

            return response()->json([
                'message' => 'Penugasan struktural berhasil diperbarui',
                'penugasan' => $penugasan->fresh(['user', 'kelas']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal memperbarui penugasan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal memperbarui penugasan.'], 500);
        }
    }

    public function destroy($id)
    {
        $penugasan = PenugasanStruktural::findOrFail($id);

        DB::beginTransaction();

        try {
            $user = User::find($penugasan->user_id);
            $config = SistemKonfigurasi::first();
            $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';

            if ($user) {
                if ($penugasan->role_akses === 'walikelas' && $penugasan->kelas_id) {
                    $kelas = Kelas::find($penugasan->kelas_id);
                    if ($kelas) {
                        $kelas->update(['wali_kelas_id' => null]);
                    }
                }

                // Hapus dulu record, lalu cabut role multi-role
                $roleAkses = $penugasan->role_akses;
                $penugasan->delete();
                WaliKelasSyncService::removeStrukturalRole($user, $roleAkses, $tahunAjaran);
            } else {
                $penugasan->delete();
            }

            DB::commit();

            return response()->json([
                'message' => 'Penugasan struktural berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal menghapus penugasan: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menghapus penugasan.'], 500);
        }
    }
}
