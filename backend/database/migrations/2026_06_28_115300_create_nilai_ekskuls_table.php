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
        Schema::create('nilai_ekskuls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rapor_id')->constrained('rapors')->onDelete('cascade');
            $table->foreignId('ekskul_id')->constrained('ekskuls')->onDelete('cascade');
            $table->char('nilai', 1); // A, B, C, D
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai_ekskuls');
    }
};
