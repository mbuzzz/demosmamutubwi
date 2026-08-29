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
     * Relasi ke stagg/guru.
     */
    public function userStaff()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Alias untuk user staff. Controller KartuRfidController::index
     * menggunakan with('user'); relation ini mendelegasikan ke userStaff.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke siswa.
     */
    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    /**
     * Aksesor dinamis untuk get user mana pun yang ada
     */
    public function getUserAttribute()
    {
        return $this->user_id ? $this->userStaff : $this->siswa;
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
