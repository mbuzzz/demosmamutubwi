<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pendaftar extends Model
{
    protected $table = 'pendaftars';

    protected $fillable = [
        'gelombang_id', 'nisn', 'nama_lengkap', 'asal_sekolah',
        'email', 'no_hp', 'alamat', 'status', 'data_form',
    ];

    protected function casts(): array
    {
        return [
            'data_form' => 'array',
        ];
    }

    public function gelombang(): BelongsTo
    {
        return $this->belongsTo(GelombangPendaftaran::class, 'gelombang_id');
    }
}
