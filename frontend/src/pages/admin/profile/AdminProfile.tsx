import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, User, Lock, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthContext';
import { api } from '../../../lib/api';
import { toast } from 'sonner';

const ROLE_LABELS: Record<string, string> = {
  superadmin: 'Superadmin',
  guru: 'Guru',
  walikelas: 'Wali Kelas',
  kepala_sekolah: 'Kepala Sekolah',
  kurikulum: 'Kurikulum',
  bendahara: 'Bendahara',
  siswa: 'Siswa',
  admin: 'Staf Admin',
};

export default function AdminProfile() {
  const { user, checkSession } = useAuth();

  // Profile Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');

  // Initialize fields
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setUsername(user.username || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !username) {
      toast.error('Nama, Username, dan Email wajib diisi');
      return;
    }

    try {
      const res = await api.put('/user/profile', {
        name,
        email,
        username,
        phone: phone || null,
      });
      toast.success(res.data.message || 'Profil berhasil diperbarui!');
      await checkSession(); // Refresh context user session
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !password) {
      toast.error('Lengkapi password saat ini dan password baru');
      return;
    }
    if (password.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }

    try {
      const res = await api.put('/user/password', {
        current_password: currentPassword,
        password,
      });
      toast.success(res.data.message || 'Password berhasil diperbarui!');
      setCurrentPassword('');
      setPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui password. Pastikan password saat ini benar.');
    }
  };

  const userRoleLabel = user?.role ? (ROLE_LABELS[user.role] || user.role) : 'Tamu';
  const userInitials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <AdminLayout title="Profil Saya">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden h-fit border border-slate-100 dark:border-slate-800">
          <div className="bg-indigo-600 h-24"></div>
          <div className="px-6 pb-6 relative">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full p-1 absolute -top-10 left-6">
              <div className="w-full h-full bg-indigo-100 dark:bg-indigo-550/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl border border-indigo-200 dark:border-indigo-800">
                {userInitials || 'U'}
              </div>
            </div>
            <div className="pt-12">
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">{name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{email}</p>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded-md text-xs font-medium border border-purple-100 dark:border-purple-800/30">{userRoleLabel}</span>
                <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-medium border border-emerald-100 dark:border-emerald-800/30">Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Informasi Dasar</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-mono" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Alamat Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nomor Telepon (WhatsApp)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08123456789" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                  <Save className="w-4 h-4" /> Simpan Profil
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Ubah Password</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password Saat Ini</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Masukkan password lama" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password Baru</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password baru" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                  <Save className="w-4 h-4" /> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
