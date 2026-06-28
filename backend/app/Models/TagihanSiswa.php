<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TagihanSiswa extends Model
{
    protected $table = 'tagihan_siswa';
    protected $guarded = ['id'];

    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function jenisPembayaran()
    {
        return $this->belongsTo(JenisPembayaran::class, 'jenis_pembayaran_id');
    }

    public function transaksi()
    {
        return $this->hasMany(TransaksiPembayaran::class, 'tagihan_id');
    }
}
