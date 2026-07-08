<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['nama', 'kode', 'kkm', 'tingkat', 'kelompok'])]
class Mapel extends Model
{
    use HasFactory;

    protected $table = 'mapels';

    /** Penugasan guru untuk mapel ini */
    public function penugasans()
    {
        return $this->hasMany(Penugasan::class, 'mapel_id');
    }

    /** Tujuan Pembelajaran untuk mapel ini */
    public function tujuanPembelajarans()
    {
        return $this->hasMany(TujuanPembelajaran::class, 'mapel_id');
    }

    /** Nilai-nilai siswa untuk mapel ini */
    public function nilais()
    {
        return $this->hasMany(Nilai::class, 'mapel_id');
    }
}
