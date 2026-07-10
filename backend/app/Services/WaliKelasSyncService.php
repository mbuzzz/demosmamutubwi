<?php

namespace App\Services;

use App\Models\Kelas;
use App\Models\User;
use App\Models\PenugasanStruktural;
use App\Models\SistemKonfigurasi;

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

                // Update User details
                $user->update([
                    'role' => 'walikelas',
                    'kelas' => $kelas->nama,
                    'jabatan' => 'Wali Kelas ' . $kelas->nama,
                ]);

                // Update or create PenugasanStruktural
                PenugasanStruktural::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'tahun_ajaran' => $tahunAjaran,
                    ],
                    [
                        'role_akses' => 'walikelas',
                        'kelas_id' => $kelas->id,
                        'jabatan' => 'Wali Kelas ' . $kelas->nama,
                    ]
                );
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
            if ($user) {
                // Check if they have another structural role
                $otherStruktural = PenugasanStruktural::where('user_id', $userId)
                    ->where('tahun_ajaran', $tahunAjaran)
                    ->first();

                if ($otherStruktural) {
                    $user->update([
                        'role' => $otherStruktural->role_akses,
                        'kelas' => $otherStruktural->kelas_id ? (Kelas::find($otherStruktural->kelas_id)?->nama ?? null) : null,
                        'jabatan' => $otherStruktural->jabatan,
                    ]);
                } else {
                    $user->update([
                        'role' => 'guru',
                        'kelas' => null,
                        'jabatan' => null,
                    ]);
                }
            }
        }
    }
}
