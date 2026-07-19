<?php

namespace App\Services;

use App\Models\Kelas;
use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;

class NotificationService
{
    /**
     * Kirim notifikasi in-app ke satu user.
     * Skip jika notifikasi identik sudah dikirim hari ini (anti-spam).
     */
    public static function notify(
        int $userId,
        string $title,
        string $description,
        string $type = 'info',
        ?string $link = null,
        bool $dedupeDaily = true
    ): ?Notification {
        if ($dedupeDaily) {
            $exists = Notification::where('user_id', $userId)
                ->where('title', $title)
                ->whereDate('created_at', Carbon::today())
                ->exists();
            if ($exists) {
                return null;
            }
        }

        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'description' => $description,
            'link' => $link,
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
        string $type = 'info',
        ?string $link = null
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
            if (self::notify($user->id, $title, $description, $type, $link)) {
                $count++;
            }
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
        $link = '/panel/guru/absensi/guru';
        $type = $statusMasuk === 'alpha' ? 'danger' : 'warning';

        // Staf yang terlambat
        self::notify(
            $staff->id,
            $statusMasuk === 'alpha' ? 'Anda tercatat Alpha' : 'Anda tercatat Terlambat',
            sprintf('Absensi staf Anda: %s pukul %s.', strtolower($label), substr($jamMasuk, 0, 5)),
            'warning',
            $link
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

        foreach ($oversight as $u) {
            self::notify($u->id, $title, $desc, $type, $link);
        }
    }

    /**
     * Notifikasi keterlambatan/alpha siswa → siswa, orang tua, wali kelas.
     */
    public static function notifyStudentLate(
        User $siswa,
        string $jamMasuk,
        string $statusMasuk = 'terlambat'
    ): void {
        if (!$siswa->isSiswa()) {
            return;
        }

        $label = $statusMasuk === 'alpha' ? 'Alpha' : 'Terlambat';
        $jam = substr($jamMasuk, 0, 5);
        $type = $statusMasuk === 'alpha' ? 'danger' : 'warning';

        // Siswa
        self::notify(
            $siswa->id,
            "Anda tercatat {$label}",
            sprintf('Absensi gerbang: %s pukul %s. Segera hubungi wali kelas bila ada kendala.', strtolower($label), $jam),
            $type,
            '/panel/siswa/absensi'
        );

        // Orang tua yang terhubung ke siswa ini
        $ortuList = User::query()
            ->where('siswa_id', $siswa->id)
            ->where(function ($q) {
                $q->where('role', 'orang_tua')
                    ->orWhereJsonContains('roles', 'orang_tua');
            })
            ->where('is_active', true)
            ->get(['id']);

        foreach ($ortuList as $ortu) {
            self::notify(
                $ortu->id,
                "Anak {$label}: {$siswa->name}",
                sprintf(
                    '%s (kelas %s) tercatat %s pukul %s via absensi gerbang.',
                    $siswa->name,
                    $siswa->kelas ?: '—',
                    strtolower($label),
                    $jam
                ),
                $type,
                '/panel/siswa/absensi'
            );
        }

        // Wali kelas binaan
        $kelasNama = $siswa->kelas;
        if ($kelasNama) {
            $kelas = Kelas::where('nama', $kelasNama)->first();
            $waliId = $kelas?->wali_kelas_id;
            if ($waliId) {
                self::notify(
                    $waliId,
                    "Siswa binaan {$label}: {$siswa->name}",
                    sprintf(
                        'Siswa %s (kelas %s) tercatat %s pukul %s. Mohon ditindaklanjuti.',
                        $siswa->name,
                        $kelasNama,
                        strtolower($label),
                        $jam
                    ),
                    $type,
                    '/panel/guru/wali-siswa'
                );
            }
        }
    }
}
