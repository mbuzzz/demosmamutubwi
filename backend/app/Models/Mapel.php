<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['nama', 'kode', 'kkm', 'tingkat'])]
class Mapel extends Model
{
    use HasFactory;

    protected $table = 'mapels';
}
