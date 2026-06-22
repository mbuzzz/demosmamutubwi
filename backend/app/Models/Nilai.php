<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'siswa_id',
    'guru_id',
    'mata_pelajaran',
    'nilai_pengetahuan',
    'nilai_keterampilan',
    'nilai_akhir',
    'semester',
    'tahun_ajaran',
    'keterangan'
])]
class Nilai extends Model
{
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function guru(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_id');
    }
}
