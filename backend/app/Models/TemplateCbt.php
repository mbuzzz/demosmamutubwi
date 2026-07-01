<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateCbt extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama', 'layout', 'primary_color', 'accent_color', 'bg_color', 'text_color',
        'card_bg', 'font_size', 'font_family', 'header_logo', 'header_text',
        'footer_text', 'show_timer', 'show_progress', 'show_question_nav', 'created_by'
    ];

    protected $casts = [
        'show_timer' => 'boolean',
        'show_progress' => 'boolean',
        'show_question_nav' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
