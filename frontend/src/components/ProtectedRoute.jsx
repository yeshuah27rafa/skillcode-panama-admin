// ============================================================
// components/ProtectedRoute.jsx — exige sesión activa
// ============================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p className="loading-dots">cargando sesión...</p>;
  }

  if (user === null) {
    return <Navigate to="/ingresar" state={{ from: location.pathname }} replace />;
  }

  return children;
}
