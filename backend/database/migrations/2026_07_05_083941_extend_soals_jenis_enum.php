<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Change soals.jenis from enum('pg','essay') to string
     * so it can accommodate pg_kompleks, bs, pgk in the future.
     */
    public function up(): void
    {
        Schema::table('soals', function (Blueprint $table) {
            $table->string('jenis', 20)->change();
        });
    }

    public function down(): void
    {
        Schema::table('soals', function (Blueprint $table) {
            $table->string('jenis', 10)->change();
        });
    }
};
