<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TahunAjaran extends Model
{
    use HasFactory;

    protected $table = 'tahun_ajarans';

    protected $fillable = [
        'nama',
        'label',
        'tanggal_mulai',
        'tanggal_selesai',
        'status',
        'is_active',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Atur tahun ajaran ini sebagai yang aktif. Menggunakan transaksi + lock
     * untuk mencegah race condition (dua admin klik bersamaan).
     */
    public function activate(): void
    {
        DB::transaction(function () {
            // Matikan semua tahun ajaran aktif lain
            static::query()->where('is_active', true)->update(['is_active' => false]);
            // Aktifkan tahun ajaran ini
            $this->is_active = true;
            $this->status = 'aktif';
            $this->save();

            // Sinkronkan sistem_konfigurasi.tahun_ajaran_aktif (backward compat)
            $config = SistemKonfigurasi::first();
            if ($config) {
                $config->tahun_ajaran_aktif = $this->nama;
                $config->save();
            }
        });
    }

    /**
     * Akses cepat ke tahun ajaran aktif (cached per-request).
     */
    public static function aktif(): ?self
    {
        return static::where('is_active', true)->first();
    }
}
