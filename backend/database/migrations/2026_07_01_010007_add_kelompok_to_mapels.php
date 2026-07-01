<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('mapels', function (Blueprint $table) {
            $table->string('kelompok')->default('A'); // A (Wajib), B (Peminatan), C (Lintas Minat/Lainnya)
        });
    }

    public function down(): void {
        Schema::table('mapels', function (Blueprint $table) {
            $table->dropColumn('kelompok');
        });
    }
};
