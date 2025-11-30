// src/pages/Login.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import EasyParkingLogo from '../components/common/EasyParkingLogo';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const infoButtonRef = useRef(null); 
  const popoverRef = useRef(null); 

  useEffect(() => {
    // Si ya está autenticado, redirigir al home
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Manejador para cerrar el popover al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el modal está visible Y el clic no fue dentro del botón de información Y no fue dentro del popover
      if (
        showInfoModal && 
        infoButtonRef.current && 
        !infoButtonRef.current.contains(event.target) && 
        popoverRef.current && 
        !popoverRef.current.contains(event.target)
      ) {
        setShowInfoModal(false);
      }
    };

    // Agregar el listener de evento al montar
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar el listener al desmontar
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfoModal]);


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
          {/* Logo integrado (Contenedor relativo para posicionar el popover) */}
          <div className="text-center relative">
            {/* Ícono de información */}
            <button
              ref={infoButtonRef} 
              onClick={() => setShowInfoModal(!showInfoModal)} 
              className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 z-20" 
              title="Información sobre Easy Parking"
            >
              <svg
                className="w-5 h-5"
                style={{color: 'var(--color-primary-600)'}}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </button>

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

      {/* Popover informativo (NO Modal) */}
      {showInfoModal && (
        <div 
          ref={popoverRef} 
          className="absolute bg-white rounded-lg shadow-xl p-4 w-64 z-30
                     transform transition-opacity duration-200 ease-out 
                     opacity-100"
          style={{ 
            top: '120px',      // Posiciona más cerca de la parte superior
            left: '50%',      // Inicia en el centro horizontal del padre relativo
            transform: 'translateX(-50%)', // Mueve a la izquierda la mitad de su propio ancho (centrado)
          }}
        >
            {/* Contenido del popover */}
            <div className="relative">
                {/* Botón de cerrar */}
                <button
                    onClick={() => setShowInfoModal(false)}
                    className="absolute top-[-8px] right-[-8px] text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0" style={{backgroundColor: 'var(--color-primary-100)'}}>
                      <svg className="w-4 h-4" style={{color: 'var(--color-primary-600)'}} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold" style={{color: 'var(--color-text-primary)'}}>
                      ¿Qué es Easy Parking?
                    </h3>
                </div>

                <div className="space-y-3">
                  <p className="text-xs leading-relaxed" style={{color: 'var(--color-text-secondary)'}}>
                    <strong>Easy Parking</strong> es la solución más inteligente para encontrar y reservar espacios de parqueadero en tu ciudad.
                  </p>

                  <div className="space-y-2">
                    {/* Lista de beneficios simplificada */}
                    <div className="flex items-start space-x-1">
                      <svg className="w-3 h-3 mt-0.5 flex-shrink-0" style={{color: 'var(--color-primary-600)'}} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs" style={{color: 'var(--color-text-secondary)'}}>
                        Busca y reserva en tiempo real.
                      </span>
                    </div>

                    <div className="flex items-start space-x-1">
                      <svg className="w-3 h-3 mt-0.5 flex-shrink-0" style={{color: 'var(--color-primary-600)'}} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs" style={{color: 'var(--color-text-secondary)'}}>
                        Compara precios y ubicaciones.
                      </span>
                    </div>

                    <div className="flex items-start space-x-1">
                      <svg className="w-3 h-3 mt-0.5 flex-shrink-0" style={{color: 'var(--color-primary-600)'}} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs" style={{color: 'var(--color-text-secondary)'}}>
                        Ahorra tiempo y gestiona reservas.
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-[10px] text-center" style={{color: 'var(--color-text-secondary)'}}>
                      ¡Regístrate y aparca de manera inteligente!
                    </p>
                  </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Login;