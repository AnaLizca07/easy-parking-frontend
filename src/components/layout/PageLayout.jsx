import GlobalNavigation from '../navigation/GlobalNavigation';
import { useAuth } from '../../hooks/useAuth';

const PageLayout = ({ children, title, showBackButton = false, onBackClick }) => {
  const { user } = useAuth();

  return (
    <div className="h-screen w-screen flex flex-col bg-primary-white overflow-hidden">
      {/* Header con navegación */}
      <div className="w-full bg-text-dark px-4 py-3 flex items-center gap-2">
        {/* Navegación global */}
        <GlobalNavigation />

        {/* Título de la página */}
        {title && (
          <div className="flex-1 flex items-center justify-center">
            <h1
              className="text-white font-bold text-xl px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'rgba(22, 163, 74, 0.3)' }}
            >
              {title}
            </h1>
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