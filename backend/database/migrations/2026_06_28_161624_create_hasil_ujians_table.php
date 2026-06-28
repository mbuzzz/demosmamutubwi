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
        Schema::create('hasil_ujians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sesi_ujian_id')->constrained('sesi_ujians')->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['mengerjakan', 'selesai'])->default('mengerjakan');
            $table->dateTime('waktu_mulai');
            $table->dateTime('waktu_selesai')->nullable();
            $table->decimal('nilai_pg', 8, 2)->default(0);
            $table->decimal('nilai_essay', 8, 2)->default(0);
            $table->decimal('total_nilai', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_ujians');
    }
};
