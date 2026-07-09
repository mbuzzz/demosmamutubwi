<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gelombang_pendaftarans', function (Blueprint $table) {
            $table->string('redirect_url')->nullable()->after('is_active');
        });

        Schema::create('prestasis', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('gambar')->nullable();
            $table->string('kategori')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('gelombang_pendaftarans', function (Blueprint $table) {
            $table->dropColumn('redirect_url');
        });
        Schema::dropIfExists('prestasis');
    }
};
