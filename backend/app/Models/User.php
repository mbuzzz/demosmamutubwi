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
        ];
    }

    /**
     * Mengecek apakah user memiliki minimal salah satu role dari list.
     * Mendukung backward compatibility dengan kolom 'role' tunggal jika array 'roles' kosong.
     */
    public function hasRole(array $allowedRoles): bool
    {
        // 1. Cek dari single role (default)
        if (in_array($this->role, $allowedRoles)) {
            return true;
        }

        // 2. Cek dari multi role (jika didefinisikan)
        if (is_array($this->roles)) {
            foreach ($this->roles as $r) {
                if (in_array($r, $allowedRoles)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Mendapatkan semua list role yang dimiliki user.
     */
    public function getAllRolesAttribute(): array
    {
        $all = is_array($this->roles) ? $this->roles : [];
        if ($this->role && !in_array($this->role, $all)) {
            $all[] = $this->role;
        }
        return $all;
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

    /** Penugasan guru mengajar (guru_id FK) */
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
