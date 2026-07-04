<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilSekolah extends Model
{
    protected $table = 'profil_sekolahs';
    protected $guarded = ['id'];
    protected $casts = [
        'misi_list' => 'array',
    ];
}
