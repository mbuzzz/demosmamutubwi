<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['rapor_id', 'ekskul_id', 'nilai', 'keterangan'])]
class NilaiEkskul extends Model
{
    use HasFactory;

    protected $table = 'nilai_ekskuls';

    public function rapor(): BelongsTo
    {
        return $this->belongsTo(Rapor::class, 'rapor_id');
    }

    public function ekskul(): BelongsTo
    {
        return $this->belongsTo(Ekskul::class, 'ekskul_id');
    }
}
