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

#[Fillable(['name', 'username', 'email', 'password', 'role', 'nip_nisn', 'uid_rfid', 'kelas', 'jabatan', 'phone', 'foto', 'is_active', 'siswa_id'])]
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
        ];
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
}
