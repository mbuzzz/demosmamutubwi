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
        Schema::table('jenis_pembayaran', function (Blueprint $table) {
            $table->string('periode')->nullable()->after('is_wajib');
            $table->string('jatuh_tempo')->nullable()->after('periode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jenis_pembayaran', function (Blueprint $table) {
            $table->dropColumn(['periode', 'jatuh_tempo']);
        });
    }
};
