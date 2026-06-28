<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['nama', 'tahun_ajaran', 'status', 'kkm_default', 'metode_remedial', 'uses_tp', 'bobot_tugas', 'bobot_uts', 'bobot_uas', 'rumus_penilaian', 'rapor_template', 'deskripsi_config'])]
class Kurikulum extends Model
{
    use HasFactory;

    protected $table = 'kurikulums';

    protected function casts(): array
    {
        return [
            'uses_tp' => 'boolean',
            'rumus_penilaian' => 'array',
            'rapor_template' => 'array',
            'deskripsi_config' => 'array',
        ];
    }

    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class, 'kurikulum_id');
    }
}
