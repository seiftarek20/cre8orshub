import { Link } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function RoleRoute({ allowedRoles = [], children }) {
  const { profile, isLoading } = useAuth();

  return (
    <ProtectedRoute>
      {isLoading ? null : allowedRoles.includes(profile?.role) ? children : (
        <section className="section-block page-top auth-page">
          <div className="auth-card reveal show">
            <p className="eyebrow">Access Limited</p>
            <h1>Admin access is not available.</h1>
            <p>Your profile does not have permission to open this workspace.</p>
            <Link className="btn btn-primary" to="/dashboard">
              Back to Dashboard
            </Link>
          </div>
        </section>
      )}
    </ProtectedRoute>
  );
}
