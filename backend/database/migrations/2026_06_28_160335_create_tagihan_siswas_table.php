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
        Schema::create('tagihan_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('jenis_pembayaran_id')->constrained('jenis_pembayaran')->onDelete('cascade');
            $table->string('nama_tagihan');
            $table->integer('bulan')->nullable();
            $table->integer('tahun')->nullable();
            $table->decimal('nominal_tagihan', 15, 2);
            $table->decimal('nominal_terbayar', 15, 2)->default(0);
            $table->enum('status', ['lunas', 'sebagian', 'belum'])->default('belum');
            $table->date('tenggat_waktu')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tagihan_siswa');
    }
};
