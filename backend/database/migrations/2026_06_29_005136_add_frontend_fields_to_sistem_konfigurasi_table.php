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
        Schema::table('sistem_konfigurasi', function (Blueprint $table) {
            $table->text('slogan')->nullable();
            $table->string('telepon')->nullable();
            $table->string('email')->nullable();
            $table->text('alamat')->nullable();
            $table->text('google_maps_embed')->nullable();
            $table->string('facebook')->nullable();
            $table->string('instagram')->nullable();
            $table->string('twitter')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sistem_konfigurasi', function (Blueprint $table) {
            $table->dropColumn([
                'slogan', 'telepon', 'email', 'alamat', 'google_maps_embed',
                'facebook', 'instagram', 'twitter'
            ]);
        });
    }
};
