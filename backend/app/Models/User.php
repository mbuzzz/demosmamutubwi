<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'username', 'email', 'password', 'role', 'roles', 'nip_nisn', 'uid_rfid', 'kelas', 'jabatan', 'phone', 'foto', 'is_active', 'siswa_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Atribut yang selalu di-append ke JSON response.
     */
    protected $appends = ['all_roles'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'roles' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Role staf yang boleh digabung (multi-role).
     */
    public const STAFF_ROLES = [
        'superadmin',
        'admin',
        'guru',
        'walikelas',
        'kepala_sekolah',
        'kurikulum',
        'bendahara',
    ];

    /**
     * Mengecek apakah user memiliki minimal salah satu role dari list.
     * Mendukung backward compatibility dengan kolom 'role' tunggal jika array 'roles' kosong.
     */
    public function hasRole(array $allowedRoles): bool
    {
        foreach ($this->all_roles as $r) {
            if (in_array($r, $allowedRoles, true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Mendapatkan semua list role yang dimiliki user (primary + tambahan).
     */
    public function getAllRolesAttribute(): array
    {
        $all = is_array($this->roles) ? $this->roles : [];
        if ($this->role && !in_array($this->role, $all, true)) {
            $all[] = $this->role;
        }

        return array_values(array_unique(array_filter($all)));
    }

    /**
     * Normalisasi multi-role sebelum disimpan.
     * - Siswa / orang_tua: roles = null
     * - Staf: pastikan primary role selalu ada di array roles
     */
    public static function normalizeRolesPayload(array $data): array
    {
        $primary = $data['role'] ?? null;

        if (!$primary || in_array($primary, ['siswa', 'orang_tua'], true)) {
            $data['roles'] = null;

            return $data;
        }

        $roles = $data['roles'] ?? [];
        if (!is_array($roles)) {
            $roles = [];
        }

        // Hanya izinkan role staf
        $roles = array_values(array_unique(array_filter(
            $roles,
            fn ($r) => in_array($r, self::STAFF_ROLES, true)
        )));

        if (!in_array($primary, $roles, true)) {
            $roles[] = $primary;
        }

        $data['roles'] = $roles;

        return $data;
    }

    /**
     * Prioritas role untuk primary display (bukan hak akses).
     * Hak akses tetap dari all_roles / multi-role.
     */
    public static function primaryRolePriority(): array
    {
        return [
            'superadmin' => 1,
            'kepala_sekolah' => 2,
            'kurikulum' => 3,
            'bendahara' => 4,
            'walikelas' => 5,
            'admin' => 6,
            'guru' => 7,
        ];
    }

    /**
     * Tambah role ke multi-role tanpa menghapus role lain.
     * Primary role di-upgrade jika role baru lebih "senior" di hierarki.
     * jabatan (label tampilan) di-update jika $jabatan diisi.
     */
    public function grantRole(string $newRole, ?string $jabatan = null, ?string $kelas = null): void
    {
        if (!in_array($newRole, self::STAFF_ROLES, true)) {
            return;
        }

        $roles = $this->all_roles;
        if (!in_array($newRole, $roles, true)) {
            $roles[] = $newRole;
        }

        $priority = self::primaryRolePriority();
        $currentPri = $priority[$this->role] ?? 99;
        $newPri = $priority[$newRole] ?? 99;

        $payload = [
            'roles' => array_values(array_unique($roles)),
        ];

        // Upgrade primary hanya jika lebih senior; jangan turunkan (mis. kepsek → guru)
        if ($newPri < $currentPri || !in_array($this->role, self::STAFF_ROLES, true)) {
            $payload['role'] = $newRole;
        }

        if ($jabatan !== null) {
            $payload['jabatan'] = $jabatan;
        }

        if ($kelas !== null) {
            $payload['kelas'] = $kelas;
        } elseif ($newRole !== 'walikelas' && $newRole !== 'siswa') {
            // structural non-wali: jangan paksa clear kelas di sini (bisa di-handle caller)
        }

        $this->update($payload);
    }

    /**
     * Cabut role dari multi-role. Primary diganti ke role sisa terbaik.
     */
    public function revokeRole(string $roleToRemove, bool $clearJabatan = false, bool $clearKelas = false): void
    {
        $roles = array_values(array_filter(
            $this->all_roles,
            fn ($r) => $r !== $roleToRemove
        ));

        // Minimal tetap guru jika staf kosong (kecuali benar-benar non-staf)
        if (empty($roles)) {
            $roles = ['guru'];
        }

        $priority = self::primaryRolePriority();
        usort($roles, function ($a, $b) use ($priority) {
            return ($priority[$a] ?? 99) <=> ($priority[$b] ?? 99);
        });

        $payload = [
            'roles' => $roles,
            'role' => $roles[0],
        ];

        if ($clearJabatan) {
            $payload['jabatan'] = null;
        }
        if ($clearKelas) {
            $payload['kelas'] = null;
        }

        $this->update($payload);
    }

    /**
     * Rebuild label jabatan dari penugasan struktural aktif + ringkas mapel.
     */
    public function rebuildJabatanLabel(?string $preferred = null): void
    {
        if ($preferred) {
            $this->update(['jabatan' => $preferred]);
            return;
        }

        $tahun = \App\Services\WaliKelasSyncService::getTahunAjaran();
        $struktural = \App\Models\PenugasanStruktural::where('user_id', $this->id)
            ->where('tahun_ajaran', $tahun)
            ->orderByDesc('id')
            ->get();

        if ($struktural->isNotEmpty()) {
            $labels = $struktural->map(function ($s) {
                if ($s->role_akses === 'walikelas' && $s->kelas_id) {
                    $namaKelas = \App\Models\Kelas::find($s->kelas_id)?->nama;
                    return $namaKelas ? 'Wali Kelas ' . $namaKelas : ($s->jabatan ?: 'Wali Kelas');
                }
                return $s->jabatan ?: $s->role_akses;
            })->filter()->unique()->values();

            $this->update(['jabatan' => $labels->implode(' / ')]);
            return;
        }

        // Fallback: ringkas mapel dari penugasan mengajar
        $mapels = $this->penugasans()
            ->with('mapel')
            ->get()
            ->map(fn ($p) => $p->mapel?->nama)
            ->filter()
            ->unique()
            ->values();

        if ($mapels->isNotEmpty()) {
            $this->update(['jabatan' => 'Guru ' . $mapels->implode(', ')]);
        }
    }

    // --- Relations ---

    /** Pengumpulan tugas siswa (siswa_id FK) */
    public function pengumpulanTugas()
    {
        return $this->hasMany(PengumpulanTugas::class, 'siswa_id');
    }

    /** Hasil ujian CBT (siswa_id FK) */
    public function hasilUjians()
    {
        return $this->hasMany(HasilUjian::class, 'siswa_id');
    }

    /** Absensi siswa (siswa_id FK) */
    public function absensis()
    {
        return $this->hasMany(Absensi::class, 'siswa_id');
    }

    /** Penugasan guru mengajar multi-mapel (guru_id FK) */
    public function penugasans()
    {
        return $this->hasMany(Penugasan::class, 'guru_id');
    }

    /** Hubungan orang tua ke siswa */
    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    /** Riwayat kelas siswa */
    public function riwayatKelas()
    {
        return $this->hasMany(RiwayatKelas::class, 'siswa_id');
    }

    /** Detail kelas aktif siswa (berdasarkan string nama kelas) */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas', 'nama');
    }

    /** Notifikasi untuk pengguna */
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }
}
