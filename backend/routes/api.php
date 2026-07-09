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
use App\Http\Controllers\SPMBController;
use App\Http\Controllers\PembayaranController;

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

// Public CMS Routes
Route::prefix('public')->group(function () {
    Route::get('/profil', [ProfilSekolahController::class, 'show']);
    Route::get('/berita', [BeritaController::class, 'index']);
    Route::get('/berita/{slug}', [BeritaController::class, 'show']);
    Route::get('/kategori-berita', [KategoriBeritaController::class, 'index']);
    Route::get('/galeri', [GaleriController::class, 'index']);
    Route::get('/faq', [FaqController::class, 'index']);
    Route::get('/testimoni', [TestimoniController::class, 'index']);
    
    // Public Guru Directory
    Route::get('/guru', [App\Http\Controllers\UserController::class, 'publicDirectory']);
});

// Public RFID Tap Routes
Route::post('/absensi/tap', [AbsensiController::class, 'tap']);
Route::post('/absensi/verify-pin', [KonfigurasiAbsensiController::class, 'verifyPin']);

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
    
    // Jurnal Mengajar
    Route::apiResource('jurnal', JurnalController::class);

    // 1. USER MANAGEMENT (Only Superadmin & Admin)
    Route::middleware('role:superadmin,admin')->group(function () {
        Route::get('/users/export/pdf', [UserController::class, 'exportPdf']);
        Route::get('/users/export/xlsx', [UserController::class, 'exportXlsx']);
        Route::post('/users/import/xlsx', [UserController::class, 'importXlsx']);
        Route::apiResource('users', UserController::class);
        
        // Penugasan & Tugas Struktural
        Route::apiResource('penugasan-struktural', PenugasanStrukturalController::class)->except(['show']);
        Route::apiResource('penugasan', PenugasanController::class);
    });

    // Guru Dashboard / Panel
    Route::middleware('role:superadmin,admin,guru')->group(function () {
        Route::get('/guru/classes', [PenugasanController::class, 'guruClasses']);
    });

    // 2. KELAS & JADWAL MANAGEMENT (Superadmin, Admin, Kurikulum)
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::get('/kelas/export/pdf', [KelasController::class, 'exportPdf']);
        Route::get('/kelas/export/xlsx', [KelasController::class, 'exportXlsx']);
        Route::post('/kelas/import/xlsx', [KelasController::class, 'importXlsx']);
        Route::apiResource('kelas', KelasController::class);

        Route::post('/jadwal/bulk', [JadwalController::class, 'storeBulk']);
    });

    Route::middleware('role:superadmin,admin,kurikulum,guru,siswa,orang_tua')->group(function () {
        Route::get('/jadwal', [JadwalController::class, 'index']);
    });

    // 3. MAPEL MANAGEMENT
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::get('/mapels/export/pdf', [MapelController::class, 'exportPdf']);
        Route::get('/mapels/export/xlsx', [MapelController::class, 'exportXlsx']);
        Route::post('/mapels/import/xlsx', [MapelController::class, 'importXlsx']);
        Route::apiResource('mapels', MapelController::class)->except(['index', 'show']);
    });

    Route::middleware('role:superadmin,admin,kurikulum,guru')->group(function () {
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
    Route::middleware('role:superadmin,admin,guru,siswa,orang_tua')->group(function () {
        Route::get('/absensi', [AbsensiController::class, 'index']);
        Route::get('/absensi/rekap', [AbsensiController::class, 'rekap']);
        Route::get('/absensi/siswa/{id}', [AbsensiController::class, 'rekapSiswa']);
    });

    Route::middleware('role:superadmin,admin,guru')->group(function () {
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
        Route::apiResource('berita', BeritaController::class)->except(['index', 'show']);
        Route::apiResource('kategori-berita', KategoriBeritaController::class)->except(['index', 'show']);
        Route::apiResource('galeri', GaleriController::class)->except(['index', 'show']);
        Route::apiResource('faq', FaqController::class)->except(['index', 'show']);
        Route::apiResource('testimoni', TestimoniController::class)->except(['index', 'show']);
    });

    // 6. KURIKULUM MANAGEMENT (Superadmin, Admin, Kurikulum)
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::apiResource('kurikulum', KurikulumController::class);
    });

    // 7. TUJUAN PEMBELAJARAN (Superadmin, Admin, Guru, Kurikulum)
    Route::middleware('role:superadmin,admin,guru,kurikulum')->group(function () {
        Route::get('/tujuan-pembelajaran', [TujuanPembelajaranController::class, 'index']);
        Route::post('/tujuan-pembelajaran', [TujuanPembelajaranController::class, 'store']);
        Route::get('/tujuan-pembelajaran/{id}', [TujuanPembelajaranController::class, 'show']);
        Route::put('/tujuan-pembelajaran/{id}', [TujuanPembelajaranController::class, 'update']);
        Route::delete('/tujuan-pembelajaran/{id}', [TujuanPembelajaranController::class, 'destroy']);
    });

    // 8. NILAI TP (Superadmin, Admin, Guru, Kurikulum)
    Route::middleware('role:superadmin,admin,guru,kurikulum')->group(function () {
        Route::get('/nilai-tp/siswa', [NilaiTpController::class, 'getSiswaNilai']);
        Route::post('/nilai-tp', [NilaiTpController::class, 'store']);
    });

    // 9. NILAI & RAPOR (Superadmin, Admin, Guru, Kurikulum, Siswa, Orang Tua)
    Route::middleware('role:superadmin,admin,guru,kurikulum,siswa,orang_tua')->group(function () {
        Route::get('/nilais', [NilaiController::class, 'index']);
        Route::get('/rapors', [RaporController::class, 'index']);
        Route::get('/rapors/{id}', [RaporController::class, 'show']);
        Route::get('/rapors/{id}/pdf', [RaporController::class, 'exportPdf']);
    });

    Route::middleware('role:superadmin,admin,guru,kurikulum')->group(function () {
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

    // 11. PEMBAYARAN (Superadmin, Admin, Bendahara, Siswa, Orang Tua)
    Route::middleware('role:superadmin,admin,bendahara,siswa,orang_tua')->group(function () {
        Route::get('/pembayaran/tagihan', [PembayaranController::class, 'getTagihanSiswa']);
        Route::get('/pembayaran/rfid/{uid}', [PembayaranController::class, 'getStudentByRfid']);
    });

    Route::middleware('role:superadmin,admin,bendahara')->group(function () {
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

    // 12. CBT (Computer Based Test)
    // Bank Soal & Sesi Management (Superadmin, Admin, Guru)
    Route::middleware('role:superadmin,admin,guru')->group(function () {
        Route::apiResource('cbt/bank-soal', CbtBankSoalController::class);
        Route::post('cbt/bank-soal/{bankSoal}/soals', [CbtBankSoalController::class, 'storeSoal']);
        Route::put('cbt/bank-soal/{bankSoal}/soals/{soal}', [CbtBankSoalController::class, 'updateSoal']);
        Route::delete('cbt/bank-soal/{bankSoal}/soals/{soal}', [CbtBankSoalController::class, 'destroySoal']);

        Route::apiResource('cbt/sesi', CbtSesiController::class);
        Route::post('cbt/sesi/{sesiUjian}/refresh-token', [CbtSesiController::class, 'refreshToken']);
        Route::apiResource('cbt/templates', CbtTemplateController::class);
    });

    // LMS Shared Endpoints
    Route::middleware('role:superadmin,admin,guru,siswa,orang_tua')->group(function () {
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
    Route::middleware('role:superadmin,admin,guru')->group(function () {
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
