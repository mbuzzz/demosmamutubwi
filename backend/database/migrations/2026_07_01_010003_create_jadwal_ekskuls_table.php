<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jadwal_ekskuls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ekskul_id')->constrained('ekskuls')->onDelete('cascade');
            $table->string('hari'); // Senin, Selasa, Rabu, Kamis, Jumat, Sabtu
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->string('pola')->default('setiap_minggu'); // setiap_minggu, minggu_ganjil, minggu_genap, minggu_ke_1, minggu_ke_2, minggu_ke_3, minggu_ke_4
            $table->string('ruang')->nullable();
            $table->foreignId('pembina_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('jadwal_ekskuls');
    }
};
