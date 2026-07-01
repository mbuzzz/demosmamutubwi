<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sikap_rapors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rapor_id')->constrained('rapors')->onDelete('cascade');
            $table->enum('sikap', ['spiritual', 'sosial']);
            $table->text('deskripsi');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('sikap_rapors');
    }
};
