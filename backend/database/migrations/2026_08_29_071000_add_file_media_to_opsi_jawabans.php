<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Opsi jawaban kini dapat menyertakan gambar (file_media) sehingga guru
 * bisa membuat opsi dengan ilustrasi/teks bergambar.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('opsi_jawabans', function (Blueprint $table) {
            $table->string('file_media', 500)->nullable()->after('is_benar');
        });
    }

    public function down(): void
    {
        Schema::table('opsi_jawabans', function (Blueprint $table) {
            $table->dropColumn('file_media');
        });
    }
};
