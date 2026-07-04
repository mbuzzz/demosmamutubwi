<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Galeri extends Model
{
    

    #[Fillable(['judul', 'deskripsi', 'image_url', 'kategori', 'is_highlight'])]

    protected $casts = [
        'is_highlight' => 'boolean',
    ];
}
