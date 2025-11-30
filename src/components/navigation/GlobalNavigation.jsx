import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const GlobalNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Prevenir scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      {/* Botón de menú hamburguesa */}
      <button
        onClick={toggleMenu}
        className="bg-text-secondary rounded-lg p-3 hover:bg-opacity-80 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5 text-primary-white" />
      </button>

      {/* Área invisible para detectar clics fuera del drawer */}
      {isMenuOpen && (
        <div
          className="fixed top-0 left-80 right-0 bottom-0 z-[1500]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Drawer menu deslizante */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-[2000] transform transition-transform duration-300 ease-in-out flex flex-col ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header del drawer - clickeable para ir al perfil */}
        <button
          onClick={() => handleMenuNavigation('/perfil')}
          className="flex-shrink-0 w-full bg-gray-800 p-4 text-white hover:bg-opacity-90 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{user?.nombre || 'Usuario'}</h3>
              <p className="text-gray-300 text-xs">{user?.tipo_usuario === 'admin' ? 'Administrador' : 'Cliente'}</p>
            </div>
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Navegación - Con scroll */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Opciones para clientes únicamente */}
          {user?.tipo_usuario !== 'admin' && (
            <>
              <button
                onClick={() => handleMenuNavigation('/')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-gray-800 font-medium">Home</span>
              </button>

              <button
                onClick={() => handleMenuNavigation('/mis-reservas')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-gray-800 font-medium">Mis Reservas</span>
              </button>

              <button
                onClick={() => handleMenuNavigation('/reserva/seleccionar')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-gray-800 font-medium">Crear Reserva</span>
              </button>
            </>
          )}

          {/* Sección Administración */}
          {user?.tipo_usuario === 'admin' && (
            <>
              {/* Separador para admin */}
              <div className="px-4 py-3 mt-2">
                <div className="border-t border-gray-200"></div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1">
                  Administración
                </p>
              </div>

              {/* Panel de Admin */}
              <button
                onClick={() => handleMenuNavigation('/admin')}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-blue-800 font-medium">Panel de Control</span>
              </button>

              {/* Crear Parqueadero */}
              <button
                onClick={() => handleMenuNavigation('/admin/parqueaderos/nuevo')}
                className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-green-800 font-medium">Crear Parqueadero</span>
              </button>

              {/* Gestionar Parqueaderos */}
              <button
                onClick={() => handleMenuNavigation('/admin/parqueaderos')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-gray-800 font-medium">Gestionar Parqueaderos</span>
              </button>

              {/* Validar Reserva */}
              <button
                onClick={() => handleMenuNavigation('/admin/validar-reserva')}
                className="w-full text-left px-4 py-3 hover:bg-yellow-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-yellow-800 font-medium">Validar Reserva</span>
              </button>

              {/* Ver Reservas */}
              <button
                onClick={() => handleMenuNavigation('/admin/reservas')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-gray-800 font-medium">Ver Reservas</span>
              </button>

              {/* Configurar Tarifas */}
              <button
                onClick={() => handleMenuNavigation('/admin/tarifas')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-800 font-medium">Configurar Tarifas</span>
              </button>

              {/* Ver Reportes */}
              <button
                onClick={() => handleMenuNavigation('/admin/reportes')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-gray-800 font-medium">Ver Reportes</span>
              </button>
            </>
          )}
        </div>

        {/* Sección inferior con cerrar sesión */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-red-600 font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default GlobalNavigation;