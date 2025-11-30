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

        {/* Título de la página */}
        {title && (
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-text-dark font-semibold text-xl">
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