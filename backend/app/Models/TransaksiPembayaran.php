<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiPembayaran extends Model
{
    protected $table = 'transaksi_pembayaran';
    protected $guarded = ['id'];

    public function tagihan()
    {
        return $this->belongsTo(TagihanSiswa::class, 'tagihan_id');
    }

    public function penerima()
    {
        return $this->belongsTo(User::class, 'diterima_oleh_id');
    }
}
