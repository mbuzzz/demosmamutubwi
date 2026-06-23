import { Navigate } from 'react-router-dom';
import { useRoleSimulator } from './simulator/RoleContext';

export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { simulatedRole } = useRoleSimulator();
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && simulatedRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
