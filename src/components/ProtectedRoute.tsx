import { Navigate } from 'react-router-dom';

// TODO: Replace with actual auth context check
export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  // Temporary: always allow access for development
  const isAuthenticated = true;
  const userRole = 'superadmin';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />; // Or to a 403 page
  }

  return <>{children}</>;
}
