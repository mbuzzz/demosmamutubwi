<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gelombang_id')->nullable()->constrained('gelombang_pendaftarans')->onDelete('cascade');
            $table->string('label');
            $table->string('field_type'); // text, textarea, select, file, date
            $table->jsonb('options')->nullable(); // for select type
            $table->boolean('is_required')->default(true);
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};
