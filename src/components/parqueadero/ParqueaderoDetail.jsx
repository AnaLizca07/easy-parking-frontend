// RUTA: src/components/parqueadero/ParqueaderoDetail.jsx
// Componente que muestra los detalles de un parqueadero

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, DollarSign, Car, Shield, Zap, 
  Accessibility, X, Calendar, ArrowLeft 
} from 'lucide-react';
import Button from '../common/Button';
import Spinner from '../common/Spinner';

const ParqueaderoDetail = ({ parqueaderoId, onClose }) => {
  const [parqueadero, setParqueadero] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarParqueadero();
  }, [parqueaderoId]);

  const cargarParqueadero = async () => {
    try {
      setLoading(true);
      // Aquí se conectaría con el servicio mock
      // Por ahora simulo un parqueadero
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setParqueadero({
        id: parqueaderoId,
        nombre: 'Parqueadero Centro',
        direccion: 'Cra 14 #15-25, Armenia',
        coordenadas: '4.5389,-75.6811',
        horario_apertura: '06:00',
        horario_cierre: '22:00',
        total_spaces: 50,
        espacios_disponibles: 15,
        precio_hora: 3000,
        precio_mensualidad: 90000,
        tipo: 'Cubierto',
        caracteristicas: ['Seguridad 24/7', 'Acceso para Discapacitados'],
        distancia: 0.5
      });
    } catch (error) {
      console.error('Error al cargar parqueadero:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconoCaracteristica = (caracteristica) => {
    if (caracteristica.includes('Seguridad')) return <Shield className="w-5 h-5" />;
    if (caracteristica.includes('Carga')) return <Zap className="w-5 h-5" />;
    if (caracteristica.includes('Discapacitados')) return <Accessibility className="w-5 h-5" />;
    return <Shield className="w-5 h-5" />;
  };

  const getColorDisponibilidad = () => {
    if (!parqueadero) return 'bg-gray-400';
    if (parqueadero.espacios_disponibles === 0) return 'bg-gray-400';
    if (parqueadero.espacios_disponibles <= 5) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  const handleReservar = () => {
    navigate(`/reservar/${parqueaderoId}`);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!parqueadero) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{parqueadero.nombre}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Disponibilidad */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Disponibilidad</p>
              <p className="text-2xl font-bold text-gray-900">
                {parqueadero.espacios_disponibles} / {parqueadero.total_spaces}
              </p>
              <p className="text-sm text-gray-500">espacios disponibles</p>
            </div>
            <div className={`w-16 h-16 rounded-full ${getColorDisponibilidad()} flex items-center justify-center`}>
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Información básica */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Dirección</p>
                <p className="text-gray-600">{parqueadero.direccion}</p>
                <p className="text-sm text-blue-600 mt-1">
                  A {parqueadero.distancia} km de tu ubicación
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Horario</p>
                <p className="text-gray-600">
                  {parqueadero.horario_apertura} - {parqueadero.horario_cierre}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Tarifas</p>
                <p className="text-gray-600">
                  ${parqueadero.precio_hora.toLocaleString()} / hora
                </p>
                {parqueadero.precio_mensualidad && (
                  <p className="text-gray-600">
                    ${parqueadero.precio_mensualidad.toLocaleString()} / mes
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tipo de espacio */}
          <div>
            <p className="font-medium text-gray-900 mb-2">Tipo de espacio</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {parqueadero.tipo}
            </span>
          </div>

          {/* Características */}
          {parqueadero.caracteristicas.length > 0 && (
            <div>
              <p className="font-medium text-gray-900 mb-3">Características</p>
              <div className="grid grid-cols-1 gap-2">
                {parqueadero.caracteristicas.map((caracteristica, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    {getIconoCaracteristica(caracteristica)}
                    <span className="text-gray-700">{caracteristica}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <Button
            onClick={handleReservar}
            disabled={parqueadero.espacios_disponibles === 0}
            className="w-full"
            size="lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {parqueadero.espacios_disponibles === 0 ? 'Sin espacios disponibles' : 'Reservar ahora'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParqueaderoDetail;