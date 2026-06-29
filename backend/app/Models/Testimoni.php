<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimoni extends Model
{
    use \Illuminate\Database\Eloquent\Attributes\Fillable;

    #[Fillable(['nama', 'peran', 'teks', 'foto', 'is_tampil'])]
    
    protected $casts = [
        'is_tampil' => 'boolean',
    ];
}
