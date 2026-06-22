<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Administrator SIT',
            'email' => 'admin@sit.sch.id',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Guru
        User::create([
            'name' => 'Budi Santoso, S.Pd.',
            'email' => 'budi.guru@sit.sch.id',
            'password' => Hash::make('password'),
            'role' => 'guru',
        ]);

        // Siswa
        User::create([
            'name' => 'Rian Hidayat',
            'email' => 'rian.siswa@sit.sch.id',
            'password' => Hash::make('password'),
            'role' => 'siswa',
        ]);
    }
}
