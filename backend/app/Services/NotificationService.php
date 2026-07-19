<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;

class NotificationService
{
    /**
     * Kirim notifikasi in-app ke satu user.
     */
    public static function notify(
        int $userId,
        string $title,
        string $description,
        string $type = 'info'
    ): Notification {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'description' => $description,
            'read' => false,
        ]);
    }

    /**
     * Notifikasi ke semua user dengan salah satu role (primary atau multi-role).
     *
     * @param  array<int, string>  $roles
     * @return int jumlah notifikasi dibuat
     */
    public static function notifyRoles(
        array $roles,
        string $title,
        string $description,
        string $type = 'info'
    ): int {
        $users = User::query()
            ->where(function ($q) use ($roles) {
                $q->whereIn('role', $roles);
                foreach ($roles as $role) {
                    $q->orWhereJsonContains('roles', $role);
                }
            })
            ->where('is_active', true)
            ->get(['id']);

        $count = 0;
        foreach ($users as $user) {
            self::notify($user->id, $title, $description, $type);
            $count++;
        }

        return $count;
    }

    /**
     * Notifikasi keterlambatan absensi staf ke kepsek/kurikulum/admin + staf bersangkutan.
     */
    public static function notifyStaffLate(
        User $staff,
        string $jamMasuk,
        string $statusMasuk = 'terlambat'
    ): void {
        $label = $statusMasuk === 'alpha' ? 'Alpha / melewati batas' : 'Terlambat';
        $title = "Absensi {$label}: {$staff->name}";
        $desc = sprintf(
            '%s (%s) tercatat %s pukul %s. Mohon ditindaklanjuti bila perlu.',
            $staff->name,
            $staff->jabatan ?: ($staff->role ?? 'staf'),
            strtolower($label),
            substr($jamMasuk, 0, 5)
        );

        // Staf yang terlambat
        self::notify(
            $staff->id,
            $statusMasuk === 'alpha' ? 'Anda tercatat Alpha' : 'Anda tercatat Terlambat',
            sprintf('Absensi staf Anda: %s pukul %s.', strtolower($label), substr($jamMasuk, 0, 5)),
            'warning'
        );

        // Oversight: kepsek, kurikulum, admin (kecuali staf yang sama)
        $oversight = User::query()
            ->where(function ($q) {
                $roles = ['kepala_sekolah', 'kurikulum', 'superadmin', 'admin'];
                $q->whereIn('role', $roles);
                foreach ($roles as $role) {
                    $q->orWhereJsonContains('roles', $role);
                }
            })
            ->where('is_active', true)
            ->where('id', '!=', $staff->id)
            ->get(['id']);

        $type = $statusMasuk === 'alpha' ? 'danger' : 'warning';
        foreach ($oversight as $u) {
            self::notify($u->id, $title, $desc, $type);
        }
    }
}
