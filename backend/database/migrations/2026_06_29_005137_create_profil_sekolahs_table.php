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
        Schema::create('profil_sekolahs', function (Blueprint $table) {
            $table->id();
            $table->longText('sejarah_teks')->nullable();
            $table->string('sejarah_foto')->nullable();
            $table->text('visi_teks')->nullable();
            $table->json('misi_list')->nullable();
            $table->string('kepsek_nama')->nullable();
            $table->string('kepsek_nip')->nullable();
            $table->string('kepsek_foto')->nullable();
            $table->longText('kepsek_sambutan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profil_sekolahs');
    }
};
