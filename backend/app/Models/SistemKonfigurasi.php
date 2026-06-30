<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['tahun_ajaran_aktif', 'semester_aktif', 'kurikulum_aktif_id', 'nama_sekolah', 'logo_sekolah', 'kop_surat', 'slogan', 'telepon', 'email', 'alamat', 'google_maps_embed', 'facebook', 'instagram', 'twitter', 'frontend_primary', 'frontend_secondary'])]
class SistemKonfigurasi extends Model
{
    use HasFactory;

    protected $table = 'sistem_konfigurasi';

    public function kurikulumAktif(): BelongsTo
    {
        return $this->belongsTo(Kurikulum::class, 'kurikulum_aktif_id');
    }
}
