<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tambah kolom tahun_ajaran ke bank_soals & tugas.
 * Sebelumnya scoping tahun ajaran dilakukan via created_at / penugasan, bukan
 * field eksplisit. Sekarang bank_soals & tugas juga harus terikat ke tahun
 * ajaran aktif untuk konsistensi dengan sistem_konfigurasi dan
 * tabel tahun_ajarans baru.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_soals', function (Blueprint $table) {
            $table->string('tahun_ajaran', 20)->nullable()->after('waktu_pengerjaan')->index();
        });
        Schema::table('tugas', function (Blueprint $table) {
            $table->string('tahun_ajaran', 20)->nullable()->after('tenggat_waktu')->index();
        });
    }

    public function down(): void
    {
        Schema::table('bank_soals', function (Blueprint $table) {
            $table->dropIndex(['tahun_ajaran']);
            $table->dropColumn('tahun_ajaran');
        });
        Schema::table('tugas', function (Blueprint $table) {
            $table->dropIndex(['tahun_ajaran']);
            $table->dropColumn('tahun_ajaran');
        });
    }
};
