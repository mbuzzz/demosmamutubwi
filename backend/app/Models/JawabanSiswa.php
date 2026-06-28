<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JawabanSiswa extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function hasilUjian()
    {
        return $this->belongsTo(HasilUjian::class);
    }

    public function soal()
    {
        return $this->belongsTo(Soal::class);
    }

    public function opsiJawaban()
    {
        return $this->belongsTo(OpsiJawaban::class);
    }
}
