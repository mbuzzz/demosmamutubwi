import { useState } from 'react';
import { ArrowLeft, User, GraduationCap, ShieldCheck, Mail, Lock, LogIn, Wallet, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { useRoleSimulator, type Role } from '../components/simulator/RoleContext';

const GROUPS: { key: string; label: string; icon: typeof User; roles: { value: Role; label: string; panel: string }[] }[] = [
  {
    key: 'siswa',
    label: 'Siswa',
    icon: GraduationCap,
    roles: [{ value: 'siswa', label: 'Siswa / Peserta Didik', panel: '/panel/siswa' }],
  },
  {
    key: 'guru-group',
    label: 'Guru / Tenaga Pendidik',
    icon: Users,
    roles: [
      { value: 'guru', label: 'Guru', panel: '/panel/guru' },
      { value: 'walikelas', label: 'Wali Kelas', panel: '/panel/guru' },
      { value: 'kepala_sekolah', label: 'Kepala Sekolah', panel: '/panel/guru' },
      { value: 'kurikulum', label: 'Kurikulum', panel: '/panel/guru' },
    ],
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: ShieldCheck,
    roles: [{ value: 'superadmin', label: 'Admin / Superuser', panel: '/panel' }],
  },
  {
    key: 'bendahara',
    label: 'Bendahara',
    icon: Wallet,
    roles: [{ value: 'bendahara', label: 'Bendahara / Keuangan', panel: '/panel/bendahara' }],
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setSimulatedRole } = useRoleSimulator();
  const [groupKey, setGroupKey] = useState('siswa');
  const [subRole, setSubRole] = useState('siswa');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const group = GROUPS.find(g => g.key === groupKey)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = groupKey === 'guru-group' ? subRole : group.roles[0].value;
    const panel = group.roles.find(r => r.value === role)?.panel || group.roles[0].panel;
    const nameMap: Record<string, string> = {
      superadmin: 'Admin SMAS Muh 1',
      guru: 'Rina Fitriani, S.Pd',
      walikelas: 'Ahmad Hidayat, S.Pd',
      kepala_sekolah: 'Drs. H. Sugeng, M.Pd',
      kurikulum: 'Dewi Sartika, S.Pd',
      bendahara: 'Siti Nurhaliza, S.E',
      siswa: 'Agus Setiawan',
    };
    login(role, nameMap[role] || 'Pengguna');
    setSimulatedRole(role as Role);
    navigate(panel);
  };

  const activeGroup = GROUPS.find(g => g.key === groupKey);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-teal/20 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-blueDark/10 blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10 min-h-[600px]">
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-brand-blueDark p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-12 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Logo SMAS Muh 1" className="h-16 w-16 object-contain bg-white/20 p-2 rounded-[15px] backdrop-blur-md" />
              <div>
                <h2 className="font-extrabold text-2xl leading-tight">SMAS Muhammadiyah 1</h2>
                <p className="text-brand-yellow font-bold uppercase tracking-widest text-sm">Banyuwangi</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[15px]">
              <h3 className="font-bold text-xl mb-2">Sistem Informasi Terintegrasi</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Platform layanan administrasi, pembelajaran e-learning, absensi RFID, pembayaran digital, dan E-Rapor terpadu.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-brand-teal/40 backdrop-blur-md border border-brand-teal/50 p-4 rounded-[15px] flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-brand-yellow" />
                <div className="text-sm font-semibold leading-tight">RBAC Multi-Role</div>
              </div>
              <div className="flex-1 bg-brand-green/30 backdrop-blur-md border border-brand-green/40 p-4 rounded-[15px] flex items-center gap-3">
                <User className="w-8 h-8 text-white" />
                <div className="text-sm font-semibold leading-tight">Akses Terpusat</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 relative">
          <Link to="/" className="md:hidden inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-brand-blueDark mb-8 transition-colors font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Selamat Datang</h1>
            <p className="text-slate-500 dark:text-slate-400">Pilih peran Anda untuk masuk.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-8">
            {GROUPS.map(g => {
              const Icon = g.icon;
              const isActive = groupKey === g.key;
              const colors: Record<string, string> = {
                siswa: isActive ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 text-emerald-700 dark:text-emerald-300' : '',
                'guru-group': isActive ? 'bg-blue-100 dark:bg-blue-500/20 border-blue-400 text-blue-700 dark:text-blue-300' : '',
                admin: isActive ? 'bg-indigo-100 dark:bg-indigo-500/20 border-indigo-400 text-indigo-700 dark:text-indigo-300' : '',
                bendahara: isActive ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-300' : '',
              };
              return (
                <button key={g.key} type="button" onClick={() => { setGroupKey(g.key); setSubRole(g.roles[0].value); }}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200 border-2 ${isActive ? colors[g.key] + ' shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <Icon className={`w-7 h-7 ${isActive ? '' : 'text-slate-400'}`} />
                  {g.label.split(' / ')[0]}
                </button>
              );
            })}
          </div>

          {groupKey === 'guru-group' && (
            <div className="mb-6 px-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Sub-Role</label>
              <div className="flex flex-wrap gap-2">
                {group.roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setSubRole(r.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${subRole === r.value
                      ? 'bg-blue-100 dark:bg-blue-500/20 border-blue-400 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-200'}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pl-1">
                {groupKey === 'siswa' ? 'NISN / Email Siswa' : 'Email / NIP'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input type="text" required value={identifier} onChange={e => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                  placeholder={groupKey === 'siswa' ? 'Masukkan NISN atau Email...' : 'Masukkan Email atau NIP...'} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center pl-1 pr-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs font-semibold text-brand-teal dark:text-emerald-400 hover:text-brand-blueDark transition-colors">Lupa Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                  placeholder="Masukkan password..." />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-blueDark font-extrabold py-4 px-4 rounded-[15px] shadow-sm hover:shadow-card transition-all duration-200">
                <LogIn className="w-5 h-5" /> Masuk sebagai {activeGroup?.roles.find(r => r.value === (groupKey === 'guru-group' ? subRole : activeGroup!.roles[0].value))?.label.split(' / ')[0]}
              </button>
            </div>

            {groupKey === 'siswa' && (
              <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
                Calon siswa baru? <a href="/spmb" className="text-brand-teal dark:text-emerald-400 font-bold hover:underline">Daftar SPMB di sini</a>
              </div>
            )}
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-center text-[10px] text-slate-400">
              PIN Tap RFID: <span className="font-mono font-bold text-slate-500 dark:text-slate-300">123456</span>
              {' '}— Gunakan di halaman <Link to="/tap/absensi" className="text-indigo-500 hover:underline">/tap/absensi</Link> dan <Link to="/tap/pembayaran" className="text-indigo-500 hover:underline">/tap/pembayaran</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
