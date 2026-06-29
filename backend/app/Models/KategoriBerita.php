<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriBerita extends Model
{
    use \Illuminate\Database\Eloquent\Attributes\Fillable;

    #[Fillable(['nama', 'slug'])]
    public function berita()
    {
        return $this->hasMany(Berita::class, 'kategori_id');
    }
}
