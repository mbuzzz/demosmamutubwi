<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AbsensiPiket extends Model
{
    protected $table = 'absensi_pikets';

    protected $fillable = [
        'user_id',
        'jadwal_piket_id',
        'tanggal',
        'status',
        'catatan',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function jadwal()
    {
        return $this->belongsTo(JadwalPiket::class, 'jadwal_piket_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
