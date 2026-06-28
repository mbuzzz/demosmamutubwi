<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sistem_konfigurasi', function (Blueprint $table) {
            $table->string('nama_sekolah')->nullable();
            $table->string('logo_sekolah')->nullable();
            $table->string('kop_surat')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('sistem_konfigurasi', function (Blueprint $table) {
            $table->dropColumn(['nama_sekolah', 'logo_sekolah', 'kop_surat']);
        });
    }
};
