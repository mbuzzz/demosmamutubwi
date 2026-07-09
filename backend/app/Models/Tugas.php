<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tugas extends Model
{
    use HasFactory;

    protected $table = 'tugas';

    protected $fillable = [
        'guru_id',
        'mapel_id',
        'judul',
        'instruksi',
        'lampiran_url',
        'tenggat_waktu',
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
        return $this->belongsToMany(Kelas::class, 'tugas_kelas', 'tugas_id', 'kelas_id')->withTimestamps();
    }

    public function komentarLms()
    {
        return $this->hasMany(KomentarLms::class, 'tugas_id');
    }

    public function pengumpulanTugas()
    {
        return $this->hasMany(PengumpulanTugas::class, 'tugas_id');
    }
}
