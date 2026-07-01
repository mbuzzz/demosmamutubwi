<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_soals', function (Blueprint $table) {
            $table->string('tipe')->default('ujian')->change();
        });
    }
    public function down(): void {}
};
