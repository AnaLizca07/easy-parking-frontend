// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../common/Spinner';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-white">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirigir administradores al panel de control si están en la ruta raíz
  if (user?.tipo_usuario === 'admin' && location.pathname === '/') {
    return <Navigate to="/admin" replace />;
  }

  // Verificar rol si es requerido
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-dark mb-4">
            Acceso Denegado
          </h2>
          <p className="text-text-secondary">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;