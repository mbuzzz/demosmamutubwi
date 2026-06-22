<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'siswa_id',
    'tahun_ajaran',
    'semester',
    'catatan_wali_kelas',
    'status'
])]
class Rapor extends Model
{
    public function siswa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function nilais()
    {
        return Nilai::where('siswa_id', $this->siswa_id)
            ->where('tahun_ajaran', $this->tahun_ajaran)
            ->where('semester', $this->semester);
    }
}
