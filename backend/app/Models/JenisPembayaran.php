<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisPembayaran extends Model
{
    protected $table = 'jenis_pembayaran';
    protected $guarded = ['id'];

    public function tagihan()
    {
        return $this->hasMany(TagihanSiswa::class, 'jenis_pembayaran_id');
    }
}
