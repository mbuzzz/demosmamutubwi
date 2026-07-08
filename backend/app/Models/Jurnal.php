<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['guru_id', 'kelas_id', 'mapel_id', 'tanggal', 'jam_mulai', 'jam_selesai', 'topik', 'kehadiran_json'])]
class Jurnal extends Model
{
    use HasFactory;

    protected $table = 'jurnals';

    protected $casts = [
        'kehadiran_json' => 'array',
        'tanggal' => 'date:Y-m-d'
    ];

    public function guru(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function mapel(): BelongsTo
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }
}
