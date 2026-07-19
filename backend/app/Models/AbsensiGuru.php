<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model AbsensiGuru — tabel absensi khusus guru/staf via RFID.
 */
class AbsensiGuru extends Model
{
    use HasFactory;

    protected $table = 'absensi_gurus';

    protected $fillable = [
        'user_id',
        'tanggal',
        'jam_masuk',
        'jam_pulang',
        'status_masuk',
        'status_pulang',
        'metode',
        'uid_rfid',
        'catatan',
        'created_by',
    ];

    protected $appends = ['tipe', 'waktu_masuk', 'waktu_pulang', 'keterangan'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getTipeAttribute()
    {
        return $this->status_masuk;
    }

    public function getWaktuMasukAttribute()
    {
        return $this->jam_masuk;
    }

    public function getWaktuPulangAttribute()
    {
        return $this->jam_pulang;
    }

    public function getKeteranganAttribute()
    {
        return $this->catatan;
    }
}
