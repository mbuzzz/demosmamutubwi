import { Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { useRoleSimulator } from './simulator/RoleContext';

export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string | string[] }) {
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
    const roleToCheck = (user.role === 'superadmin' || user.role === 'admin') ? simulatedRole : (user.role as any);
    if (!allowed.includes(roleToCheck)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
