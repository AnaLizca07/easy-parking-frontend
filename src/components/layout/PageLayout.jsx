import GlobalNavigation from '../navigation/GlobalNavigation';
import { useAuth } from '../../hooks/useAuth';
import EasyParkingLogo from '../common/EasyParkingLogo';

const PageLayout = ({ children, title, showBackButton = false, onBackClick }) => {
  const { user } = useAuth();

  return (
    <div className="h-screen w-screen flex flex-col bg-primary-white overflow-hidden">
      {/* Header con navegación */}
      <div className="w-full bg-text-dark px-4 py-3 flex items-center gap-4">
        {/* Navegación global */}
        <GlobalNavigation />

        {/* Logo */}
        <div className="flex-shrink-0">
          <EasyParkingLogo width={160} height={55} />
        </div>

        {/* Título de la página - Versión mejorada */}
        {title && (
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              {/* Glow effect sutil */}
              <div className="absolute inset-0 bg-primary-500 blur-xl opacity-30 rounded-lg"></div>
              
              {/* Título con mejor contraste y diseño */}
              <h1 className="relative text-white font-bold text-xl px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg border border-primary-400/20">
                {title}
              </h1>
            </div>
          </div>
        )}

        {/* Espaciador cuando no hay botón de retroceso */}
        {!showBackButton && (
          <div className="w-4"></div>
        )}
      </div>

      {/* Contenido de la página */}
      <div className="flex-1 relative overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;