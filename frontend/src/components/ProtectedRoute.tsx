import { Navigate } from 'react-router-dom';
import { useRoleSimulator, type Role } from './simulator/RoleContext';
import { useAuth } from './auth/AuthContext';

export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: Role | Role[] }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { simulatedRole } = useRoleSimulator();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(simulatedRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
