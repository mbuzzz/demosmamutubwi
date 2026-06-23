import { useState } from 'react';
import { ArrowLeft, User, GraduationCap, ShieldCheck, Mail, Lock, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { useRoleSimulator } from '../components/simulator/RoleContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setSimulatedRole } = useRoleSimulator();
  const [loginType, setLoginType] = useState('siswa');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = loginType === 'siswa' ? 'siswa' : 'superadmin';
    const name = loginType === 'siswa' ? 'Agus Setiawan' : 'Admin SMAS Muh 1';
    login(role, name);
    setSimulatedRole(role as 'siswa' | 'superadmin');
    navigate(role === 'siswa' ? '/panel/siswa' : '/panel');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-teal/20 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-blueDark/10 blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative z-10 min-h-[600px]">
        
        <div className="hidden md:flex flex-col justify-between bg-gradien-biru-hijau p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-12 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Kembali ke Beranda
            </Link>
            
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Logo SMAS Muh 1" className="h-16 w-16 object-contain bg-white dark:bg-slate-900/10 p-2 rounded-[15px] backdrop-blur-md" />
              <div>
                <h2 className="font-extrabold text-2xl leading-tight">SMAS Muhammadiyah 1</h2>
                <p className="text-brand-yellow font-bold uppercase tracking-widest text-sm">Banyuwangi</p>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="bg-white dark:bg-slate-900/10 backdrop-blur-md border border-white/20 p-6 rounded-[15px]">
              <h3 className="font-bold text-xl mb-2">Sistem Informasi Terintegrasi</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Platform layanan administrasi, pembelajaran e-learning, dan E-Rapor digital terpadu untuk civitas akademika.
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 bg-brand-teal/40 backdrop-blur-md border border-brand-teal/50 p-4 rounded-[15px] flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-brand-yellow" />
                <div className="text-sm font-semibold leading-tight">Keamanan Terjamin</div>
              </div>
              <div className="flex-1 bg-brand-green/30 backdrop-blur-md border border-brand-green/40 p-4 rounded-[15px] flex items-center gap-3">
                <User className="w-8 h-8 text-white" />
                <div className="text-sm font-semibold leading-tight">Akses Terpusat</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 relative">
          <Link to="/" className="md:hidden inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-brand-blueDark dark:text-brand-yellow mb-8 transition-colors font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Selamat Datang</h1>
            <p className="text-slate-500 dark:text-slate-400">Silakan pilih peran dan masuk ke akun Anda.</p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-[15px] mb-8 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setLoginType('siswa')}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                loginType === 'siswa' 
                  ? 'bg-white dark:bg-slate-900 text-brand-blueDark dark:text-brand-yellow shadow-sm transform scale-100' 
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700/50 scale-95'
              }`}
            >
              <GraduationCap className={`w-6 h-6 ${loginType === 'siswa' ? 'text-brand-teal dark:text-emerald-400' : 'text-slate-400'}`} />
              Siswa & Ortu
            </button>
            <button
              type="button"
              onClick={() => setLoginType('guru-admin')}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                loginType === 'guru-admin' 
                  ? 'bg-brand-blueDark text-white shadow-sm transform scale-100' 
                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700/50 scale-95'
              }`}
            >
              <ShieldCheck className={`w-6 h-6 ${loginType === 'guru-admin' ? 'text-brand-yellow' : 'text-slate-400'}`} />
              Guru & Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pl-1">
                {loginType === 'siswa' ? 'NISN / Email Siswa' : 'Email Pegawai / NIP'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                  placeholder={loginType === 'siswa' ? 'Masukkan NISN atau Email...' : 'Masukkan Email Pegawai...'}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center pl-1 pr-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs font-semibold text-brand-teal dark:text-emerald-400 hover:text-brand-blueDark dark:text-brand-yellow transition-colors">Lupa Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                  placeholder="Masukkan password Anda..."
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-blueDark dark:text-brand-yellow font-extrabold py-4 px-4 rounded-[15px] shadow-sm hover:shadow-card dark:shadow-none transition-all duration-200"
              >
                <LogIn className="w-5 h-5" /> Masuk Sistem
              </button>
            </div>
            
            {loginType === 'siswa' && (
              <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
                Calon siswa baru? <a href="#daftar-sekarang" className="text-brand-teal dark:text-emerald-400 font-bold hover:underline">Daftar SPMB di sini</a>
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}
