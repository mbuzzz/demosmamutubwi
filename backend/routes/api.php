<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\MapelController;
use App\Http\Controllers\EkskulController;
use App\Http\Controllers\PenugasanController;
use App\Http\Controllers\PenugasanStrukturalController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\KartuRfidController;
use App\Http\Controllers\KonfigurasiAbsensiController;
use App\Http\Controllers\KurikulumController;
use App\Http\Controllers\TujuanPembelajaranController;
use App\Http\Controllers\NilaiTpController;
use App\Http\Controllers\NilaiController;
use App\Http\Controllers\RaporController;
use App\Http\Controllers\SistemKonfigurasiController;
use App\Http\Controllers\TahunAjaranController;
use App\Http\Controllers\Api\MonitoringController;
use App\Http\Controllers\SPMBController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\PiketController;

use App\Http\Controllers\Api\CbtBankSoalController;
use App\Http\Controllers\Api\CbtSesiController;
use App\Http\Controllers\Api\CbtUjianController;
use App\Http\Controllers\Api\CbtTemplateController;

use App\Http\Controllers\Api\LmsMateriController;
use App\Http\Controllers\Api\LmsTugasController;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\JurnalController;

// CMS Controllers
use App\Http\Controllers\ProfilSekolahController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\KategoriBeritaController;
use App\Http\Controllers\GaleriController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\TestimoniController;
use App\Http\Controllers\PrestasiController;
use App\Http\Controllers\DownloadController;

// Public CMS Routes
Route::prefix('public')->group(function () {
    Route::get('/profil', [ProfilSekolahController::class, 'show']);
    Route::get('/berita', [BeritaController::class, 'publicIndex']);
    Route::get('/berita/{slug}', [BeritaController::class, 'publicShow']);
    Route::get('/kategori-berita', [KategoriBeritaController::class, 'publicIndex']);
    Route::get('/galeri', [GaleriController::class, 'index']);
    Route::get('/faq', [FaqController::class, 'index']);
    Route::get("/prestasi", [PrestasiController::class, "index"]);
    Route::get('/testimoni', [TestimoniController::class, 'index']);
    
    // Public Guru Directory (detail lengkap dengan mata pelajaran)
    Route::get('/guru', [App\Http\Controllers\UserController::class, 'publicDirectory']);

    // Public Struktur Organisasi Sekolah
    Route::get('/struktural', [App\Http\Controllers\PenugasanStrukturalController::class, 'publicStruktural']);

    // Public Downloads
    Route::get('/downloads', [DownloadController::class, 'publicIndex']);
    Route::get('/downloads/{id}/file', [DownloadController::class, 'downloadFile']);
});

