<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use \Illuminate\Database\Eloquent\Attributes\Fillable;

    #[Fillable(['pertanyaan', 'jawaban', 'urutan'])]
}
