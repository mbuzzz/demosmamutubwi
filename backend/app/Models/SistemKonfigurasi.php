<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'tahun_ajaran_aktif', 'semester_aktif', 'kurikulum_aktif_id', 
    'nama_sekolah', 'logo_sekolah', 'kop_surat', 'slogan', 'telepon', 'email', 
    'alamat', 'google_maps_embed', 'facebook', 'instagram', 'twitter', 
    'frontend_primary', 'frontend_secondary', 'monitoring_uh_hijau', 'monitoring_uh_kuning',
    // SPMB Content
    'spmb_alur_online', 'spmb_alur_verifikasi', 'spmb_alur_pembayaran', 
    'spmb_alur_tes', 'spmb_alur_pengumuman', 'spmb_biaya_info'
])]
class SistemKonfigurasi extends Model
{
    use HasFactory;

    protected $table = 'sistem_konfigurasi';

    public function kurikulumAktif(): BelongsTo
    {
        return $this->belongsTo(Kurikulum::class, 'kurikulum_aktif_id');
    }
}
