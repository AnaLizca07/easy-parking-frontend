// src/pages/Login.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import EasyParkingLogo from '../components/common/EasyParkingLogo';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Si ya está autenticado, redirigir al home
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      throw new Error(result.error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--color-primary-900)'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: 'var(--color-primary-400)'}}></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(74, 222, 128, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.12) 0%, transparent 50%),
          linear-gradient(135deg, #166534 0%, #14532D 50%, #052E16 100%)
        `
      }}
    >
      <div className="max-w-md w-full">
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo integrado */}
          <div className="text-center">
            <EasyParkingLogo width={160} height={55} className="mx-auto" />
            <h2 className="text-2xl font-bold mt-1" style={{color: 'var(--color-text-primary)'}}>
              Iniciar Sesión
            </h2>
            <p className="mt-2" style={{color: 'var(--color-text-secondary)'}}>
              Encuentra tu parqueadero ideal
            </p>
          </div>

          <LoginForm onSubmit={handleLogin} loading={false} />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{color: 'rgba(255, 255, 255, 0.9)'}}>
            © 2025 Easy Parking. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;