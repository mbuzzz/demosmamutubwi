<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PenugasanStruktural extends Model
{
    use HasFactory;

    protected $table = 'penugasan_strukturals';

    protected $fillable = [
        'user_id',
        'role_akses',
        'jabatan',
        'kelas_id',
        'tahun_ajaran',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function scopeByTahunAjaran($query, $tahun_ajaran)
    {
        return $query->where('tahun_ajaran', $tahun_ajaran);
    }
}
