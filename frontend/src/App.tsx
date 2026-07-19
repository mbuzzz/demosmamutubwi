import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import GuruDirectory from './pages/GuruDirectory';
import NewsHub from './pages/NewsHub';
import NewsDetail from './pages/NewsDetail';
import Downloads from './pages/Downloads';
import Login from './pages/Login';
import LoginSiswa from './pages/LoginSiswa';
import LoginGuru from './pages/LoginGuru';
import LoginAdmin from './pages/LoginAdmin';
import LoginBendahara from './pages/LoginBendahara';
import LoginOrangTua from './pages/LoginOrangTua';
import SPMB from './pages/SPMB';
import FormSPMB from './pages/FormSPMB';

// RFID & Public Tap Pages
import TapAbsensi from './pages/TapAbsensi';
import TapPembayaran from './pages/TapPembayaran';

// Admin Imports
import ProtectedRoute from './components/ProtectedRoute';
// Web Profile Admin Pages
import AdminBeranda from './pages/admin/halaman/AdminBeranda';
import AdminProfilSekolah from './pages/admin/halaman/AdminProfilSekolah';
import AdminPrestasiList from './pages/admin/halaman/AdminPrestasiList';
import AdminPrestasiForm from './pages/admin/halaman/AdminPrestasiForm';
import AdminFaqTestimoni from './pages/admin/web/AdminFaqTestimoni';

import AdminDashboard from './pages/admin/Dashboard';
import AdminBeritaList from './pages/admin/berita/AdminBeritaList';
import AdminBeritaForm from './pages/admin/berita/AdminBeritaForm';
import AdminKategoriList from './pages/admin/berita/AdminKategoriList';
import AdminGaleriList from './pages/admin/galeri/AdminGaleriList';
import AdminSPMBList from './pages/admin/spmb/AdminSPMBList';
import AdminGelombangList from './pages/admin/spmb/AdminGelombangList';
import AdminFormBuilder from './pages/admin/spmb/AdminFormBuilder';
import AdminDownloadsList from './pages/admin/downloads/AdminDownloadsList';
import AdminSearch from './pages/admin/Search';
import AdminUserList from './pages/admin/akademik/AdminUserList';
import AdminUserForm from './pages/admin/akademik/AdminUserForm';
import AdminPenugasanList from './pages/admin/akademik/AdminPenugasanList';
import AdminKurikulumList from './pages/admin/kurikulum/AdminKurikulumList';
import AdminKurikulumForm from './pages/admin/kurikulum/AdminKurikulumForm';
import AdminKelasList from './pages/admin/akademik/AdminKelasList';
import AdminMapelList from './pages/admin/akademik/AdminMapelList';
import AdminNilaiEntry from './pages/admin/akademik/AdminNilaiEntry';
import AdminRaporList from './pages/admin/akademik/AdminRaporList';
import AdminCatatanWali from './pages/admin/akademik/rapor/AdminCatatanWali';
import AdminCetakRaporDetail from './pages/admin/akademik/rapor/AdminCetakRaporDetail';
import AdminJadwalPelajaran from './pages/admin/akademik/jadwal/AdminJadwalPelajaran';
import AdminKehadiranSiswa from './pages/admin/akademik/jadwal/AdminKehadiranSiswa';
import AdminSettings from './pages/admin/settings/AdminSettings';
import AdminUjianList from './pages/admin/cbt/AdminUjianList';
import AdminUjianMonitor from './pages/admin/cbt/AdminUjianMonitor';
import AdminBankSoalList from './pages/admin/cbt/AdminBankSoalList';
import AdminCbtTemplateList from './pages/admin/cbt/AdminCbtTemplateList';
import AdminProfile from './pages/admin/profile/AdminProfile';
import AdminSPMBDetail from './pages/admin/spmb/detail/AdminSPMBDetail';

