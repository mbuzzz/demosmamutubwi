<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankSoal extends Model
{
    use HasFactory;

    protected $fillable = [
        'guru_id',
        'mapel_id',
        'tingkat',
        'judul',
        'tipe',
        'deskripsi',
        'waktu_pengerjaan',
        'status'
    ];

    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    public function soals()
    {
        return $this->hasMany(Soal::class);
    }

    public function sesiUjian()
    {
        return $this->hasMany(SesiUjian::class);
    }
}
