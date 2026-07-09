<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Ekskul;
use App\Models\Penugasan;
use App\Models\Kurikulum;
use App\Models\SistemKonfigurasi;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Jalankan seeder master user
        $this->call(UserSeeder::class);

        // 2. Seed Kurikulum (Dasar)
        $kurikulum = Kurikulum::create([
            'nama' => 'Kurikulum Merdeka',
            'tahun_ajaran' => '2025/2026',
            'status' => 'aktif',
            'kkm_default' => 75,
            'metode_remedial' => 'maks_kkm',
            'uses_tp' => true,
            'bobot_tugas' => 30,
            'bobot_uts' => 30,
            'bobot_uas' => 40,
            'rumus_penilaian' => [
                ['key' => 'tugas', 'nama' => 'Tugas / Harian', 'bobot' => 30],
                ['key' => 'uts', 'nama' => 'Ujian Tengah Semester', 'bobot' => 30],
                ['key' => 'uas', 'nama' => 'Ujian Akhir Semester', 'bobot' => 40]
            ],
            'rapor_template' => [
                ['id' => 'kop', 'type' => 'kop_surat', 'visible' => true, 'properties' => ['mode' => 'text_only']],
                ['id' => 'biodata', 'type' => 'biodata_siswa', 'visible' => true],
                ['id' => 'nilai', 'type' => 'tabel_nilai', 'visible' => true],
                ['id' => 'ekskul', 'type' => 'tabel_ekskul', 'visible' => true],
                ['id' => 'absensi', 'type' => 'tabel_absensi', 'visible' => true],
                ['id' => 'ttd', 'type' => 'signatures', 'visible' => true, 'properties' => ['layout' => 'two_columns']]
            ],
            'deskripsi_config' => [
                'threshold_tinggi' => 80,
                'threshold_rendah' => 75,
                'template_tinggi' => 'Menunjukkan penguasaan yang sangat baik dalam {deskripsi_tp}',
                'template_rendah' => 'perlu bimbingan lebih lanjut dalam {deskripsi_tp}',
                'template_gabungan' => '{kalimat_tinggi}, serta {kalimat_rendah}.'
            ]
        ]);

        // 3. Seed Sistem Konfigurasi
        SistemKonfigurasi::create([
            'tahun_ajaran_aktif' => '2025/2026',
            'semester_aktif' => 'ganjil',
            'kurikulum_aktif_id' => $kurikulum->id,
        ]);

        // 4. Seed Gelombang Pendaftaran & Form Fields Dasar
        $gelombang = \App\Models\GelombangPendaftaran::create([
            'nama' => 'Gelombang Utama',
            'tanggal_mulai' => now()->format('Y-m-d'),
            'tanggal_selesai' => now()->addMonths(3)->format('Y-m-d'),
            'kuota' => 100,
            'biaya_pendaftaran' => 150000,
            'is_active' => true,
        ]);

        \App\Models\FormField::create([
            'gelombang_id' => $gelombang->id,
            'label' => 'Nama Lengkap Calon Siswa',
            'field_type' => 'text',
            'is_required' => true,
            'urutan' => 1
        ]);

        \App\Models\FormField::create([
            'gelombang_id' => $gelombang->id,
            'label' => 'Asal Sekolah (SMP / MTs)',
            'field_type' => 'text',
            'is_required' => true,
            'urutan' => 2
        ]);

        \App\Models\FormField::create([
            'gelombang_id' => $gelombang->id,
            'label' => 'Nomor HP Orang Tua / Wali',
            'field_type' => 'text',
            'is_required' => true,
            'urutan' => 3
        ]);
    }
}
