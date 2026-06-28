<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['nama', 'deskripsi'])]
class Ekskul extends Model
{
    use HasFactory;

    protected $table = 'ekskuls';
}
