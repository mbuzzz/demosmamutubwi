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

    protected $appends = ['uid_rfid', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function getUidRfidAttribute()
    {
        return $this->uid;
    }

    public function getUserIdAttribute()
    {
        return $this->siswa_id;
    }
}
