<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengumpulan_tugas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tugas_id')->constrained('tugas')->cascadeOnDelete();
            $table->foreignId('siswa_id')->constrained('users')->cascadeOnDelete();
            $table->string('file_jawaban_url')->nullable();
            $table->text('catatan_siswa')->nullable();
            $table->integer('nilai')->nullable();
            $table->text('feedback_guru')->nullable();
            $table->enum('status', ['belum_dinilai', 'sudah_dinilai', 'telat'])->default('belum_dinilai');
            $table->dateTime('dikumpulkan_pada')->nullable();
            $table->timestamps();
            
            $table->unique(['tugas_id', 'siswa_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengumpulan_tugas');
    }
};
