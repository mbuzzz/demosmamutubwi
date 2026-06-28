<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormField extends Model
{
    protected $table = 'form_fields';

    protected $fillable = [
        'gelombang_id', 'label', 'field_type',
        'options', 'is_required', 'urutan',
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'is_required' => 'boolean',
        ];
    }

    public function gelombang(): BelongsTo
    {
        return $this->belongsTo(GelombangPendaftaran::class, 'gelombang_id');
    }
}
