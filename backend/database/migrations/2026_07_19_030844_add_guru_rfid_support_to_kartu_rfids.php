<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Add guru/staff RFID support to kartu_rfids table.
 *
 * Strategy: Add nullable `user_id` column that works for any role.
 * When user_id is set and siswa_id is null, card belongs to a guru/staff.
 * When siswa_id is set, card belongs to a siswa (backward-compatible).
 * Add absensi_guru table for separate guru attendance tracking.
 */
return new class extends Migration
{
    public function up(): void
    {
        // 1. Make siswa_id nullable and add user_id for all roles
        Schema::table('kartu_rfids', function (Blueprint $table) {
            // Drop the foreign key and not-null constraint on siswa_id
            $table->dropForeign(['siswa_id']);
            $table->bigInteger('siswa_id')->nullable()->change();
            // Add user_id for non-siswa users (guru, staff)
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade')->after('uid');
        });

        // 2. Create absensi_guru table for guru RFID attendance
        Schema::create('absensi_gurus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('tanggal');
            $table->time('jam_masuk')->nullable();
            $table->time('jam_pulang')->nullable();
            $table->string('status_masuk')->default('hadir');
            $table->string('status_pulang')->nullable();
            $table->string('metode')->default('rfid');
            $table->string('uid_rfid')->nullable();
            $table->string('catatan')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            $table->unique(['user_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi_gurus');

        Schema::table('kartu_rfids', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->bigInteger('siswa_id')->nullable(false)->change();
            $table->foreign('siswa_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
