<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['kelas_id', 'hari', 'urutan_jam', 'jam_mulai', 'jam_selesai', 'label', 'is_break', 'mapel_id', 'guru_id', 'tahun_ajaran'])]
class Jadwal extends Model
{
    use HasFactory;

    protected $table = 'jadwals';

    protected function casts(): array
    {
        return [
            'is_break' => 'boolean',
        ];
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function mapel(): BelongsTo
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    public function guru(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_id');
    }
}
