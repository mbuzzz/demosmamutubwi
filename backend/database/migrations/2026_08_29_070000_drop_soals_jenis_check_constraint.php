<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Migrasi 2026_07_05 mencoba mengubah kolom soals.jenis dari enum ke string,
 * tetapi pada PostgreSQL CHECK constraint tidak ikut hilang sehingga insert
 * dengan nilai 'pg_kompleks' / 'bs' / 'pgk' selalu gagal. Migration ini
 * menjatuhkan CHECK constraint yang sudah usang.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE soals DROP CONSTRAINT IF EXISTS soals_jenis_check');
    }

    public function down(): void
    {
        // Tidak dibuat ulang: mengembalikan constraint lama akan memblokir
        // jenis soal yang sekarang dipakai aplikasi.
    }
};
