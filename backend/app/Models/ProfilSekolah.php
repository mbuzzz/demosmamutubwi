<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilSekolah extends Model
{
    use \Illuminate\Database\Eloquent\Attributes\Fillable;

    #[Fillable(['sejarah_teks', 'sejarah_foto', 'visi_teks', 'misi_list', 'kepsek_nama', 'kepsek_nip', 'kepsek_foto', 'kepsek_sambutan'])]
    protected $casts = [
        'misi_list' => 'array',
    ];
}
