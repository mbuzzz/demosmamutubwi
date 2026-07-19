<?php

namespace App\Services;

use App\Models\Kelas;
use App\Models\User;
use App\Models\PenugasanStruktural;
use App\Models\SistemKonfigurasi;

/**
 * Sinkronisasi wali kelas ↔ users.roles (multi-role) ↔ penugasan_strukturals.
 *
 * Jabatan = label tampilan saja (bukan hak akses).
 * Hak akses = role + roles[] multi-role.
 */
class WaliKelasSyncService
{
    /**
     * Get active academic year.
     */
    public static function getTahunAjaran()
    {
        $config = SistemKonfigurasi::first();
        return $config ? $config->tahun_ajaran_aktif : '2025/2026';
    }

    /**
     * Sync when a Kelas is created or updated.
     */
    public static function syncKelas(Kelas $kelas, $oldWaliId = null)
    {
        $newWaliId = $kelas->wali_kelas_id;
        $tahunAjaran = self::getTahunAjaran();

        // 1. If old wali kelas was changed and is different from new wali kelas
        if ($oldWaliId && $oldWaliId != $newWaliId) {
            self::cleanupUserWaliRole($oldWaliId, $kelas->id, $tahunAjaran);
        }

        // 2. If there is a new wali kelas
        if ($newWaliId) {
            $user = User::find($newWaliId);
            if ($user) {
                // Ensure this user is not assigned as wali kelas in other classes
                Kelas::where('wali_kelas_id', $user->id)
                    ->where('id', '!=', $kelas->id)
                    ->update(['wali_kelas_id' => null]);

                // Multi-role: tambah walikelas, jangan hapus guru/bendahara/dll
                $jabatanLabel = 'Wali Kelas ' . $kelas->nama;
                $user->grantRole('walikelas', $jabatanLabel, $kelas->nama);

                // Pastikan role guru tetap ada jika dia juga mengajar (atau biarkan multi-role staf lain)
                // (grantRole tidak menghapus role lain)

                // Multi-struktural: kunci walikelas terpisah dari jabatan lain
                PenugasanStruktural::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'tahun_ajaran' => $tahunAjaran,
                        'role_akses' => 'walikelas',
                    ],
                    [
                        'kelas_id' => $kelas->id,
                        'jabatan' => $jabatanLabel,
                    ]
                );

                $user->rebuildJabatanLabel($jabatanLabel);
            }
        }
    }

    /**
     * Sync when a Kelas is deleted.
     */
    public static function syncKelasDelete(Kelas $kelas)
    {
        $tahunAjaran = self::getTahunAjaran();
        if ($kelas->wali_kelas_id) {
            self::cleanupUserWaliRole($kelas->wali_kelas_id, $kelas->id, $tahunAjaran);
        }

        // Delete any structural penugasan for this class
        PenugasanStruktural::where('kelas_id', $kelas->id)
            ->where('tahun_ajaran', $tahunAjaran)
            ->delete();
    }

    /**
     * Clean up user's wali kelas role if they are no longer assigned as wali kelas for any class.
     */
    public static function cleanupUserWaliRole($userId, $kelasId, $tahunAjaran)
    {
        // Delete PenugasanStruktural for this specific assignment
        PenugasanStruktural::where('user_id', $userId)
            ->where('kelas_id', $kelasId)
            ->where('tahun_ajaran', $tahunAjaran)
            ->delete();

        // Check if the user is still a wali kelas for another class
        $stillWali = Kelas::where('wali_kelas_id', $userId)->exists();
        if (!$stillWali) {
            $user = User::find($userId);
            if (!$user) {
                return;
            }

            // Cabut role walikelas dari multi-role (role lain tetap)
            $user->revokeRole('walikelas', false, true);

            // Rebuild jabatan dari sisa penugasan struktural / mapel
            $otherStruktural = PenugasanStruktural::where('user_id', $userId)
                ->where('tahun_ajaran', $tahunAjaran)
                ->first();

            if ($otherStruktural) {
                $user->grantRole(
                    $otherStruktural->role_akses,
                    $otherStruktural->jabatan,
                    $otherStruktural->kelas_id
                        ? (Kelas::find($otherStruktural->kelas_id)?->nama)
                        : null
                );
                $user->rebuildJabatanLabel($otherStruktural->jabatan);
            } else {
                $user->rebuildJabatanLabel();
            }
        }
    }

    /**
     * Terapkan penugasan struktural non-wali ke user (multi-role safe).
     */
    public static function applyStrukturalRole(User $user, string $roleAkses, ?string $jabatan): void
    {
        $user->grantRole($roleAkses, $jabatan, null);

        // Non-wali: clear kelas binaan di user jika sebelumnya hanya untuk wali
        if ($roleAkses !== 'walikelas' && $user->role !== 'walikelas' && !$user->hasRole(['walikelas'])) {
            $user->update(['kelas' => null]);
        }

        $user->rebuildJabatanLabel($jabatan);
    }

    /**
     * Cabut penugasan struktural dan sinkron multi-role.
     *
     * @param  int|null  $excludePenugasanId  ID penugasan yang sedang dihapus/diganti (abaikan saat cari sisa)
     */
    public static function removeStrukturalRole(
        User $user,
        string $roleAkses,
        string $tahunAjaran,
        $excludePenugasanId = null
    ): void {
        $user->revokeRole(
            $roleAkses,
            false,
            $roleAkses === 'walikelas'
        );

        $query = PenugasanStruktural::where('user_id', $user->id)
            ->where('tahun_ajaran', $tahunAjaran);

        if ($excludePenugasanId) {
            $query->where('id', '!=', $excludePenugasanId);
        }

        $other = $query->first();

        if ($other) {
            $user->grantRole(
                $other->role_akses,
                $other->jabatan,
                $other->kelas_id ? (Kelas::find($other->kelas_id)?->nama) : null
            );
            $user->rebuildJabatanLabel($other->jabatan);
        } else {
            $user->rebuildJabatanLabel();
        }
    }
}
