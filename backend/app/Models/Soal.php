<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soal extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function bankSoal()
    {
        return $this->belongsTo(BankSoal::class);
    }

    public function opsiJawabans()
    {
        return $this->hasMany(OpsiJawaban::class);
    }
}
