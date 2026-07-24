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
        Schema::table('sistem_konfigurasis', function (Blueprint $table) {
            $table->string('bank_nama')->nullable();
            $table->string('bank_rekening')->nullable();
            $table->string('bank_atas_nama')->nullable();
            $table->string('qris_image')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('sistem_konfigurasis', function (Blueprint $table) {
            $table->dropColumn(['bank_nama', 'bank_rekening', 'bank_atas_nama', 'qris_image']);
        });
    }
};
