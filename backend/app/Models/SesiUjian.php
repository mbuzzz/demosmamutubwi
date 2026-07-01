<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SesiUjian extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $casts = [
        'waktu_mulai' => 'datetime',
        'waktu_selesai' => 'datetime',
        'is_acak_soal' => 'boolean',
        'is_aktif' => 'boolean',
    ];

    public function template()
    {
        return $this->belongsTo(TemplateCbt::class, 'template_id');
    }

    public function bankSoal()
    {
        return $this->belongsTo(BankSoal::class, 'bank_soal_id');
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kelas_id');
    }

    public function hasilUjians()
    {
        return $this->hasMany(HasilUjian::class);
    }

    public function pengawas()
    {
        return $this->belongsToMany(User::class, 'pengawas_ujians', 'sesi_ujian_id', 'user_id')->withTimestamps();
    }
}
