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
        Schema::create('transaksi_pembayaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tagihan_id')->constrained('tagihan_siswa')->onDelete('cascade');
            $table->string('kode_transaksi')->unique();
            $table->decimal('jumlah_bayar', 15, 2);
            $table->dateTime('tanggal_bayar');
            $table->enum('metode', ['tunai', 'transfer', 'rfid'])->default('tunai');
            $table->enum('status', ['berhasil', 'pending', 'gagal'])->default('berhasil');
            $table->foreignId('diterima_oleh_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_pembayaran');
    }
};
