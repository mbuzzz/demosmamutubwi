<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Multi-role: kolom JSON `roles` menyimpan peran tambahan.
     * Kolom `role` tetap sebagai peran utama (primary) untuk login redirect & kompatibilitas.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'roles')) {
                $table->json('roles')->nullable()->after('role');
            }
        });

        // Seed awal: sync roles = [role] untuk user staf yang sudah ada
        $users = DB::table('users')
            ->whereNotIn('role', ['siswa', 'orang_tua'])
            ->whereNull('roles')
            ->get(['id', 'role']);

        foreach ($users as $user) {
            DB::table('users')->where('id', $user->id)->update([
                'roles' => json_encode([$user->role]),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'roles')) {
                $table->dropColumn('roles');
            }
        });
    }
};
