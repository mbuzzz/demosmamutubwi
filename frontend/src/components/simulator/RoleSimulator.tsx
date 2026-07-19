import { Eye, Shield, BookOpen, Crown, Users, Wallet, GraduationCap, Settings2 } from 'lucide-react';
import { useRoleSimulator, type Role } from './RoleContext';
import { useAuth, getUserRoles } from '../auth/AuthContext';

const ROLE_META: Record<
  string,
  { label: string; short: string; color: string; Icon: typeof Shield }
> = {
  superadmin: { label: 'Superadmin', short: 'Admin', color: 'bg-indigo-600', Icon: Shield },
  admin: { label: 'Admin / TU', short: 'Admin', color: 'bg-slate-600', Icon: Settings2 },
  guru: { label: 'Guru Mapel', short: 'Guru', color: 'bg-emerald-600', Icon: BookOpen },
  walikelas: { label: 'Wali Kelas', short: 'Wali', color: 'bg-amber-500', Icon: Crown },
  kepala_sekolah: { label: 'Kepala Sekolah', short: 'Kepsek', color: 'bg-blue-600', Icon: GraduationCap },
  kurikulum: { label: 'Kurikulum', short: 'Kurikulum', color: 'bg-purple-600', Icon: BookOpen },
  bendahara: { label: 'Bendahara', short: 'Bendahara', color: 'bg-teal-600', Icon: Wallet },
  siswa: { label: 'Siswa', short: 'Siswa', color: 'bg-violet-600', Icon: Users },
  orang_tua: { label: 'Orang Tua', short: 'Wali', color: 'bg-pink-600', Icon: Users },
};

/** Role yang bisa dipilih superadmin untuk View As */
const SIMULATOR_ROLES: Role[] = ['superadmin', 'guru', 'walikelas', 'siswa'];

/**
 * Switcher role:
 * - Superadmin/admin: full "View As" simulator
 * - Multi-role staf: hanya role miliknya ("Mode Akses")
 * - Single role: disembunyikan
 */
export default function RoleSimulator() {
  const { simulatedRole, setSimulatedRole } = useRoleSimulator();
  const { user } = useAuth();

  if (!user) return null;

  const userRoles = getUserRoles(user);
  const isElevated = userRoles.includes('superadmin') || userRoles.includes('admin');

  // Superadmin: simulator penuh
  if (isElevated) {
    return (
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-inner">
        <div className="pl-3 pr-2 flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest hidden lg:flex">
          <Eye className="w-3.5 h-3.5" /> View As:
        </div>
        {SIMULATOR_ROLES.map((role) => {
          const meta = ROLE_META[role];
          const Icon = meta.Icon;
          const active = simulatedRole === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setSimulatedRole(role)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                active
                  ? `${meta.color} text-white shadow-sm scale-100`
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 scale-95 hover:scale-100'
              }`}
              title={meta.label}
            >
              <Icon className="w-3.5 h-3.5" />{' '}
              <span className="hidden sm:inline">{meta.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Multi-role staf: switcher hanya role miliknya
  if (userRoles.length <= 1) {
    return null;
  }

  const switchable = userRoles.filter((r) => r in ROLE_META) as Role[];

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-inner max-w-full overflow-x-auto">
      <div className="pl-3 pr-2 flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest hidden lg:flex shrink-0">
        <Eye className="w-3.5 h-3.5" /> Mode:
      </div>
      {switchable.map((role) => {
        const meta = ROLE_META[role];
        const Icon = meta.Icon;
        const active = simulatedRole === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => setSimulatedRole(role)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              active
                ? `${meta.color} text-white shadow-sm scale-100`
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 scale-95 hover:scale-100'
            }`}
            title={meta.label}
          >
            <Icon className="w-3.5 h-3.5" />{' '}
            <span className="hidden sm:inline">{meta.short}</span>
          </button>
        );
      })}
    </div>
  );
}
