<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pendaftars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gelombang_id')->constrained('gelombang_pendaftarans')->onDelete('cascade');
            $table->string('nisn')->unique();
            $table->string('nama_lengkap');
            $table->string('asal_sekolah');
            $table->string('email');
            $table->string('no_hp');
            $table->text('alamat');
            $table->string('status')->default('baru'); // baru, diverifikasi, diterima, ditolak
            $table->jsonb('data_form')->nullable(); // custom form fields
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftars');
    }
};
