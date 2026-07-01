<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('template_cbts', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('layout')->default('standar'); // standar, compact, wide
            $table->string('primary_color', 7)->default('#6366f1');
            $table->string('accent_color', 7)->default('#4f46e5');
            $table->string('bg_color', 7)->default('#ffffff');
            $table->string('text_color', 7)->default('#1e293b');
            $table->string('card_bg', 7)->default('#f8fafc');
            $table->integer('font_size')->default(16);
            $table->string('font_family')->default('Inter');
            $table->string('header_logo')->nullable();
            $table->text('header_text')->nullable();
            $table->text('footer_text')->nullable();
            $table->boolean('show_timer')->default(true);
            $table->boolean('show_progress')->default(true);
            $table->boolean('show_question_nav')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        Schema::table('sesi_ujians', function (Blueprint $table) {
            $table->foreignId('template_id')->nullable()->constrained('template_cbts')->onDelete('set null');
        });
    }

    public function down(): void {
        Schema::table('sesi_ujians', function (Blueprint $table) {
            $table->dropConstrainedForeignId('template_id');
        });
        Schema::dropIfExists('template_cbts');
    }
};
