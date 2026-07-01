<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalEkskul extends Model
{
    use HasFactory;

    protected $fillable = [
        'ekskul_id', 'hari', 'jam_mulai', 'jam_selesai', 'pola', 'ruang', 'pembina_id'
    ];

    public function ekskul()
    {
        return $this->belongsTo(Ekskul::class, 'ekskul_id');
    }

    public function pembina()
    {
        return $this->belongsTo(User::class, 'pembina_id');
    }
}
