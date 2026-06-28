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
        Schema::create('penugasan_strukturals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('role_akses'); // e.g., 'kepala_sekolah', 'kurikulum', 'bendahara'
            $table->string('jabatan'); // e.g., 'Kepala Sekolah', 'Waka Kurikulum'
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('set null'); // if role is walikelas
            $table->string('tahun_ajaran');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penugasan_strukturals');
    }
};
