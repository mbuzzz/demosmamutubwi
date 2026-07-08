<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\ProfilSekolah;
use App\Models\KategoriBerita;
use App\Models\Berita;
use App\Models\Faq;
use App\Models\Testimoni;
use App\Models\Galeri;
use App\Models\Materi;
use App\Models\Tugas;
use App\Models\PengumpulanTugas;
use App\Models\BankSoal;
use App\Models\Soal;
use App\Models\OpsiJawaban;
use App\Models\SesiUjian;
use App\Models\JenisPembayaran;
use App\Models\TagihanSiswa;
use App\Models\TransaksiPembayaran;
use App\Models\Absensi;
use App\Models\KartuRfid;
use App\Models\KonfigurasiAbsensi;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'superadmin')->first();
        $guruMtk = User::where('username', 'rina')->first() ?? User::where('role', 'guru')->first();
        $agus = User::where('username', 'agus')->first();
        $budi = User::where('username', 'budi')->first();
        $kelasX1 = Kelas::where('nama', 'X-1')->first();
        $mapelMtk = Mapel::where('nama', 'Matematika Wajib')->first() ?? Mapel::first();

        // 1. CMS Publik
        ProfilSekolah::create([
            'sejarah_teks' => 'SMAS Muhammadiyah 1 Banyuwangi berdiri sejak tahun 1978 dengan misi mencerahkan generasi...',
            'visi_teks' => 'Terwujudnya insan yang beriman, bertaqwa, berakhlak mulia, cerdas, dan mandiri.',
            'misi_list' => [
                "Menyelenggarakan pendidikan yang mengintegrasikan nilai-nilai Islam.",
                "Mengembangkan potensi peserta didik secara optimal.",
                "Membekali peserta didik dengan keterampilan abad 21."
            ],
            'kepsek_nama' => 'Drs. H. Sugeng, M.Pd',
            'kepsek_nip' => '196504121990031001',
            'kepsek_sambutan' => 'Selamat datang di website resmi SMAS Muhammadiyah 1 Banyuwangi...'
        ]);

        $katAkademik = KategoriBerita::create(['nama' => 'Akademik', 'slug' => 'akademik']);
        $katPrestasi = KategoriBerita::create(['nama' => 'Prestasi', 'slug' => 'prestasi']);

        Berita::create([
            'kategori_id' => $katPrestasi->id,
            'penulis_id' => $admin->id,
            'judul' => 'Siswa SMAS Muh 1 Juara Olimpiade Matematika',
            'slug' => Str::slug('Siswa SMAS Muh 1 Juara Olimpiade Matematika'),
            'konten' => '<p>Prestasi gemilang kembali diraih oleh siswa kami dalam ajang olimpiade tingkat provinsi tahun 2026. Agus Setiawan berhasil membawa pulang medali emas.</p>',
            'status' => 'published',
            'published_at' => now()->subDays(2)
        ]);

        Faq::create(['pertanyaan' => 'Kapan jadwal PPDB dibuka?', 'jawaban' => 'PPDB dibuka mulai bulan Januari setiap tahunnya.', 'urutan' => 1]);
        Faq::create(['pertanyaan' => 'Apa saja ekstrakurikuler unggulan?', 'jawaban' => 'Kami memiliki Tapak Suci, Hizbul Wathan, dan Tim Robotik.', 'urutan' => 2]);

        Testimoni::create(['nama' => 'Bapak Joko Setiawan', 'peran' => 'Wali Murid', 'teks' => 'Sistem IT sekolah ini sangat transparan dan memudahkan orang tua memantau nilai.']);

        Galeri::create(['judul' => 'Gedung Sekolah Utama', 'deskripsi' => 'Tampak depan fasilitas sekolah.', 'kategori' => 'Fasilitas', 'image_url' => '/mock-image.jpg']);

        // 2. LMS (Materi & Tugas)
        if ($guruMtk && $kelasX1 && $mapelMtk) {
            $materi = Materi::create([
                'guru_id' => $guruMtk->id,
                'kelas_id' => $kelasX1->id,
                'mapel_id' => $mapelMtk->id,
                'judul' => 'Logaritma Dasar dan Sifat-sifatnya',
                'tipe_file' => 'teks',
                'konten' => '<p>Pelajari materi di bawah ini sebelum mengerjakan tugas.</p>',
            ]);

            $tugas = Tugas::create([
                'guru_id' => $guruMtk->id,
                'kelas_id' => $kelasX1->id,
                'mapel_id' => $mapelMtk->id,
                'judul' => 'Latihan Soal Logaritma',
                'instruksi' => '<p>Kerjakan LKS Halaman 45 bagian essay.</p>',
                'tenggat_waktu' => now()->addDays(3),
            ]);

            if ($agus) {
                PengumpulanTugas::create([
                    'tugas_id' => $tugas->id,
                    'siswa_id' => $agus->id,
                    'file_jawaban_url' => '/mock-lms-submission.pdf',
                    'catatan_siswa' => 'Mohon dikoreksi Bu Rina.',
                    'nilai' => 90,
                    'feedback_guru' => 'Sangat rapi, pertahankan.',
                    'status' => 'sudah_dinilai',
                    'dikumpulkan_pada' => now()->subDay(),
                ]);
            }
        }

        // 3. CBT (Ujian)
        if ($guruMtk && $mapelMtk) {
            $bankSoal = BankSoal::create([
                'guru_id' => $guruMtk->id,
                'mapel_id' => $mapelMtk->id,
                'tingkat' => 10,
                'judul' => 'Ulangan Harian Logaritma',
                'tipe' => 'ujian',
                'deskripsi' => 'Evaluasi kompetensi dasar logaritma'
            ]);

            $soal = Soal::create([
                'bank_soal_id' => $bankSoal->id,
                'jenis' => 'pg',
                'pertanyaan' => '<p>Berapakah nilai dari 2 log 8?</p>',
                'bobot_nilai' => 10
            ]);

            OpsiJawaban::create(['soal_id' => $soal->id, 'teks_opsi' => '2', 'is_benar' => false]);
            OpsiJawaban::create(['soal_id' => $soal->id, 'teks_opsi' => '3', 'is_benar' => true]);
            OpsiJawaban::create(['soal_id' => $soal->id, 'teks_opsi' => '4', 'is_benar' => false]);
            OpsiJawaban::create(['soal_id' => $soal->id, 'teks_opsi' => '5', 'is_benar' => false]);

            if ($kelasX1) {
                SesiUjian::create([
                    'bank_soal_id' => $bankSoal->id,
                    'kelas_id' => $kelasX1->id,
                    'nama_sesi' => 'UH Logaritma X-1',
                    'waktu_mulai' => now()->subHour(),
                    'waktu_selesai' => now()->addDays(2),
                    'durasi_menit' => 90,
                    'token' => 'LOG123',
                    'is_aktif' => true,
                ]);
            }
        }

        // 4. Pembayaran
        $spp = JenisPembayaran::create([
            'nama' => 'SPP Bulanan',
            'nominal_default' => 250000,
            'tipe_siklus' => 'bulanan',
            'is_wajib' => true,
            'deskripsi' => 'Sumbangan Pembinaan Pendidikan'
        ]);

        if ($agus) {
            $tagihanAgus = TagihanSiswa::create([
                'siswa_id' => $agus->id,
                'jenis_pembayaran_id' => $spp->id,
                'nama_tagihan' => 'SPP Juli 2026',
                'nominal_tagihan' => 250000,
                'nominal_terbayar' => 250000,
                'status' => 'lunas',
                'tenggat_waktu' => Carbon::now()->endOfMonth(),
            ]);

            TransaksiPembayaran::create([
                'tagihan_id' => $tagihanAgus->id,
                'kode_transaksi' => 'TRX-' . time(),
                'jumlah_bayar' => 250000,
                'metode' => 'transfer',
                'diterima_oleh_id' => $admin->id,
                'tanggal_bayar' => now()->subDays(5),
                'catatan' => 'Transfer via BSI'
            ]);
        }

        if ($budi) {
            TagihanSiswa::create([
                'siswa_id' => $budi->id,
                'jenis_pembayaran_id' => $spp->id,
                'nama_tagihan' => 'SPP Juli 2026',
                'nominal_tagihan' => 250000,
                'nominal_terbayar' => 0,
                'status' => 'belum',
                'tenggat_waktu' => Carbon::now()->endOfMonth(),
            ]);
        }

        // 5. Absensi & RFID
        KonfigurasiAbsensi::firstOrCreate([], [
            'pin' => '123456',
            'jam_masuk' => '07:00:00',
            'jam_pulang' => '15:00:00',
            'toleransi_terlambat' => 15,
            'batas_alpha' => '08:00:00'
        ]);

        if ($agus) {
            KartuRfid::create([
                'siswa_id' => $agus->id,
                'uid' => 'RF:AB:12:CD:34',
                'status' => 'aktif'
            ]);

            Absensi::create([
                'siswa_id' => $agus->id,
                'tanggal' => Carbon::today()->toDateString(),
                'jam_masuk' => '06:45:00',
                'status_masuk' => 'hadir',
                'metode' => 'rfid'
            ]);
            
            Absensi::create([
                'siswa_id' => $agus->id,
                'tanggal' => Carbon::yesterday()->toDateString(),
                'jam_masuk' => '06:50:00',
                'status_masuk' => 'hadir',
                'metode' => 'rfid'
            ]);
        }

        if ($budi) {
            KartuRfid::create([
                'siswa_id' => $budi->id,
                'uid' => 'RF:EF:56:GH:78',
                'status' => 'aktif'
            ]);

            Absensi::create([
                'siswa_id' => $budi->id,
                'tanggal' => Carbon::today()->toDateString(),
                'jam_masuk' => '07:20:00',
                'status_masuk' => 'terlambat',
                'metode' => 'rfid',
                'catatan' => 'Ban bocor'
            ]);
        }
    }
}