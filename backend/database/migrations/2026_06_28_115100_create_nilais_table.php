<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nilais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('mapel_id')->constrained('mapels')->onDelete('cascade');
            $table->integer('nilai_tugas')->default(0);
            $table->integer('nilai_uts')->default(0);
            $table->integer('nilai_uas')->default(0);
            $table->integer('nilai_akhir')->default(0);
            $table->string('predikat', 2)->default('C');
            $table->string('semester'); // ganjil, genap
            $table->string('tahun_ajaran');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nilais');
    }
};
