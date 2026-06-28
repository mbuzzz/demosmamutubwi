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
        Schema::create('kurikulums', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('tahun_ajaran');
            $table->string('status')->default('draft'); // aktif, draft
            $table->integer('kkm_default')->default(75);
            $table->string('metode_remedial')->default('maks_kkm');
            $table->boolean('uses_tp')->default(true); // true = Kurikulum Merdeka (TP), false = K13 (KD)
            $table->integer('bobot_tugas')->default(30);
            $table->integer('bobot_uts')->default(30);
            $table->integer('bobot_uas')->default(40);
            $table->jsonb('rumus_penilaian')->nullable(); // custom components and weights
            $table->jsonb('rapor_template')->nullable();  // canvas blocks configuration
            $table->jsonb('deskripsi_config')->nullable(); // templates for descriptive report
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kurikulums');
    }
};
