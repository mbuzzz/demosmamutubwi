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
        // 1. Seed Users
        $this->call(UserSeeder::class);

        // Retrieve seeded users
        $admin = User::where('username', 'admin')->first();
        $rina = User::where('username', 'rina')->first();
        $ahmad = User::where('username', 'ahmad')->first();
        $sugeng = User::where('username', 'sugeng')->first();

        // 2. Seed Kurikulum
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

        // 4. Seed Kelas
        $kelasX1 = Kelas::create([
            'nama' => 'X-1',
            'tingkat' => '10',
            'kurikulum_id' => $kurikulum->id,
            'wali_kelas_id' => $ahmad ? $ahmad->id : null,
        ]);

        $kelasX2 = Kelas::create([
            'nama' => 'X-2',
            'tingkat' => '10',
            'kurikulum_id' => $kurikulum->id,
            'wali_kelas_id' => null,
        ]);

        $kelasXI1 = Kelas::create([
            'nama' => 'XI-1',
            'tingkat' => '11',
            'kurikulum_id' => $kurikulum->id,
            'wali_kelas_id' => null,
        ]);

        // 5. Seed Mapel
        $mapelMtk = Mapel::create([
            'nama' => 'Matematika Wajib',
            'kode' => 'MTK-WJB',
            'kkm' => 75,
            'tingkat' => 'X',
            'kelompok' => 'A',
        ]);

        $mapelFis = Mapel::create([
            'nama' => 'Fisika',
            'kode' => 'FIS-P',
            'kkm' => 75,
            'tingkat' => 'X',
            'kelompok' => 'B',
        ]);

        $mapelIndo = Mapel::create([
            'nama' => 'Bahasa Indonesia',
            'kode' => 'IND-WJB',
            'kkm' => 75,
            'tingkat' => 'X',
            'kelompok' => 'A',
        ]);

        $mapelEko = Mapel::create([
            'nama' => 'Ekonomi Lintas Minat',
            'kode' => 'EKO-LM',
            'kkm' => 75,
            'tingkat' => 'X',
            'kelompok' => 'C',
        ]);

        // 6. Seed Ekskul
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

        // 7. Seed Penugasan (Teaching Assignments)
        if ($ahmad && $mapelMtk) {
            Penugasan::create([
                'guru_id' => $ahmad->id,
                'mapel_id' => $mapelMtk->id,
                'kelas_id' => $kelasX1->id,
                'total_jam' => 4,
                'tahun_ajaran' => '2025/2026',
            ]);
            Penugasan::create([
                'guru_id' => $ahmad->id,
                'mapel_id' => $mapelMtk->id,
                'kelas_id' => $kelasX2->id,
                'total_jam' => 4,
                'tahun_ajaran' => '2025/2026',
            ]);
        }

        if ($rina && $mapelFis) {
            Penugasan::create([
                'guru_id' => $rina->id,
                'mapel_id' => $mapelFis->id,
                'kelas_id' => $kelasX1->id,
                'total_jam' => 3,
                'tahun_ajaran' => '2025/2026',
            ]);
            Penugasan::create([
                'guru_id' => $rina->id,
                'mapel_id' => $mapelFis->id,
                'kelas_id' => $kelasX2->id,
                'total_jam' => 3,
                'tahun_ajaran' => '2025/2026',
            ]);
        }

        // 8. Seed Jadwal Pelajaran (Schedules) for X-1
        if ($kelasX1 && $mapelMtk && $ahmad) {
            \App\Models\Jadwal::create([
                'kelas_id' => $kelasX1->id,
                'hari' => 'Senin',
                'urutan_jam' => 1,
                'jam_mulai' => '07:00',
                'jam_selesai' => '08:30',
                'is_break' => false,
                'mapel_id' => $mapelMtk->id,
                'guru_id' => $ahmad->id,
                'tahun_ajaran' => '2025/2026',
            ]);
        }

        if ($kelasX1 && $mapelFis && $rina) {
            \App\Models\Jadwal::create([
                'kelas_id' => $kelasX1->id,
                'hari' => 'Senin',
                'urutan_jam' => 2,
                'jam_mulai' => '08:30',
                'jam_selesai' => '10:00',
                'is_break' => false,
                'mapel_id' => $mapelFis->id,
                'guru_id' => $rina->id,
                'tahun_ajaran' => '2025/2026',
            ]);
        }

        if ($kelasX1) {
            \App\Models\Jadwal::create([
                'kelas_id' => $kelasX1->id,
                'hari' => 'Senin',
                'urutan_jam' => 3,
                'jam_mulai' => '10:00',
                'jam_selesai' => '10:15',
                'is_break' => true,
                'label' => 'Istirahat',
                'tahun_ajaran' => '2025/2026',
            ]);
        }

        // 9. Seed Nilai for Agus Setiawan
        $agus = User::where('username', 'agus')->first();
        if ($agus && $ahmad && $mapelMtk) {
            \App\Models\Nilai::create([
                'siswa_id' => $agus->id,
                'guru_id' => $ahmad->id,
                'mapel_id' => $mapelMtk->id,
                'nilai_tugas' => 90,
                'nilai_uts' => 95,
                'nilai_uas' => 88,
                'nilai_akhir' => 90.6,
                'predikat' => 'A-',
                'semester' => 'ganjil',
                'tahun_ajaran' => '2025/2026',
                'catatan' => 'Sangat baik dalam pemecahan masalah logaritma.',
            ]);
        }

        if ($agus && $rina && $mapelFis) {
            \App\Models\Nilai::create([
                'siswa_id' => $agus->id,
                'guru_id' => $rina->id,
                'mapel_id' => $mapelFis->id,
                'nilai_tugas' => 82,
                'nilai_uts' => 80,
                'nilai_uas' => 78,
                'nilai_akhir' => 79.6,
                'predikat' => 'B+',
                'semester' => 'ganjil',
                'tahun_ajaran' => '2025/2026',
                'catatan' => 'Baik dalam praktikum gerak lurus.',
            ]);
        }

        // 10. Seed Rapor for Agus Setiawan
        if ($agus) {
            \App\Models\Rapor::create([
                'siswa_id' => $agus->id,
                'tahun_ajaran' => '2025/2026',
                'semester' => 'ganjil',
                'catatan_wali_kelas' => 'Agus menunjukkan prestasi belajar yang sangat baik semester ini. Pertahankan!',
                'sakit' => 1,
                'izin' => 2,
                'alpha' => 0,
                'terlambat' => 0,
                'status' => 'published',
            ]);
        }

        // 11. Seed Notifications for Agus Setiawan
        if ($agus) {
            \App\Models\Notification::create([
                'user_id' => $agus->id,
                'type' => 'info',
                'title' => 'Jadwal Baru',
                'description' => 'Jadwal pelajaran Kelas X-1 telah diperbarui.',
                'read' => false,
            ]);
            \App\Models\Notification::create([
                'user_id' => $agus->id,
                'type' => 'warning',
                'title' => 'UH Matematika',
                'description' => 'Ulangan Harian Matematika Wajib akan dimulai dalam 30 menit.',
                'read' => false,
            ]);
            \App\Models\Notification::create([
                'user_id' => $agus->id,
                'type' => 'success',
                'title' => 'Tugas Dinilai',
                'description' => 'Tugas PR LKS Hal 24-25 telah dinilai oleh Bu Siti.',
                'read' => false,
            ]);
        }
    }
}
