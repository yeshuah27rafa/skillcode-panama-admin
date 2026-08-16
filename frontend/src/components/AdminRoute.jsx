// ============================================================
// components/AdminRoute.jsx — exige sesión activa y rol admin
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p className="loading-dots">cargando sesión...</p>;
  }

  if (user === null || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
