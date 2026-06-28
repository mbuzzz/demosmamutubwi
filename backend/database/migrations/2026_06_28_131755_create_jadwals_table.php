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
        Schema::create('jadwals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->string('hari'); // Senin, Selasa, Rabu, dll
            $table->integer('urutan_jam'); // 1, 2, 3...
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->string('label')->nullable(); // e.g. "Jam ke-1"
            $table->boolean('is_break')->default(false);
            $table->foreignId('mapel_id')->nullable()->constrained('mapels')->onDelete('set null');
            $table->foreignId('guru_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('tahun_ajaran');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwals');
    }
};
