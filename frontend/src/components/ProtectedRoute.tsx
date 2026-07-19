import { Navigate } from 'react-router-dom';
import { useAuth, getUserRoles } from './auth/AuthContext';
import { useRoleSimulator, type Role } from './simulator/RoleContext';

/**
 * Proteksi rute berdasarkan role aktif (simulatedRole).
 *
 * - Superadmin / admin: boleh "View As" ke role mana pun.
 * - Multi-role staf: hanya boleh switch di antara role miliknya; menu & route mengikuti role aktif.
 * - Single role: role aktif = role utama.
 */
export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string | string[];
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { simulatedRole } = useRoleSimulator();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRoles = getUserRoles(user);
    const isElevated = userRoles.includes('superadmin') || userRoles.includes('admin');

    let activeRole: Role = simulatedRole;
    if (!isElevated && !userRoles.includes(simulatedRole)) {
      activeRole = (user.role as Role) || 'siswa';
    }

    if (!allowed.includes(activeRole)) {
      // Superadmin yang view-as tetap dibatasi ke active role (simulasi sengaja)
      // User multi-role yang salah mode: arahkan ke portal default mereka
      if (userRoles.includes('superadmin') || userRoles.includes('admin')) {
        return <Navigate to="/panel" replace />;
      }
      if (userRoles.some((r) => ['guru', 'walikelas', 'kepala_sekolah', 'kurikulum'].includes(r))) {
        return <Navigate to="/panel/guru" replace />;
      }
      if (userRoles.includes('bendahara')) {
        return <Navigate to="/panel/bendahara" replace />;
      }
      if (userRoles.includes('siswa') || userRoles.includes('orang_tua')) {
        return <Navigate to="/panel/siswa" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
