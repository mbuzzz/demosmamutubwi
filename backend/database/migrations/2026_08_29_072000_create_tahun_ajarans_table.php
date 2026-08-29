<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Tahun Ajaran kini menjadi entitas berdiri sendiri dengan CRUD penuh.
 * Sebelumnya hanya string 'tahun_ajaran_aktif' di tabel sistem_konfigurasi.
 * Sekarang ada tabel khusus sehingga kurikulum/admin bisa:
 *  - membuat tahun ajaran baru,
 *  - mengaktifkan salah satunya (satu-satunya yang aktif),
 *  - menandai tahun ajaran selesai (status 'selesai') untuk arsip.
 *
 * Backward compatibility: kolom sistem_konfigurasi.tahun_ajaran_aktif
 * tetap dipertahankan dan disinkronkan via SistemKonfigurasiController
 * ketika tahun ajaran diaktifkan dari tabel ini.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tahun_ajarans', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 20)->unique(); // '2025/2026'
            $table->string('label', 50)->nullable(); // 'Tahun Pelajaran 2025/2026'
            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();
            $table->enum('status', ['draft', 'aktif', 'selesai'])->default('draft');
            $table->boolean('is_active')->default(false)->index();
            $table->string('keterangan', 500)->nullable();
            $table->timestamps();
        });

        // Seed dari data yang sudah ada di sistem_konfigurasi (jika ada)
        $config = DB::table('sistem_konfigurasi')->first();
        if ($config && !empty($config->tahun_ajaran_aktif)) {
            $exists = DB::table('tahun_ajarans')
                ->where('nama', $config->tahun_ajaran_aktif)
                ->exists();
            if (!$exists) {
                DB::table('tahun_ajarans')->insert([
                    'nama' => $config->tahun_ajaran_aktif,
                    'label' => 'Tahun Pelajaran ' . $config->tahun_ajaran_aktif,
                    'status' => 'aktif',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Pastikan hanya satu is_active=true (idempotent)
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS tahun_ajarans_only_one_active ON tahun_ajarans (is_active) WHERE is_active = true');
    }

    public function down(): void
    {
        Schema::dropIfExists('tahun_ajarans');
    }
};
