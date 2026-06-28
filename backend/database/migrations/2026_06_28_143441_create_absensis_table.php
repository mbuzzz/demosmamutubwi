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
        Schema::create('absensis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('users')->onDelete('cascade');
            $table->date('tanggal');
            $table->time('jam_masuk')->nullable();
            $table->time('jam_pulang')->nullable();
            $table->enum('status_masuk', ['hadir', 'izin', 'sakit', 'alpha', 'terlambat'])->default('hadir');
            $table->enum('status_pulang', ['hadir', 'pulang_awal', 'alpha'])->nullable();
            $table->enum('metode', ['rfid', 'manual'])->default('rfid');
            $table->string('uid_rfid')->nullable();
            $table->string('catatan')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null'); // for manual entry
            $table->timestamps();
            
            // Ensure a student only has one attendance record per day
            $table->unique(['siswa_id', 'tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensis');
    }
};
