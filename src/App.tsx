
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
import SPMB from './pages/SPMB';
import FormSPMB from './pages/FormSPMB';

// Admin Imports
import ProtectedRoute from './components/ProtectedRoute';
// Web Profile Admin Pages
import AdminBeranda from './pages/admin/halaman/AdminBeranda';
import AdminProfilSekolah from './pages/admin/halaman/AdminProfilSekolah';
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
import AdminProfile from './pages/admin/profile/AdminProfile';
import AdminSPMBDetail from './pages/admin/spmb/detail/AdminSPMBDetail';

// Guru Panel Pages
import GuruDashboard from './pages/admin/guru/GuruDashboard';
import GuruJurnalPresensi from './pages/admin/guru/kbm/GuruJurnalPresensi';
import GuruJurnalDetail from './pages/admin/guru/kbm/GuruJurnalDetail';
import GuruBukuNilai from './pages/admin/guru/kbm/GuruBukuNilai';
import GuruNilaiDetail from './pages/admin/guru/kbm/GuruNilaiDetail';
import GuruBankMateri from './pages/admin/guru/kbm/GuruMateri';
import GuruTugas from './pages/admin/guru/kbm/GuruTugas';
import GuruBankSoalEditor from './pages/admin/guru/cbt/GuruBankSoalEditor';
import GuruUjianList from './pages/admin/guru/cbt/GuruUjianList';
import GuruWaliSiswa from './pages/admin/guru/kbm/GuruWaliSiswa';
import GuruCatatanWali from './pages/admin/guru/kbm/GuruCatatanWali';

// Siswa Panel Pages
import SiswaDashboard from './pages/admin/siswa/SiswaDashboard';
import SiswaJadwal from './pages/admin/siswa/SiswaJadwal';
import SiswaMateri from './pages/admin/siswa/SiswaMateri';
import SiswaTugas from './pages/admin/siswa/SiswaTugas';
import SiswaCbt from './pages/admin/siswa/SiswaCbt';
import SiswaRapor from './pages/admin/siswa/SiswaRapor';

import { Toaster } from 'sonner';

