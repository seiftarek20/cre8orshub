import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function RoleRoute({ allowedRoles = [], children }) {
  const { profile, isLoading } = useAuth();

  return (
    <ProtectedRoute>
      {isLoading ? null : allowedRoles.includes(profile?.role) ? children : <Navigate to="/dashboard" replace />}
    </ProtectedRoute>
  );
}
