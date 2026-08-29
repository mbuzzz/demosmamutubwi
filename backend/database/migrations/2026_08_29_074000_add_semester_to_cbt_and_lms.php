<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_soals', function (Blueprint $table) {
            $table->string('semester', 10)->nullable()->after('tahun_ajaran')->index();
        });
        Schema::table('sesi_ujians', function (Blueprint $table) {
            $table->string('semester', 10)->nullable()->after('bank_soal_id')->index();
        });
        Schema::table('tugas', function (Blueprint $table) {
            $table->string('semester', 10)->nullable()->after('tahun_ajaran')->index();
        });
    }

    public function down(): void
    {
        foreach (['bank_soals', 'sesi_ujians', 'tugas'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropColumn('semester');
            });
        }
    }
};