// Absensi & Pembayaran Admin Pages
import AdminAbsensi from './pages/admin/absensi/AdminAbsensi';
import AdminRekapAbsensi from './pages/admin/absensi/AdminRekapAbsensi';
import AdminRfidCards from './pages/admin/absensi/AdminRfidCards';
import AdminPembayaran from './pages/admin/pembayaran/AdminPembayaran';
import AdminJenisPembayaran from './pages/admin/pembayaran/AdminJenisPembayaran';
import AdminPembayaranSiswa from './pages/admin/pembayaran/AdminPembayaranSiswa';
import AdminSettingsRfid from './pages/admin/settings/AdminSettingsRfid';
import AdminEkstrakurikuler from './pages/admin/akademik/AdminEkstrakurikuler';
import AdminSettingsBank from './pages/admin/settings/AdminSettingsBank';

// Guru Group Pages (shared by guru, walikelas, kepsek, kurikulum)
import GuruDashboard from './pages/admin/guru/GuruDashboard';
import GuruJurnalPresensi from './pages/admin/guru/kbm/GuruJurnalPresensi';
import GuruJurnalDetail from './pages/admin/guru/kbm/GuruJurnalDetail';
import GuruBukuNilai from './pages/admin/guru/kbm/GuruBukuNilai';
import GuruNilaiDetail from './pages/admin/guru/kbm/GuruNilaiDetail';
import GuruBankMateri from './pages/admin/guru/kbm/GuruMateri';
import GuruMateriDetail from './pages/admin/guru/kbm/GuruMateriDetail';
import GuruTugas from './pages/admin/guru/kbm/GuruTugas';
import GuruTugasDetail from './pages/admin/guru/kbm/GuruTugasDetail';
import GuruBankSoalEditor from './pages/admin/guru/cbt/GuruBankSoalEditor';
import GuruUjianList from './pages/admin/guru/cbt/GuruUjianList';
import GuruWaliSiswa from './pages/admin/guru/kbm/GuruWaliSiswa';
import GuruCatatanWali from './pages/admin/guru/kbm/GuruCatatanWali';
import GuruTujuanPembelajaran from './pages/admin/guru/kbm/GuruTujuanPembelajaran';
import GuruNilaiTp from './pages/admin/guru/kbm/GuruNilaiTp';
import GuruAbsensi from './pages/admin/guru/kbm/GuruAbsensi';
import GuruAbsensiGuru from './pages/admin/guru/kbm/GuruAbsensiGuru';
import KepsekDashboard from './pages/admin/guru/kbm/KepsekDashboard';
import KurikulumDashboard from './pages/admin/guru/kbm/KurikulumDashboard';

// Bendahara Pages
import BendaharaDashboard from './pages/admin/bendahara/BendaharaDashboard';

// Siswa Panel Pages
import SiswaDashboard from './pages/admin/siswa/SiswaDashboard';
import SiswaJadwal from './pages/admin/siswa/SiswaJadwal';
import SiswaMateri from './pages/admin/siswa/SiswaMateri';
import SiswaTugas from './pages/admin/siswa/SiswaTugas';
import SiswaCbt from './pages/admin/siswa/SiswaCbt';
import SiswaRapor from './pages/admin/siswa/SiswaRapor';
import SiswaAbsensi from './pages/admin/siswa/SiswaAbsensi';
import SiswaPembayaran from './pages/admin/siswa/SiswaPembayaran';

