import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, ArrowLeft, User as UserIcon, Lock, Camera, Mail, Phone, MapPin, Building, Shield } from 'lucide-react';

export default function AdminUserForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState('siswa');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Data Pengguna berhasil disimpan!');
    navigate('/panel/users');
  };

  return (
    <AdminLayout title="Form Data Pengguna">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/panel/users" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar User
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Kolom Kiri: Profil & Foto */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full border-4 border-white shadow-md relative mb-4 flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 dark:text-slate-400" />
              <button type="button" className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm border-2 border-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Foto Profil</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Format JPG/PNG, Maksimal 2MB. Rasio 1:1.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" /> Hak Akses (Role)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Pilih Peran Pengguna</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="siswa">Siswa / Peserta Didik</option>
                  <option value="guru">Guru / Tenaga Pendidik</option>
                  <option value="admin">Admin / Staff Tata Usaha</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Status Akun</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="status" defaultChecked className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" /> Aktif
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="status" className="text-red-600 focus:ring-red-500 w-4 h-4" /> Nonaktif / Lulus
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Data Pribadi & Spesifik Role */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-500" /> Data Pribadi
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Nama Lengkap</label>
                  <input type="text" placeholder="Masukkan nama lengkap" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Email (Username Login)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" placeholder="email@sekolah.com" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Nomor Handphone (WhatsApp)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="08123456789" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="password" placeholder="Minimal 6 karakter" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Alamat Domisili</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-3" />
                  <textarea rows={2} placeholder="Alamat lengkap..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Form Dinamis Berdasarkan Role */}
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-indigo-50/20">
            <h3 className="font-bold text-indigo-900 mb-4 pb-2 border-b border-indigo-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" /> 
              Data Akademik Khusus ({role === 'siswa' ? 'Siswa' : role === 'guru' ? 'Guru' : 'Admin'})
            </h3>
            
            {role === 'siswa' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 mb-1.5">NIS / NISN</label>
                  <input type="text" placeholder="Nomor Induk Siswa Nasional" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 mb-1.5">Penempatan Kelas</label>
                  <select className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- Belum Ada Kelas --</option>
                    <option value="X-1">X-1 (Fase E)</option>
                    <option value="X-2">X-2 (Fase E)</option>
                    <option value="XI-IPA-1">XI IPA 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 mb-1.5">Tahun Masuk / Angkatan</label>
                  <input type="number" defaultValue={new Date().getFullYear()} className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            )}

            {role === 'guru' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 mb-1.5">NIP / NBM</label>
                  <input type="text" placeholder="Nomor Induk Pegawai" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 mb-1.5">Spesialisasi Mapel (Opsional)</label>
                  <input type="text" placeholder="Contoh: Matematika, Fisika" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-indigo-900 mb-1.5">Jabatan Tambahan (Struktural)</label>
                  <input type="text" placeholder="Contoh: Wali Kelas X-1, Waka Kurikulum" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            )}

            {role === 'admin' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 mb-1.5">Bagian / Divisi</label>
                  <select className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Tata Usaha (TU)</option>
                    <option>Keuangan / Bendahara</option>
                    <option>Perpustakaan</option>
                    <option>Superadmin Sistem</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors shadow-md hover:shadow-lg">
              <Save className="w-5 h-5" /> Simpan Data Pengguna
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
