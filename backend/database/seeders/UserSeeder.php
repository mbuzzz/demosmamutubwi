<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Hanya Superadmin yang dibuat untuk production
        User::create([
            'name' => 'Admin SMAS Muh 1',
            'username' => 'admin',
            'email' => 'admin@sit.sch.id',
            'password' => Hash::make('@SMAM1bwi'),
            'role' => 'superadmin',
            'nip_nisn' => '197501012000031001',
            'is_active' => true,
        ]);
    }
}
