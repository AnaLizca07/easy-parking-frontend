// src/pages/Register.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';

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
      <div className="min-h-screen flex items-center justify-center bg-secondary-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success-quindio"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-success-quindio to-green-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-warning-quindio rounded-full mb-4">
            <svg className="w-8 h-8 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Easy Parking
          </h1>
          <p className="text-green-100">
            Armenia, Quindío
          </p>
        </div>

        {/* Card de Register */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-dark text-center">
              Crear Cuenta
            </h2>
            <p className="text-text-secondary text-center mt-2">
              Únete a Easy Parking hoy
            </p>
          </div>

          <RegisterForm onSubmit={handleRegister} loading={false} />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-green-100">
            © 2025 Easy Parking. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;