<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankSoal extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
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
