import { Eye, Shield, BookOpen, Crown, Users } from 'lucide-react';
import { useRoleSimulator } from './RoleContext';

export default function RoleSimulator() {
  const { simulatedRole, setSimulatedRole } = useRoleSimulator();

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-inner">
      <div className="pl-3 pr-2 flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest hidden lg:flex">
        <Eye className="w-3.5 h-3.5" /> View As:
      </div>
      
      <button 
        onClick={() => setSimulatedRole('superadmin')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          simulatedRole === 'superadmin' 
            ? 'bg-indigo-600 text-white shadow-sm scale-100' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 scale-95 hover:scale-100'
        }`}
        title="Superadmin"
      >
        <Shield className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Admin</span>
      </button>

      <button 
        onClick={() => setSimulatedRole('guru')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          simulatedRole === 'guru' 
            ? 'bg-emerald-600 text-white shadow-sm scale-100' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 scale-95 hover:scale-100'
        }`}
        title="Guru Mapel"
      >
        <BookOpen className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Guru</span>
      </button>

      <button 
        onClick={() => setSimulatedRole('walikelas')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          simulatedRole === 'walikelas' 
            ? 'bg-amber-500 text-white shadow-sm scale-100' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 scale-95 hover:scale-100'
        }`}
        title="Wali Kelas"
      >
        <Crown className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Wali Kelas</span>
      </button>

      <button 
        onClick={() => setSimulatedRole('siswa')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          simulatedRole === 'siswa' 
            ? 'bg-violet-600 text-white shadow-sm scale-100' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 scale-95 hover:scale-100'
        }`}
        title="Siswa"
      >
        <Users className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Siswa</span>
      </button>
    </div>
  );
}
