import { useState } from 'react';
import { ArrowLeft, ShieldAlert, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { useRoleSimulator, type Role } from '../components/simulator/RoleContext';
import { toast } from 'sonner';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setSimulatedRole } = useRoleSimulator();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(username, password);
      
      const allowedRoles = ['superadmin', 'bendahara', 'admin'];
      if (!allowedRoles.includes(user.role)) {
        throw new Error('Akun Anda bukan akun Administrator / Bendahara. Silakan gunakan portal yang sesuai.');
      }
      
      setSimulatedRole(user.role as Role);
      
      if (user.role === 'bendahara') {
        navigate('/panel/bendahara');
      } else {
        navigate('/panel');
      }
      
      toast.success(`Selamat datang di Portal Admin & Keuangan, ${user.name}!`);
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Periksa kembali username dan password Anda.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-850 p-8 relative z-10">
        <div className="text-center mb-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-650 transition-colors font-bold text-xs mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Pilih Portal Lain
          </Link>
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-850 dark:text-white">Portal Admin & Keuangan</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Masukkan username administrator dan password Anda</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 rounded-2xl flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-455 uppercase mb-1.5 pl-1">Username Admin</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                required 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="Contoh: admin / siti" 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-mono" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-455 uppercase mb-1.5 pl-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all active:scale-95 shadow-sm mt-6"
          >
            <LogIn className="w-4 h-4" /> Masuk Portal Admin
          </button>
        </form>
      </div>
    </div>
  );
}
