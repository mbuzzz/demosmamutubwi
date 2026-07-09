import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { useRoleSimulator, type Role } from '../components/simulator/RoleContext';
import { toast } from 'sonner';
import { useSistemKonfigurasi } from '../hooks/useSistemKonfigurasi';
import { getFileUrl } from '../lib/api';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setSimulatedRole } = useRoleSimulator();
  const { data: config } = useSistemKonfigurasi();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load remembered username
  useEffect(() => {
    const saved = localStorage.getItem('remember_admin_username');
    if (saved) {
      setUsername(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(username, password);
      
      const allowedRoles = ['superadmin', 'admin'];
      if (!allowedRoles.includes(user.role)) {
        throw new Error('Akun Anda bukan akun Administrator. Silakan gunakan portal yang sesuai.');
      }

      // Save or remove remembered username
      if (rememberMe) {
        localStorage.setItem('remember_admin_username', username);
      } else {
        localStorage.removeItem('remember_admin_username');
      }
      
      setSimulatedRole(user.role as Role);
      navigate('/panel');
      toast.success(`Selamat datang di Portal Admin, ${user.name}!`);
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Periksa kembali username dan password Anda.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 p-8 relative z-10">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-xs mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
          
          <div className="flex flex-col items-center justify-center gap-3 mt-2 mb-4">
            <div className="relative">
              <img src={config?.logo_sekolah ? getFileUrl(config.logo_sekolah) : "/logo.png"} alt="Logo Sekolah" className="h-16 w-16 object-contain bg-white dark:bg-slate-900 p-2 rounded-[15px] shadow-sm border border-slate-100 dark:border-slate-800" />
              <div className="absolute -bottom-2 -right-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 p-1.5 rounded-lg border border-white dark:border-slate-900">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">Portal Administrator</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Masukkan username admin dan password Anda</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 rounded-2xl flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 pl-1">Username Admin</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                required 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="Contoh: admin" 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-mono" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 pl-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-9 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pl-1 pr-1 text-xs">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer font-bold select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300 dark:border-slate-700" 
              />
              Ingat Saya
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all active:scale-95 shadow-sm mt-6"
          >
            <LogIn className="w-4 h-4" /> Masuk Portal Admin
          </button>
        </form>
      </div>
    </div>
  );
}
