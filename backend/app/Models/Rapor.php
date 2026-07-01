<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['siswa_id', 'tahun_ajaran', 'semester', 'catatan_wali_kelas', 'sakit', 'izin', 'alpha', 'terlambat', 'status'])]
class Rapor extends Model
{
    use HasFactory;

    protected $table = 'rapors';

    public function siswa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function nilaiEkskuls(): HasMany
    {
        return $this->hasMany(NilaiEkskul::class, 'rapor_id');
    }

    public function sikaps(): HasMany
    {
        return $this->hasMany(SikapRapor::class, 'rapor_id');
    }
}
