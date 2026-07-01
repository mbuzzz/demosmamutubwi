<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SikapRapor extends Model
{
    use HasFactory;

    protected $fillable = [
        'rapor_id', 'sikap', 'deskripsi'
    ];

    public function rapor()
    {
        return $this->belongsTo(Rapor::class, 'rapor_id');
    }
}
