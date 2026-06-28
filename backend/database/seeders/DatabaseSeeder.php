<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Ekskul;
use App\Models\Penugasan;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users
        $this->call(UserSeeder::class);

        // Retrieve seeded users
        $admin = User::where('username', 'admin')->first();
        $rina = User::where('username', 'rina')->first();
        $ahmad = User::where('username', 'ahmad')->first();
        $sugeng = User::where('username', 'sugeng')->first();

        // 2. Seed Kelas
        $kelasX1 = Kelas::create([
            'nama' => 'X-1',
            'tingkat' => '10',
            'wali_kelas_id' => $ahmad ? $ahmad->id : null,
        ]);

        $kelasX2 = Kelas::create([
            'nama' => 'X-2',
            'tingkat' => '10',
            'wali_kelas_id' => null,
        ]);

        $kelasXI1 = Kelas::create([
            'nama' => 'XI-1',
            'tingkat' => '11',
            'wali_kelas_id' => null,
        ]);

        // 3. Seed Mapel
        $mapelMtk = Mapel::create([
            'nama' => 'Matematika Wajib',
            'kode' => 'MTK-WJB',
            'kkm' => 75,
            'tingkat' => 'X',
        ]);

        $mapelFis = Mapel::create([
            'nama' => 'Fisika',
            'kode' => 'FIS-P',
            'kkm' => 75,
            'tingkat' => 'X',
        ]);

        $mapelIndo = Mapel::create([
            'nama' => 'Bahasa Indonesia',
            'kode' => 'IND-WJB',
            'kkm' => 75,
            'tingkat' => 'X',
        ]);

        // 4. Seed Ekskul
        Ekskul::create([
            'nama' => 'Pramuka',
            'deskripsi' => 'Pendidikan kepanduan wajib nasional',
        ]);

        Ekskul::create([
            'nama' => 'Tapak Suci',
            'deskripsi' => 'Seni bela diri tapak suci putra muhammadiyah',
        ]);

        Ekskul::create([
            'nama' => 'Palang Merah Remaja (PMR)',
            'deskripsi' => 'Kegiatan kepalangmerahan dan kesehatan remaja',
        ]);

        // 5. Seed Penugasan (Teaching Assignments)
        if ($ahmad && $mapelMtk) {
            Penugasan::create([
                'guru_id' => $ahmad->id,
                'mapel_id' => $mapelMtk->id,
                'kelas_id' => $kelasX1->id,
                'total_jam' => 4,
            ]);
            Penugasan::create([
                'guru_id' => $ahmad->id,
                'mapel_id' => $mapelMtk->id,
                'kelas_id' => $kelasX2->id,
                'total_jam' => 4,
            ]);
        }

        if ($rina && $mapelFis) {
            Penugasan::create([
                'guru_id' => $rina->id,
                'mapel_id' => $mapelFis->id,
                'kelas_id' => $kelasX1->id,
                'total_jam' => 3,
            ]);
            Penugasan::create([
                'guru_id' => $rina->id,
                'mapel_id' => $mapelFis->id,
                'kelas_id' => $kelasX2->id,
                'total_jam' => 3,
            ]);
        }
    }
}