import { Toaster } from 'sonner';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-50">
      <div>
        <Navbar />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/profile" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/guru" element={<PublicLayout><GuruDirectory /></PublicLayout>} />
        <Route path="/berita" element={<PublicLayout><NewsHub /></PublicLayout>} />
        <Route path="/berita/:id" element={<PublicLayout><NewsDetail /></PublicLayout>} />
        <Route path="/unduhan" element={<PublicLayout><Downloads /></PublicLayout>} />
        <Route path="/spmb" element={<PublicLayout><SPMB /></PublicLayout>} />
        <Route path="/spmb/form/:gelombangId" element={<PublicLayout><FormSPMB /></PublicLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/siswa" element={<LoginSiswa />} />
        <Route path="/login/guru" element={<LoginGuru />} />
        <Route path="/login/orang-tua" element={<LoginOrangTua />} />
        {/* Permalink staf (sengaja tidak ditampilkan di hub /login) */}
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/bendahara" element={<LoginBendahara />} />
        {/* Alias lama — tetap jalan biar link lama tidak putus */}
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/bendahara" element={<LoginBendahara />} />
        <Route path="/adminlogin" element={<LoginAdmin />} />
        <Route path="/tap/absensi" element={<TapAbsensi />} />
        <Route path="/tap/pembayaran" element={<TapPembayaran />} />
        <Route path="/tap/bendahara" element={<TapPembayaran />} />

        {/* ========== SUPERADMIN / ADMIN ========== */}
        <Route path="/panel" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/panel/search" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminSearch /></ProtectedRoute>} />
        <Route path="/panel/beranda" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminBeranda /></ProtectedRoute>} />
        <Route path="/panel/profil-sekolah" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminProfilSekolah /></ProtectedRoute>} />
        <Route path="/panel/prestasi" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminPrestasiList /></ProtectedRoute>} />
        <Route path="/panel/prestasi/tambah" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminPrestasiForm /></ProtectedRoute>} />
        <Route path="/panel/prestasi/edit/:id" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminPrestasiForm /></ProtectedRoute>} />
        <Route path="/panel/faq-testimoni" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminFaqTestimoni /></ProtectedRoute>} />
        <Route path="/panel/berita" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminBeritaList /></ProtectedRoute>} />
        <Route path="/panel/berita/tambah" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminBeritaForm /></ProtectedRoute>} />
        <Route path="/panel/berita/edit/:id" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminBeritaForm /></ProtectedRoute>} />
        <Route path="/panel/kategori-berita" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminKategoriList /></ProtectedRoute>} />
        <Route path="/panel/galeri" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminGaleriList /></ProtectedRoute>} />
        <Route path="/panel/spmb" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminSPMBList /></ProtectedRoute>} />
        <Route path="/panel/spmb/detail/:id" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminSPMBDetail /></ProtectedRoute>} />
        <Route path="/panel/spmb/gelombang" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminGelombangList /></ProtectedRoute>} />
        <Route path="/panel/spmb/form-builder" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminFormBuilder /></ProtectedRoute>} />
        <Route path="/panel/downloads" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminDownloadsList /></ProtectedRoute>} />
        <Route path="/panel/users" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminUserList /></ProtectedRoute>} />
        <Route path="/panel/users/tambah" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminUserForm /></ProtectedRoute>} />
        <Route path="/panel/users/edit/:id" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminUserForm /></ProtectedRoute>} />
        <Route path="/panel/penugasan" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminPenugasanList /></ProtectedRoute>} />
        <Route path="/panel/jadwal" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminJadwalPelajaran /></ProtectedRoute>} />
        <Route path="/panel/kehadiran" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminKehadiranSiswa /></ProtectedRoute>} />
        <Route path="/panel/kurikulum" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminKurikulumList /></ProtectedRoute>} />
        <Route path="/panel/kurikulum/tambah" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminKurikulumForm /></ProtectedRoute>} />
        <Route path="/panel/kurikulum/edit/:id" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminKurikulumForm /></ProtectedRoute>} />
        <Route path="/panel/kelas" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminKelasList /></ProtectedRoute>} />
        <Route path="/panel/mapel" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminMapelList /></ProtectedRoute>} />
        <Route path="/panel/nilai" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminNilaiEntry /></ProtectedRoute>} />
        <Route path="/panel/rapor" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminRaporList /></ProtectedRoute>} />
        <Route path="/panel/rapor/catatan" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminCatatanWali /></ProtectedRoute>} />
        <Route path="/panel/rapor/cetak/:id" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminCetakRaporDetail /></ProtectedRoute>} />
        <Route path="/panel/settings" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminSettings /></ProtectedRoute>} />
        <Route path="/panel/settings/rfid" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminSettingsRfid /></ProtectedRoute>} />
        <Route path="/panel/settings/bank" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminSettingsBank /></ProtectedRoute>} />
        <Route path="/panel/ekskul" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminEkstrakurikuler /></ProtectedRoute>} />
        {/* Profil: semua role yang masuk panel (guru, bendahara, siswa, dll.) */}
        <Route path="/panel/profile" element={<ProtectedRoute requiredRole={['superadmin', 'admin', 'guru', 'walikelas', 'kepala_sekolah', 'kurikulum', 'bendahara', 'siswa', 'orang_tua']}><AdminProfile /></ProtectedRoute>} />
        <Route path="/panel/absensi" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminAbsensi /></ProtectedRoute>} />
        <Route path="/panel/absensi/rekap" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminRekapAbsensi /></ProtectedRoute>} />
        <Route path="/panel/absensi/rfid" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminRfidCards /></ProtectedRoute>} />
        <Route path="/panel/pembayaran" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminPembayaran /></ProtectedRoute>} />
        <Route path="/panel/pembayaran/jenis" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminJenisPembayaran /></ProtectedRoute>} />
        <Route path="/panel/pembayaran/siswa" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminPembayaranSiswa /></ProtectedRoute>} />
        <Route path="/panel/cbt/bank-soal" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminBankSoalList /></ProtectedRoute>} />
        <Route path="/panel/cbt/jadwal" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminUjianList /></ProtectedRoute>} />
        <Route path="/panel/cbt/monitor" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminUjianMonitor /></ProtectedRoute>} />
        <Route path="/panel/cbt/templates" element={<ProtectedRoute requiredRole={['superadmin', 'admin']}><AdminCbtTemplateList /></ProtectedRoute>} />

        {/* ========== GURU / WALIKELAS / KEPSEK / KURIKULUM ========== */}
        <Route path="/panel/guru" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kepala_sekolah', 'kurikulum']}><GuruDashboard /></ProtectedRoute>} />
        <Route path="/panel/guru/kepsek" element={<ProtectedRoute requiredRole={['kepala_sekolah']}><KepsekDashboard /></ProtectedRoute>} />
        <Route path="/panel/guru/kurikulum" element={<ProtectedRoute requiredRole={['kurikulum']}><KurikulumDashboard /></ProtectedRoute>} />
        <Route path="/panel/guru/jurnal" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruJurnalPresensi /></ProtectedRoute>} />
        <Route path="/panel/guru/jurnal/detail/:id" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruJurnalDetail /></ProtectedRoute>} />
        <Route path="/panel/guru/nilai" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruBukuNilai /></ProtectedRoute>} />
        <Route path="/panel/guru/nilai/detail/:id" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruNilaiDetail /></ProtectedRoute>} />
        <Route path="/panel/guru/materi" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruBankMateri /></ProtectedRoute>} />
        <Route path="/panel/guru/materi/detail/:id" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruMateriDetail /></ProtectedRoute>} />
        <Route path="/panel/guru/tugas" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruTugas /></ProtectedRoute>} />
        <Route path="/panel/guru/tugas/detail/:id" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruTugasDetail /></ProtectedRoute>} />
        <Route path="/panel/guru/soal" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruBankSoalEditor /></ProtectedRoute>} />
        <Route path="/panel/guru/ujian" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruUjianList /></ProtectedRoute>} />
        <Route path="/panel/guru/wali-siswa" element={<ProtectedRoute requiredRole={['walikelas']}><GuruWaliSiswa /></ProtectedRoute>} />
        <Route path="/panel/guru/catatan-wali" element={<ProtectedRoute requiredRole={['walikelas']}><GuruCatatanWali /></ProtectedRoute>} />
        <Route path="/panel/guru/tp" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruTujuanPembelajaran /></ProtectedRoute>} />
        <Route path="/panel/guru/nilai-tp" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruNilaiTp /></ProtectedRoute>} />
        <Route path="/panel/guru/absensi" element={<ProtectedRoute requiredRole={['guru', 'walikelas', 'kurikulum']}><GuruAbsensi /></ProtectedRoute>} />
        <Route path="/panel/guru/absensi/rekap" element={<ProtectedRoute requiredRole={['kepala_sekolah', 'kurikulum', 'guru', 'walikelas']}><AdminRekapAbsensi /></ProtectedRoute>} />
        <Route path="/panel/guru/absensi/guru" element={<ProtectedRoute requiredRole={['kepala_sekolah', 'kurikulum', 'guru', 'walikelas']}><GuruAbsensiGuru /></ProtectedRoute>} />
        <Route path="/panel/guru/rapor" element={<ProtectedRoute requiredRole={['kepala_sekolah', 'walikelas', 'guru', 'kurikulum']}><AdminRaporList /></ProtectedRoute>} />
        <Route path="/panel/guru/rapor/cetak/:id" element={<ProtectedRoute requiredRole={['kepala_sekolah', 'walikelas', 'kurikulum']}><AdminCetakRaporDetail /></ProtectedRoute>} />
        <Route path="/panel/guru/jadwal" element={<ProtectedRoute requiredRole={['kurikulum', 'kepala_sekolah']}><AdminJadwalPelajaran /></ProtectedRoute>} />
        <Route path="/panel/guru/mapel" element={<ProtectedRoute requiredRole={['kurikulum']}><AdminMapelList /></ProtectedRoute>} />
        <Route path="/panel/guru/kelas" element={<ProtectedRoute requiredRole={['kurikulum']}><AdminKelasList /></ProtectedRoute>} />
        <Route path="/panel/guru/kurikulum/rumus" element={<ProtectedRoute requiredRole={['kurikulum', 'guru', 'walikelas', 'kepala_sekolah']}><AdminKurikulumList /></ProtectedRoute>} />

        {/* ========== BENDAHARA ========== */}
        <Route path="/panel/bendahara" element={<ProtectedRoute requiredRole="bendahara"><BendaharaDashboard /></ProtectedRoute>} />
        <Route path="/panel/bendahara/pembayaran" element={<ProtectedRoute requiredRole="bendahara"><AdminPembayaran /></ProtectedRoute>} />
        <Route path="/panel/bendahara/pembayaran/jenis" element={<ProtectedRoute requiredRole="bendahara"><AdminJenisPembayaran /></ProtectedRoute>} />
        <Route path="/panel/bendahara/pembayaran/siswa" element={<ProtectedRoute requiredRole="bendahara"><AdminPembayaranSiswa /></ProtectedRoute>} />
        <Route path="/panel/bendahara/settings" element={<ProtectedRoute requiredRole="bendahara"><AdminSettingsBank /></ProtectedRoute>} />

        {/* ========== SISWA / ORANG TUA ========== */}
        <Route path="/panel/siswa" element={<ProtectedRoute requiredRole={['siswa', 'orang_tua']}><SiswaDashboard /></ProtectedRoute>} />
        <Route path="/panel/siswa/jadwal" element={<ProtectedRoute requiredRole={['siswa', 'orang_tua']}><SiswaJadwal /></ProtectedRoute>} />
        <Route path="/panel/siswa/materi" element={<ProtectedRoute requiredRole={['siswa', 'orang_tua']}><SiswaMateri /></ProtectedRoute>} />
        <Route path="/panel/siswa/materi/detail/:id" element={<ProtectedRoute requiredRole={['siswa', 'orang_tua']}><SiswaMateri /></ProtectedRoute>} />
        <Route path="/panel/siswa/tugas" element={<ProtectedRoute requiredRole={['siswa', 'orang_tua']}><SiswaTugas /></ProtectedRoute>} />
        <Route path="/panel/siswa/tugas/detail/:id" element={<ProtectedRoute requiredRole={['siswa', 'orang_tua']}><SiswaTugas /></ProtectedRoute>} />
        <Route path="/panel/siswa/cbt" element={<ProtectedRoute requiredRole={['siswa', 'orang_tua']}><SiswaCbt /></ProtectedRoute>} />
        <Route path="/panel/siswa/rapor" element={<ProtectedRoute requiredRole={['siswa', 'orang_tua']}><SiswaRapor /></ProtectedRoute>} />
        <Route path="/panel/siswa/absensi" element={<ProtectedRoute requiredRole={['siswa', 'orang_tua']}><SiswaAbsensi /></ProtectedRoute>} />
        <Route path="/panel/siswa/pembayaran" element={<ProtectedRoute requiredRole={['siswa', 'orang_tua']}><SiswaPembayaran /></ProtectedRoute>} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </Router>
  );
}
