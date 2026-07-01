<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('sistem_konfigurasi', function (Blueprint $table) {
            $table->integer('monitoring_uh_hijau')->default(80);
            $table->integer('monitoring_uh_kuning')->default(50);
        });
    }

    public function down(): void {
        Schema::table('sistem_konfigurasi', function (Blueprint $table) {
            $table->dropColumn(['monitoring_uh_hijau', 'monitoring_uh_kuning']);
        });
    }
};
