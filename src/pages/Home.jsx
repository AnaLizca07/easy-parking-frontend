// src/pages/Home.jsx
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const Home = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-secondary-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-dark">
                Bienvenido, {user?.name}
              </h1>
              <p className="text-text-secondary mt-1">
                {user?.email} - {user?.role}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>

          <div className="bg-success-quindio/10 border border-success-quindio rounded-lg p-6">
            <h2 className="text-xl font-semibold text-success-quindio mb-2">
              ¡Sistema de autenticación funcionando!
            </h2>
            <p className="text-text-secondary">
              El login y registro están operativos. Próximo paso: implementar el mapa y búsqueda de parqueaderos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;