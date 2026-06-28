<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KartuRfid extends Model
{
    use HasFactory;

    protected $table = 'kartu_rfids';

    protected $fillable = [
        'uid', 
        'siswa_id', 
        'status', 
        'terdaftar'
    ];

    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }
}
