
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
import AdminPenugasanList from './pages/admin/akademik/AdminPenugasanList';
import AdminKurikulumList from './pages/admin/kurikulum/AdminKurikulumList';
import AdminKurikulumForm from './pages/admin/kurikulum/AdminKurikulumForm';
import AdminKelasList from './pages/admin/akademik/AdminKelasList';
import AdminMapelList from './pages/admin/akademik/AdminMapelList';
import AdminNilaiEntry from './pages/admin/akademik/AdminNilaiEntry';
import AdminRaporList from './pages/admin/akademik/AdminRaporList';
import AdminSettings from './pages/admin/settings/AdminSettings';
import AdminProfile from './pages/admin/profile/AdminProfile';

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

        {/* Admin Routes */}
        <Route path="/panel" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        
        {/* Admin Web Profile */}
        <Route path="/panel/beranda" element={<ProtectedRoute><AdminBeranda /></ProtectedRoute>} />
        <Route path="/panel/profil-sekolah" element={<ProtectedRoute><AdminProfilSekolah /></ProtectedRoute>} />
        <Route path="/panel/faq-testimoni" element={<ProtectedRoute><AdminFaqTestimoni /></ProtectedRoute>} />
        <Route path="/panel/berita" element={<ProtectedRoute><AdminBeritaList /></ProtectedRoute>} />
        <Route path="/panel/berita/tambah" element={<ProtectedRoute><AdminBeritaForm /></ProtectedRoute>} />
        <Route path="/panel/kategori-berita" element={<ProtectedRoute><AdminKategoriList /></ProtectedRoute>} />
        <Route path="/panel/galeri" element={<ProtectedRoute><AdminGaleriList /></ProtectedRoute>} />
        <Route path="/panel/spmb" element={<ProtectedRoute><AdminSPMBList /></ProtectedRoute>} />
        <Route path="/panel/spmb/gelombang" element={<ProtectedRoute><AdminGelombangList /></ProtectedRoute>} />
        <Route path="/panel/spmb/form-builder" element={<ProtectedRoute><AdminFormBuilder /></ProtectedRoute>} />
        <Route path="/panel/downloads" element={<ProtectedRoute><AdminDownloadsList /></ProtectedRoute>} />
        
        <Route path="/panel/users" element={<ProtectedRoute><AdminUserList /></ProtectedRoute>} />
        <Route path="/panel/penugasan" element={<ProtectedRoute><AdminPenugasanList /></ProtectedRoute>} />
        <Route path="/panel/kurikulum" element={<ProtectedRoute><AdminKurikulumList /></ProtectedRoute>} />
        <Route path="/panel/kurikulum/tambah" element={<ProtectedRoute><AdminKurikulumForm /></ProtectedRoute>} />
        <Route path="/panel/kelas" element={<ProtectedRoute><AdminKelasList /></ProtectedRoute>} />
        <Route path="/panel/mapel" element={<ProtectedRoute><AdminMapelList /></ProtectedRoute>} />
        <Route path="/panel/nilai" element={<ProtectedRoute><AdminNilaiEntry /></ProtectedRoute>} />
        <Route path="/panel/rapor" element={<ProtectedRoute><AdminRaporList /></ProtectedRoute>} />
        
        <Route path="/panel/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path="/panel/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
