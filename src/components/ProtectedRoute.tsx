import { Navigate } from 'react-router-dom';
import { useRoleSimulator, type Role } from './simulator/RoleContext';
import { useAuth } from './auth/AuthContext';

export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: Role | Role[] }) {
  const { isAuthenticated } = useAuth();
  const { simulatedRole } = useRoleSimulator();

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
