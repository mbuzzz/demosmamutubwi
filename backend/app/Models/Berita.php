<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Berita extends Model
{
    

    #[Fillable(['judul', 'slug', 'kategori_id', 'konten', 'cover_image', 'status', 'penulis_id', 'published_at'])]
    
    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function kategori()
    {
        return $this->belongsTo(KategoriBerita::class, 'kategori_id');
    }

    public function penulis()
    {
        return $this->belongsTo(User::class, 'penulis_id');
    }
}
