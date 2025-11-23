// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-warning-quindio/20 rounded-full mb-6">
          <span className="text-6xl">🚗</span>
        </div>
        <h1 className="text-6xl font-bold text-text-dark mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-dark mb-4">
          Página no encontrada
        </h2>
        <p className="text-text-secondary mb-8 max-w-md">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link to="/">
          <Button variant="primary">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;