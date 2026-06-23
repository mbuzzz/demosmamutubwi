import { Navigate } from 'react-router-dom';
import { useRoleSimulator } from './simulator/RoleContext';
import { useAuth } from './auth/AuthContext';

export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { isAuthenticated } = useAuth();
  const { simulatedRole } = useRoleSimulator();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && simulatedRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
