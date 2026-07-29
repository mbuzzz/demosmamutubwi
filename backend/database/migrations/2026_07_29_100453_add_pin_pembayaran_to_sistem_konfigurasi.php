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
        Schema::table('sistem_konfigurasi', function (Blueprint $table) {
            $table->string('pin_pembayaran')->nullable()->default('654321');
        });
    }

    public function down(): void
    {
        Schema::table('sistem_konfigurasi', function (Blueprint $table) {
            $table->dropColumn('pin_pembayaran');
        });
    }
};
