// src/pages/Register.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';
import EasyParkingLogo from '../components/common/EasyParkingLogo';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Si ya está autenticado, redirigir al home
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (userData) => {
    const result = await register(userData);
    
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      throw new Error(result.error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: 'var(--color-background)'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: 'var(--color-primary-600)'}}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12" style={{background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-900))'}}>
      <div className="max-w-md w-full">
        {/* Card de Register */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo integrado */}
          <div className="text-center">
            <EasyParkingLogo width={280} height={224} className="mx-auto" />
            <h2 className="text-2xl font-bold mt-1" style={{color: 'var(--color-text-primary)'}}>
              Crear Cuenta
            </h2>
            <p className="mt-2" style={{color: 'var(--color-text-secondary)'}}>
              Únete a Easy Parking hoy
            </p>
          </div>

          <RegisterForm onSubmit={handleRegister} loading={false} />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{color: 'rgba(255, 255, 255, 0.8)'}}>
            © 2025 Easy Parking. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;