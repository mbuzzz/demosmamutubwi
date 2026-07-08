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
        // PostgreSQL does not support ALTER COLUMN on enum easily.
        // Change column to string type to allow all jenis values.
        DB::statement("ALTER TABLE soals ALTER COLUMN jenis TYPE VARCHAR(20)");
    }

    public function down(): void
    {
        // Revert to original enum (only pg and essay)
        DB::statement("ALTER TABLE soals ALTER COLUMN jenis TYPE VARCHAR(10)");
    }
};
