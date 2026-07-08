<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['nama', 'tingkat', 'wali_kelas_id', 'kurikulum_id', 'tahun_ajaran'])]
class Kelas extends Model
{
    use HasFactory;

    protected $table = 'kelas';

    public function waliKelas(): BelongsTo
    {
        return $this->belongsTo(User::class, 'wali_kelas_id');
    }

    /** Penugasan mengajar di kelas ini */
    public function penugasans()
    {
        return $this->hasMany(Penugasan::class, 'kelas_id');
    }

    /** Daftar siswa aktif di kelas ini (berdasarkan nama kelas string) */
    public function siswa()
    {
        return $this->hasMany(User::class, 'kelas', 'nama');
    }

    /** Riwayat pendaftaran kelas siswa */
    public function riwayatSiswa()
    {
        return $this->hasMany(RiwayatKelas::class, 'kelas_id');
    }
}