// Wrapper for public pages to keep them structured with Navbar and Footer
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
        <Route path="/login" element={<Login />} /> {/* Login has its own layout */}

        {/* Admin CBT */}
        <Route path="/panel/cbt/bank-soal" element={<ProtectedRoute requiredRole="superadmin"><AdminBankSoalList /></ProtectedRoute>} />
        <Route path="/panel/cbt/jadwal" element={<ProtectedRoute requiredRole="superadmin"><AdminUjianList /></ProtectedRoute>} />
        <Route path="/panel/cbt/monitor" element={<ProtectedRoute requiredRole="superadmin"><AdminUjianMonitor /></ProtectedRoute>} />
        <Route path="/panel" element={<ProtectedRoute requiredRole="superadmin"><AdminDashboard /></ProtectedRoute>} />
        
        {/* Admin Web Profile */}
        <Route path="/panel/beranda" element={<ProtectedRoute requiredRole="superadmin"><AdminBeranda /></ProtectedRoute>} />
        <Route path="/panel/profil-sekolah" element={<ProtectedRoute requiredRole="superadmin"><AdminProfilSekolah /></ProtectedRoute>} />
        <Route path="/panel/faq-testimoni" element={<ProtectedRoute requiredRole="superadmin"><AdminFaqTestimoni /></ProtectedRoute>} />
        <Route path="/panel/berita" element={<ProtectedRoute requiredRole="superadmin"><AdminBeritaList /></ProtectedRoute>} />
        <Route path="/panel/berita/tambah" element={<ProtectedRoute requiredRole="superadmin"><AdminBeritaForm /></ProtectedRoute>} />
        <Route path="/panel/kategori-berita" element={<ProtectedRoute requiredRole="superadmin"><AdminKategoriList /></ProtectedRoute>} />
        <Route path="/panel/galeri" element={<ProtectedRoute requiredRole="superadmin"><AdminGaleriList /></ProtectedRoute>} />
        <Route path="/panel/spmb" element={<ProtectedRoute requiredRole="superadmin"><AdminSPMBList /></ProtectedRoute>} />
        <Route path="/panel/spmb/detail/:id" element={<ProtectedRoute requiredRole="superadmin"><AdminSPMBDetail /></ProtectedRoute>} />
        <Route path="/panel/spmb/gelombang" element={<ProtectedRoute requiredRole="superadmin"><AdminGelombangList /></ProtectedRoute>} />
        <Route path="/panel/spmb/form-builder" element={<ProtectedRoute requiredRole="superadmin"><AdminFormBuilder /></ProtectedRoute>} />
        <Route path="/panel/downloads" element={<ProtectedRoute requiredRole="superadmin"><AdminDownloadsList /></ProtectedRoute>} />
        
        <Route path="/panel/users" element={<ProtectedRoute requiredRole="superadmin"><AdminUserList /></ProtectedRoute>} />
        <Route path="/panel/users/tambah" element={<ProtectedRoute requiredRole="superadmin"><AdminUserForm /></ProtectedRoute>} />
        <Route path="/panel/penugasan" element={<ProtectedRoute requiredRole="superadmin"><AdminPenugasanList /></ProtectedRoute>} />
        <Route path="/panel/jadwal" element={<ProtectedRoute requiredRole="superadmin"><AdminJadwalPelajaran /></ProtectedRoute>} />
        <Route path="/panel/kehadiran" element={<ProtectedRoute requiredRole="superadmin"><AdminKehadiranSiswa /></ProtectedRoute>} />
        <Route path="/panel/kurikulum" element={<ProtectedRoute requiredRole="superadmin"><AdminKurikulumList /></ProtectedRoute>} />
        <Route path="/panel/kurikulum/tambah" element={<ProtectedRoute requiredRole="superadmin"><AdminKurikulumForm /></ProtectedRoute>} />
        <Route path="/panel/kelas" element={<ProtectedRoute requiredRole="superadmin"><AdminKelasList /></ProtectedRoute>} />
        <Route path="/panel/mapel" element={<ProtectedRoute requiredRole="superadmin"><AdminMapelList /></ProtectedRoute>} />
        <Route path="/panel/nilai" element={<ProtectedRoute requiredRole="superadmin"><AdminNilaiEntry /></ProtectedRoute>} />
        
        <Route path="/panel/rapor" element={<ProtectedRoute requiredRole="superadmin"><AdminRaporList /></ProtectedRoute>} />
        <Route path="/panel/rapor/catatan" element={<ProtectedRoute requiredRole="superadmin"><AdminCatatanWali /></ProtectedRoute>} />
        <Route path="/panel/rapor/cetak/:id" element={<ProtectedRoute requiredRole="superadmin"><AdminCetakRaporDetail /></ProtectedRoute>} />
        
        <Route path="/panel/settings" element={<ProtectedRoute requiredRole="superadmin"><AdminSettings /></ProtectedRoute>} />
        <Route path="/panel/profile" element={<ProtectedRoute requiredRole="superadmin"><AdminProfile /></ProtectedRoute>} />

        {/* Guru Panel Routes */}
        <Route path="/panel/guru" element={<ProtectedRoute requiredRole="guru"><GuruDashboard /></ProtectedRoute>} />
        <Route path="/panel/guru/jurnal" element={<ProtectedRoute requiredRole="guru"><GuruJurnalPresensi /></ProtectedRoute>} />
        <Route path="/panel/guru/jurnal/detail/:id" element={<ProtectedRoute requiredRole="guru"><GuruJurnalDetail /></ProtectedRoute>} />
        <Route path="/panel/guru/nilai" element={<ProtectedRoute requiredRole="guru"><GuruBukuNilai /></ProtectedRoute>} />
        <Route path="/panel/guru/nilai/detail/:id" element={<ProtectedRoute requiredRole="guru"><GuruNilaiDetail /></ProtectedRoute>} />
        <Route path="/panel/guru/materi" element={<ProtectedRoute requiredRole="guru"><GuruBankMateri /></ProtectedRoute>} />
        <Route path="/panel/guru/tugas" element={<ProtectedRoute requiredRole="guru"><GuruTugas /></ProtectedRoute>} />
        <Route path="/panel/guru/soal" element={<ProtectedRoute requiredRole="guru"><GuruBankSoalEditor /></ProtectedRoute>} />
        <Route path="/panel/guru/ujian" element={<ProtectedRoute requiredRole="guru"><GuruUjianList /></ProtectedRoute>} />
        <Route path="/panel/guru/wali-siswa" element={<ProtectedRoute requiredRole="guru"><GuruWaliSiswa /></ProtectedRoute>} />
        <Route path="/panel/guru/catatan-wali" element={<ProtectedRoute requiredRole="guru"><GuruCatatanWali /></ProtectedRoute>} />

        {/* Siswa Panel Routes */}
        <Route path="/panel/siswa" element={<ProtectedRoute requiredRole="siswa"><SiswaDashboard /></ProtectedRoute>} />
        <Route path="/panel/siswa/jadwal" element={<ProtectedRoute requiredRole="siswa"><SiswaJadwal /></ProtectedRoute>} />
        <Route path="/panel/siswa/materi" element={<ProtectedRoute requiredRole="siswa"><SiswaMateri /></ProtectedRoute>} />
        <Route path="/panel/siswa/materi/detail/:id" element={<ProtectedRoute requiredRole="siswa"><SiswaMateri /></ProtectedRoute>} />
        <Route path="/panel/siswa/tugas" element={<ProtectedRoute requiredRole="siswa"><SiswaTugas /></ProtectedRoute>} />
        <Route path="/panel/siswa/tugas/detail/:id" element={<ProtectedRoute requiredRole="siswa"><SiswaTugas /></ProtectedRoute>} />
        <Route path="/panel/siswa/cbt" element={<ProtectedRoute requiredRole="siswa"><SiswaCbt /></ProtectedRoute>} />
        <Route path="/panel/siswa/rapor" element={<ProtectedRoute requiredRole="siswa"><SiswaRapor /></ProtectedRoute>} />
      </Routes>
        <Toaster position="top-right" richColors closeButton />
      </Router>
  );
}
