import { Navigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
        <p>Checking authorization...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