// Public RFID Tap Routes
Route::middleware('throttle:120,1')->post('/absensi/tap', [AbsensiController::class, 'tap']);
Route::middleware('throttle:5,1')->post('/absensi/verify-pin', [KonfigurasiAbsensiController::class, 'verifyPin']);
Route::middleware('throttle:5,1')->post('/pembayaran/verify-pin', [KonfigurasiAbsensiController::class, 'verifyPinPembayaran']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
Route::match(['PUT', 'POST'], '/user/profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');
Route::put('/user/password', [AuthController::class, 'updatePassword'])->middleware('auth:sanctum');
Route::get('/sistem-konfigurasi', [SistemKonfigurasiController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    
    // Jurnal Mengajar — hanya staf pendidik/oversight (bukan siswa/ortu)
    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum,kepala_sekolah')->group(function () {
        Route::apiResource('jurnal', JurnalController::class);
    });

    // 1. USER MANAGEMENT
    // Pendidik boleh membaca daftar siswa untuk KBM; UserController memberi scope kelas.
    // Kurikulum/admin tetap dapat membaca daftar pengguna untuk kebutuhan manajemen.
    Route::middleware('role:superadmin,admin,kurikulum,guru,walikelas,kepala_sekolah,bendahara')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
    });

    Route::middleware('role:superadmin,admin')->group(function () {
        // ID Card (harus sebelum apiResource users karena route :param)
        Route::get('/users/id-card', [UserController::class, 'indexIdCard']);

        Route::get('/users/export/pdf', [UserController::class, 'exportPdf']);
        Route::get('/users/export/xlsx', [UserController::class, 'exportXlsx']);
        Route::post('/users/import/xlsx', [UserController::class, 'importXlsx']);
        Route::apiResource('users', UserController::class)->except(['index']);
        
        // Penugasan & Tugas Struktural
        Route::apiResource('penugasan-struktural', PenugasanStrukturalController::class)->except(['show']);
        Route::apiResource('penugasan', PenugasanController::class);
    });

    // Guru Dashboard / Panel — semua role pendidik (termasuk kurikulum merangkap guru)
    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum,kepala_sekolah')->group(function () {
        Route::get('/guru/classes', [PenugasanController::class, 'guruClasses']);
    });

    // Bendahara perlu membaca kelas untuk filter data pembayaran, tanpa hak mutasi.
    Route::middleware('role:superadmin,admin,kurikulum,bendahara')->group(function () {
        Route::get('/kelas', [KelasController::class, 'index']);
    });

    // 2. KELAS & JADWAL MANAGEMENT (Superadmin, Admin, Kurikulum)
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::get('/kelas/export/pdf', [KelasController::class, 'exportPdf']);
        Route::get('/kelas/export/xlsx', [KelasController::class, 'exportXlsx']);
        Route::post('/kelas/import/xlsx', [KelasController::class, 'importXlsx']);
        Route::apiResource('kelas', KelasController::class)->except(['index']);

        Route::post('/jadwal/bulk', [JadwalController::class, 'storeBulk']);
    });

    Route::middleware('role:superadmin,admin,kurikulum,guru,walikelas,kepala_sekolah,siswa,orang_tua')->group(function () {
        Route::get('/jadwal', [JadwalController::class, 'index']);
    });

    // 3. MAPEL MANAGEMENT
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::get('/mapels/export/pdf', [MapelController::class, 'exportPdf']);
        Route::get('/mapels/export/xlsx', [MapelController::class, 'exportXlsx']);
        Route::post('/mapels/import/xlsx', [MapelController::class, 'importXlsx']);
        Route::apiResource('mapels', MapelController::class)->except(['index', 'show']);
    });

    // Mapel list: walikelas sering merangkap guru multi-mapel
    Route::middleware('role:superadmin,admin,kurikulum,guru,walikelas,kepala_sekolah')->group(function () {
        Route::get('/mapels', [MapelController::class, 'index']);
        Route::get('/mapels/{mapel}', [MapelController::class, 'show']);
    });

    // 4. EKSKUL MANAGEMENT (Superadmin, Admin, Kurikulum)
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::get('/ekskuls/export/pdf', [EkskulController::class, 'exportPdf']);
        Route::get('/ekskuls/export/xlsx', [EkskulController::class, 'exportXlsx']);
        Route::post('/ekskuls/import/xlsx', [EkskulController::class, 'importXlsx']);
        Route::get('/ekskuls/{ekskulId}/jadwal', [EkskulController::class, 'getJadwal']);
        Route::post('/ekskuls/{ekskulId}/jadwal', [EkskulController::class, 'storeJadwal']);
        Route::put('/ekskuls/{ekskulId}/jadwal/{jadwalId}', [EkskulController::class, 'updateJadwal']);
        Route::delete('/ekskuls/{ekskulId}/jadwal/{jadwalId}', [EkskulController::class, 'destroyJadwal']);
        Route::apiResource('ekskuls', EkskulController::class);
    });

    // 5. ABSENSI & RFID MANAGEMENT
    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum,kepala_sekolah,siswa,orang_tua')->group(function () {
        Route::get('/absensi', [AbsensiController::class, 'index']);
        Route::get('/absensi/rekap', [AbsensiController::class, 'rekap']);
        Route::get('/absensi/siswa/{id}', [AbsensiController::class, 'rekapSiswa']);
    });

    // Absensi Guru: staf lihat milik sendiri; kepsek/admin/kurikulum lihat semua
    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum,kepala_sekolah,bendahara')->group(function () {
        Route::get('/absensi-guru', [AbsensiController::class, 'indexGuru']);
        Route::get('/absensi-guru/rekap', [AbsensiController::class, 'rekapGuru']);
    });
    Route::middleware('role:superadmin,admin,kepala_sekolah')->group(function () {
        Route::post('/absensi-guru', [AbsensiController::class, 'storeGuru']);
    });

    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum,kepala_sekolah')->group(function () {
        Route::post('/absensi', [AbsensiController::class, 'store']);
        Route::put('/absensi/{id}', [AbsensiController::class, 'update']);
    });

    Route::middleware('role:superadmin,admin')->group(function () {
        Route::apiResource('kartu-rfid', KartuRfidController::class)->except(['show']);
        
        Route::get('/konfigurasi-absensi', [KonfigurasiAbsensiController::class, 'show']);
        Route::put('/konfigurasi-absensi', [KonfigurasiAbsensiController::class, 'update']);

        // Sistem Konfigurasi (Academic Settings)
        Route::put('/sistem-konfigurasi', [SistemKonfigurasiController::class, 'update']);
        Route::post('/sistem-konfigurasi', [SistemKonfigurasiController::class, 'update']); // For file uploads via FormData + _method=PUT
        Route::get('/sistem-konfigurasi/options', [SistemKonfigurasiController::class, 'getAvailableOptions']);
        
        // CMS Management
        Route::put('/profil-sekolah', [ProfilSekolahController::class, 'update']);
        Route::post('/profil-sekolah', [ProfilSekolahController::class, 'update']); // For file uploads via FormData + _method=PUT
        Route::get('/berita', [BeritaController::class, 'index']);
        Route::get('/berita/{id}', [BeritaController::class, 'show']);
        Route::apiResource('berita', BeritaController::class)->except(['index', 'show']);
        Route::get('/kategori-berita', [KategoriBeritaController::class, 'index']);
        Route::apiResource('kategori-berita', KategoriBeritaController::class)->except(['index', 'show']);
        Route::get('/galeri', [GaleriController::class, 'index']);
        Route::apiResource('galeri', GaleriController::class)->except(['index', 'show']);
        Route::get('/prestasi', [PrestasiController::class, 'index']);
        Route::apiResource("prestasi", PrestasiController::class)->except(["index", "show"]);
        Route::get('/faq', [FaqController::class, 'index']);
        Route::apiResource('faq', FaqController::class)->except(['index', 'show']);
        Route::get('/testimoni', [TestimoniController::class, 'index']);
        Route::apiResource('testimoni', TestimoniController::class)->except(['index', 'show']);
        Route::apiResource('downloads', DownloadController::class);
    });

    // 6. KURIKULUM MANAGEMENT
    // superadmin/admin/kurikulum: full CRUD
    // guru/walikelas/kepala_sekolah: read-only (lihat kurikulum aktif untuk KBM)
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::post('kurikulum', [KurikulumController::class, 'store']);
        Route::put('kurikulum/{kurikulum}', [KurikulumController::class, 'update']);
        Route::delete('kurikulum/{kurikulum}', [KurikulumController::class, 'destroy']);
    });
    Route::middleware('role:superadmin,admin,kurikulum,guru,walikelas,kepala_sekolah,siswa,orang_tua')->group(function () {
        Route::get('kurikulum', [KurikulumController::class, 'index']);
        Route::get('kurikulum/{kurikulum}', [KurikulumController::class, 'show']);
    });

    // 7. TUJUAN PEMBELAJARAN (termasuk walikelas multi-role mengajar)
    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum')->group(function () {
        Route::get('/tujuan-pembelajaran', [TujuanPembelajaranController::class, 'index']);
        Route::post('/tujuan-pembelajaran', [TujuanPembelajaranController::class, 'store']);
        Route::get('/tujuan-pembelajaran/{id}', [TujuanPembelajaranController::class, 'show']);
        Route::put('/tujuan-pembelajaran/{id}', [TujuanPembelajaranController::class, 'update']);
        Route::delete('/tujuan-pembelajaran/{id}', [TujuanPembelajaranController::class, 'destroy']);
    });

    // 8. NILAI TP
    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum')->group(function () {
        Route::get('/nilai-tp/siswa', [NilaiTpController::class, 'getSiswaNilai']);
        Route::post('/nilai-tp', [NilaiTpController::class, 'store']);
    });

    // 9. NILAI & RAPOR (includes walikelas & kepala_sekolah for cetak/view)
    Route::middleware('role:superadmin,admin,guru,walikelas,kepala_sekolah,kurikulum,siswa,orang_tua')->group(function () {
        Route::get('/nilais', [NilaiController::class, 'index']);
        Route::get('/rapors', [RaporController::class, 'index']);
        Route::get('/rapors/{id}', [RaporController::class, 'show']);
        Route::get('/rapors/{id}/pdf', [RaporController::class, 'exportPdf']);
    });

    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum')->group(function () {
        Route::get('/nilai/monitoring-uh', [NilaiController::class, 'monitoringUH']);
        Route::post('/nilais', [NilaiController::class, 'store']);
        Route::post('/rapors', [RaporController::class, 'store']);
        Route::put('/rapors/{id}', [RaporController::class, 'update']);
        Route::put('/rapors/{id}/publish', [RaporController::class, 'publish']);
        Route::post('/rapors/ekskul', [RaporController::class, 'storeEkskulNilai']);
        Route::delete('/rapors/ekskul/{id}', [RaporController::class, 'deleteEkskulNilai']);
    });

    // 10. SPMB (Superadmin, Admin)
    Route::middleware('role:superadmin,admin')->group(function () {
        // Gelombang
        Route::get('/spmb/gelombang', [SPMBController::class, 'indexGelombang']);
        Route::post('/spmb/gelombang', [SPMBController::class, 'storeGelombang']);
        Route::get('/spmb/gelombang/{id}', [SPMBController::class, 'showGelombang']);
        Route::put('/spmb/gelombang/{id}', [SPMBController::class, 'updateGelombang']);
        Route::delete('/spmb/gelombang/{id}', [SPMBController::class, 'destroyGelombang']);

        // Pendaftar
        Route::get('/spmb/pendaftar', [SPMBController::class, 'indexPendaftar']);
        Route::get('/spmb/pendaftar/{id}', [SPMBController::class, 'showPendaftar']);
        Route::put('/spmb/pendaftar/{id}', [SPMBController::class, 'updatePendaftar']);
        Route::delete('/spmb/pendaftar/{id}', [SPMBController::class, 'destroyPendaftar']);

        // Form Fields
        Route::get('/spmb/form-fields', [SPMBController::class, 'indexFormField']);
        Route::post('/spmb/form-fields', [SPMBController::class, 'storeFormField']);
        Route::put('/spmb/form-fields/{id}', [SPMBController::class, 'updateFormField']);
        Route::delete('/spmb/form-fields/{id}', [SPMBController::class, 'destroyFormField']);
    });

    // 11. PEMBAYARAN
    // Tagihan: siswa/ortu (milik sendiri) + finance staff (semua)
    Route::middleware('role:superadmin,admin,bendahara,siswa,orang_tua')->group(function () {
        Route::get('/pembayaran/tagihan', [PembayaranController::class, 'getTagihanSiswa']);
    });

    // RFID lookup tagihan: HANYA finance (cegah siswa lookup kartu orang lain)
    Route::middleware('role:superadmin,admin,bendahara')->group(function () {
        Route::get('/pembayaran/rfid/{uid}', [PembayaranController::class, 'getStudentByRfid']);

        // Jenis Pembayaran
        Route::get('/pembayaran/jenis', [PembayaranController::class, 'getJenisPembayaran']);
        Route::post('/pembayaran/jenis', [PembayaranController::class, 'storeJenisPembayaran']);
        Route::put('/pembayaran/jenis/{id}', [PembayaranController::class, 'updateJenisPembayaran']);
        Route::delete('/pembayaran/jenis/{id}', [PembayaranController::class, 'deleteJenisPembayaran']);

        // Tagihan
        Route::post('/pembayaran/tagihan', [PembayaranController::class, 'createTagihanSiswa']);
        Route::put('/pembayaran/tagihan/{id}/beasiswa', [PembayaranController::class, 'updateBeasiswa']);

        // Transaksi & Proses Bayar
        Route::post('/pembayaran/proses', [PembayaranController::class, 'prosesPembayaran']);
        Route::get('/pembayaran/transaksi', [PembayaranController::class, 'getTransaksi']);
        Route::put('/pembayaran/transaksi/{id}', [PembayaranController::class, 'updateTransaksi']);
        Route::delete('/pembayaran/transaksi/{id}', [PembayaranController::class, 'deleteTransaksi']);
        Route::get('/pembayaran/statistik', [PembayaranController::class, 'getStatistik']);
    });

    // 11b. GURU PIKET (Jadwal, Absensi, Laporan)
    Route::middleware('role:superadmin,admin,kepala_sekolah,kurikulum,bendahara')->group(function () {
        Route::get('/piket/guru', [PiketController::class, 'guruPiket']);
        Route::get('/piket/jadwal', [PiketController::class, 'indexJadwal']);
        Route::post('/piket/jadwal', [PiketController::class, 'storeJadwal']);
        Route::put('/piket/jadwal/{id}', [PiketController::class, 'updateJadwal']);
        Route::delete('/piket/jadwal/{id}', [PiketController::class, 'deleteJadwal']);
        Route::get('/piket/absensi', [PiketController::class, 'getAbsensi']);
        Route::post('/piket/absensi', [PiketController::class, 'storeAbsensi']);
        Route::put('/piket/absensi/{id}', [PiketController::class, 'updateAbsensi']);
        Route::delete('/piket/absensi/{id}', [PiketController::class, 'deleteAbsensi']);
        Route::get('/piket/laporan', [PiketController::class, 'getLaporan']);
    });

    // 12. CBT (Computer Based Test)
    // Bank Soal & Sesi — walikelas multi-role juga bisa (asalkan hasRole guru/walikelas)
    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum')->group(function () {
        Route::apiResource('cbt/bank-soal', CbtBankSoalController::class);
        Route::post('cbt/bank-soal/{bankSoal}/soals', [CbtBankSoalController::class, 'storeSoal']);
        Route::put('cbt/bank-soal/{bankSoal}/soals/{soal}', [CbtBankSoalController::class, 'updateSoal']);
        Route::delete('cbt/bank-soal/{bankSoal}/soals/{soal}', [CbtBankSoalController::class, 'destroySoal']);

        Route::apiResource('cbt/sesi', CbtSesiController::class);
        Route::post('cbt/sesi/{sesiUjian}/refresh-token', [CbtSesiController::class, 'refreshToken']);
        Route::get('cbt/sesi/{sesiUjian}/monitor', [CbtSesiController::class, 'monitor']);
        Route::post('cbt/sesi/{sesiUjian}/force-selesai/{siswaId}', [CbtSesiController::class, 'forceSelesai']);
        Route::post('cbt/sesi/{sesiUjian}/end', [CbtSesiController::class, 'endSesi']);
        Route::apiResource('cbt/templates', CbtTemplateController::class);

        // Upload gambar untuk soal (pertanyaan/opsi/kunci) — multi-role
        Route::post('cbt/upload-media', [CbtUjianController::class, 'uploadMedia']);
    });

    // 3b. TAHUN AJARAN CRUD (Superadmin, Admin, Kurikulum)
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::apiResource('tahun-ajarans', TahunAjaranController::class);
        Route::post('tahun-ajarans/{id}/activate', [TahunAjaranController::class, 'activate']);
    });

    // 3c. MONITORING (Superadmin, Admin, Kurikulum, Kepsek)
    Route::middleware('role:superadmin,admin,kurikulum,kepala_sekolah')->group(function () {
        Route::get('monitoring/cbt', [MonitoringController::class, 'cbt']);
        Route::get('monitoring/cbt/sesi/{sesiId}', [MonitoringController::class, 'cbtSesiDetail']);
        Route::get('monitoring/lms', [MonitoringController::class, 'lms']);
    });

    // LMS Shared Endpoints
    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum,siswa,orang_tua')->group(function () {
        Route::get('lms/materi', [LmsMateriController::class, 'index']);
        Route::get('lms/materi/{id}', [LmsMateriController::class, 'show']);
        Route::post('lms/materi/{id}/komentar', [LmsMateriController::class, 'addKomentar']);
        
        Route::get('lms/tugas', [LmsTugasController::class, 'index']);
        Route::get('lms/tugas/{id}', [LmsTugasController::class, 'show']);
        Route::post('lms/tugas/{id}/komentar', [LmsTugasController::class, 'addKomentar']);
        Route::get('lms/tugas/{id}/my-submission', [LmsTugasController::class, 'mySubmission']);
    });
    
    // Ujian Execution (Siswa)
    Route::middleware('role:siswa')->group(function () {
        Route::get('cbt/ujian/sesi-aktif', [CbtUjianController::class, 'getSesiAktif']);
        Route::post('cbt/ujian/mulai', [CbtUjianController::class, 'mulaiUjian']);
        Route::post('cbt/ujian/simpan-jawaban', [CbtUjianController::class, 'simpanJawaban']);
        Route::post('cbt/ujian/selesai', [CbtUjianController::class, 'selesaiUjian']);
        
        // LMS Siswa Submit Tugas
        Route::post('lms/tugas/{id}/submit', [LmsTugasController::class, 'submitTugas']);
    });
    
    // LMS Admin/Guru Management
    Route::middleware('role:superadmin,admin,guru,walikelas,kurikulum')->group(function () {
        Route::apiResource('lms/materi', LmsMateriController::class)->except(['index', 'show']);
        Route::apiResource('lms/tugas', LmsTugasController::class)->except(['index', 'show']);
        
        Route::get('lms/tugas/{id}/submissions', [LmsTugasController::class, 'getSubmissions']);
        Route::post('lms/tugas/{id}/grade/{siswa_id}', [LmsTugasController::class, 'gradeSubmission']);
    });
});

// Public SPMB routes (no auth)
Route::get('/spmb/gelombang-aktif', [SPMBController::class, 'publicGelombangAktif']);
Route::get('/spmb/form-fields/{gelombangId}', [SPMBController::class, 'publicFormFields']);
Route::post('/spmb/daftar', [SPMBController::class, 'storePendaftar']);
