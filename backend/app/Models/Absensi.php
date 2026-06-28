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

    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
