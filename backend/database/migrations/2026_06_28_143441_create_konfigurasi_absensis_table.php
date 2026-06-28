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
        Schema::create('konfigurasi_absensis', function (Blueprint $table) {
            $table->id();
            $table->string('pin')->default('123456');
            $table->time('jam_masuk')->default('07:00:00');
            $table->time('jam_pulang')->default('15:30:00');
            $table->integer('toleransi_terlambat')->default(15); // minutes
            $table->time('batas_alpha')->default('08:00:00');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('konfigurasi_absensis');
    }
};
