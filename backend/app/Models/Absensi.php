<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absensi extends Model
{
    use HasFactory;

    protected $table = 'absensis';

    protected $fillable = [
        'siswa_id', 
        'tanggal', 
        'jam_masuk', 
        'jam_pulang', 
        'status_masuk', 
        'status_pulang', 
        'metode', 
        'uid_rfid', 
        'catatan', 
        'created_by'
    ];

    protected $appends = ['user_id', 'tipe', 'waktu_masuk', 'waktu_pulang'];

    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function getUserIdAttribute()
    {
        return $this->siswa_id;
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

    public function admin()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
