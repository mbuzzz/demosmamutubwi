<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GelombangPendaftaran extends Model
{
    protected $table = 'gelombang_pendaftarans';

    protected $fillable = [
        'nama', 'tanggal_mulai', 'tanggal_selesai',
        'kuota', 'biaya_pendaftaran', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
            'biaya_pendaftaran' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function pendaftars(): HasMany
    {
        return $this->hasMany(Pendaftar::class, 'gelombang_id');
    }

    public function formFields(): HasMany
    {
        return $this->hasMany(FormField::class, 'gelombang_id');
    }
}
