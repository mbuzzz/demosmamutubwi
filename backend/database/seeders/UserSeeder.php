<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Superadmin
        User::create([
            'name' => 'Admin SMAS Muh 1',
            'email' => 'admin@sit.sch.id',
            'password' => Hash::make('1234'),
            'role' => 'superadmin',
            'nip_nisn' => '197501012000031001',
            'is_active' => true,
        ]);

        // Guru
        User::create([
            'name' => 'Rina Fitriani, S.Pd',
            'email' => 'rina.guru@sit.sch.id',
            'password' => Hash::make('1234'),
            'role' => 'guru',
            'nip_nisn' => '198205122008012004',
            'jabatan' => 'Guru Matematika',
            'is_active' => true,
        ]);

        // Wali Kelas
        User::create([
            'name' => 'Ahmad Fauzi, S.Pd',
            'email' => 'ahmad.wali@sit.sch.id',
            'password' => Hash::make('1234'),
            'role' => 'walikelas',
            'nip_nisn' => '198001012005011002',
            'kelas' => 'X-1',
            'jabatan' => 'Wali Kelas X-1',
            'is_active' => true,
        ]);

        // Kepala Sekolah
        User::create([
            'name' => 'Drs. H. Sugeng, M.Pd',
            'email' => 'sugeng.kepsek@sit.sch.id',
            'password' => Hash::make('1234'),
            'role' => 'kepala_sekolah',
            'nip_nisn' => '196504121990031001',
            'jabatan' => 'Kepala Sekolah',
            'is_active' => true,
        ]);

        // Kurikulum
        User::create([
            'name' => 'Dewi Sartika, S.Pd',
            'email' => 'dewi.kuri@sit.sch.id',
            'password' => Hash::make('1234'),
            'role' => 'kurikulum',
            'nip_nisn' => '198512102010012003',
            'jabatan' => 'Waka Kurikulum',
            'is_active' => true,
        ]);

        // Bendahara
        User::create([
            'name' => 'Siti Nurhaliza, S.E',
            'email' => 'siti.bendahara@sit.sch.id',
            'password' => Hash::make('1234'),
            'role' => 'bendahara',
            'nip_nisn' => '199009092015082001',
            'jabatan' => 'Bendahara Sekolah',
            'is_active' => true,
        ]);

        // Siswa 1
        User::create([
            'name' => 'Agus Setiawan',
            'email' => 'agus.siswa@sit.sch.id',
            'password' => Hash::make('1234'),
            'role' => 'siswa',
            'nip_nisn' => '0081234501',
            'kelas' => 'X-1',
            'uid_rfid' => 'RF:AB:12:CD:34',
            'is_active' => true,
        ]);

        // Siswa 2
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi.siswa@sit.sch.id',
            'password' => Hash::make('1234'),
            'role' => 'siswa',
            'nip_nisn' => '0081234502',
            'kelas' => 'X-1',
            'uid_rfid' => 'RF:EF:56:GH:78',
            'is_active' => true,
        ]);
    }
}
