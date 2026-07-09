<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materi extends Model
{
    use HasFactory;

    protected $table = 'materis';

    protected $fillable = [
        'guru_id',
        'mapel_id',
        'judul',
        'tipe_file',
        'konten',
        'lampiran_url',
        'status',
    ];

    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    public function mapel()
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    public function kelas()
    {
        return $this->belongsToMany(Kelas::class, 'materi_kelas', 'materi_id', 'kelas_id')->withTimestamps();
    }

    public function komentarLms()
    {
        return $this->hasMany(KomentarLms::class, 'materi_id');
    }
}
