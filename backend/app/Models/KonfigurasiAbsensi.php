<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KonfigurasiAbsensi extends Model
{
    use HasFactory;

    protected $table = 'konfigurasi_absensis';

    protected $fillable = [
        'pin', 
        'jam_masuk', 
        'jam_pulang', 
        'toleransi_terlambat', 
        'batas_alpha'
    ];
}
