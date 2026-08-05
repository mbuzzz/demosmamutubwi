<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPembayaran extends Model
{
    protected $table = 'jenis_pembayaran';
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'is_wajib' => 'boolean',
            'nominal_default' => 'float',
        ];
    }

    public function tagihan()
    {
        return $this->hasMany(TagihanSiswa::class, 'jenis_pembayaran_id');
    }
}
