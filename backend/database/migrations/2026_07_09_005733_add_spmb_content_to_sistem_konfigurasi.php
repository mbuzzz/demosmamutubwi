<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sistem_konfigurasi', function (Blueprint $table) {
            // Alur Pendaftaran
            $table->text('spmb_alur_online')->nullable();
            $table->text('spmb_alur_verifikasi')->nullable();
            $table->text('spmb_alur_pembayaran')->nullable();
            $table->text('spmb_alur_tes')->nullable();
            $table->text('spmb_alur_pengumuman')->nullable();
            
            // Rincian Biaya
            $table->text('spmb_biaya_info')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('sistem_konfigurasi', function (Blueprint $table) {
            $table->dropColumn([
                'spmb_alur_online',
                'spmb_alur_verifikasi', 
                'spmb_alur_pembayaran',
                'spmb_alur_tes',
                'spmb_alur_pengumuman',
                'spmb_biaya_info'
            ]);
        });
    }
};
