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
        'user_id',
        'siswa_id',
        'status',
        'terdaftar',
    ];

    protected $appends = ['uid_rfid', 'resolved_user_id'];

    /**
     * user() — resolves to guru/staff (user_id) OR siswa (siswa_id).
     */
    public function user()
    {
        if ($this->user_id) {
            return $this->belongsTo(User::class, 'user_id');
        }
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function getUidRfidAttribute()
    {
        return $this->uid;
    }

    /**
     * resolved_user_id — returns whichever user owns this card.
     */
    public function getResolvedUserIdAttribute()
    {
        return $this->user_id ?? $this->siswa_id;
    }
}
