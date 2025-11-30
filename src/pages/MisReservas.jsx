// RUTA: src/pages/MisReservas.jsx
// Página que muestra las reservas del usuario

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Car, CheckCircle, 
  XCircle, AlertCircle, ChevronRight, QrCode 
} from 'lucide-react';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import PageLayout from '../components/layout/PageLayout';
import { mockReservasService } from '../api/mockReservasService';
import { useAuth } from '../hooks/useAuth';

const MisReservas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');

  useEffect(() => {
    cargarReservas();

    // Recargar reservas cuando la página gane foco
    const handleFocus = () => {
      cargarReservas();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await mockReservasService.listarReservasPorUsuario(user.id);
      setReservas(data);
    } catch (err) {
      setError('Error al cargar las reservas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (reservaId) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      return;
    }

    try {
      await mockReservasService.cancelarReserva(reservaId);
      await cargarReservas();
    } catch (err) {
      alert(err.message);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'Pendiente'
      },
      confirmada: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Confirmada'
      },
      cancelada: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Cancelada'
      },
      completada: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Completada'
      }
    };

    const badge = badges[estado] || badges.pendiente;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const reservasFiltradas = reservas.filter(reserva => {
    if (filtroEstado === 'todas') return true;
    return reserva.estado === filtroEstado;
  });

  if (loading) {
    return (
      <PageLayout title="Mis Reservas">
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Mis Reservas">
      <div className="bg-gray-50 py-8 px-4 min-h-full">
        <div className="max-w-4xl mx-auto">

        {error && (
          <Alert variant="error" className="mb-6">
            <AlertCircle className="w-5 h-5" />
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroEstado('todas')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroEstado === 'todas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({reservas.length})
            </button>
            <button
              onClick={() => setFiltroEstado('pendiente')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroEstado === 'pendiente'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendientes ({reservas.filter(r => r.estado === 'pendiente').length})
            </button>
            <button
              onClick={() => setFiltroEstado('confirmada')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroEstado === 'confirmada'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmadas ({reservas.filter(r => r.estado === 'confirmada').length})
            </button>
          </div>
        </div>

        {/* Lista de reservas */}
        {reservasFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No tienes reservas
            </h3>
            <p className="text-gray-600 mb-6">
              {filtroEstado === 'todas' 
                ? 'Aún no has creado ninguna reserva'
                : `No tienes reservas ${filtroEstado}s`
              }
            </p>
            <Button onClick={() => navigate('/')}>
              Buscar parqueadero
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservasFiltradas.map((reserva) => (
              <div
                key={reserva.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
              >
                {/* Estado */}
                <div className="flex items-start justify-between mb-4">
                  {getEstadoBadge(reserva.estado)}
                  <span className="text-sm text-gray-500">
                    Reserva #{reserva.id}
                  </span>
                </div>

                {/* Código de reserva */}
                {reserva.codigo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Código de acceso</p>
                        <p className="text-2xl font-bold text-blue-600 tracking-widest">
                          {reserva.codigo}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/mis-reservas/${reserva.id}`)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition"
                      >
                        <QrCode className="w-8 h-8 text-blue-600" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Información */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Parqueadero Centro</p>
                      <p className="text-sm text-gray-600">Cra 14 #15-25, Armenia</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(reserva.fecha_de_reserva).toLocaleDateString('es-CO', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(reserva.fecha_de_reserva).toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Duración: {reserva.duracion_estimada} minutos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Car className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Placa: {reserva.placa_vehiculo}
                      </p>
                    </div>
                  </div>

                  {reserva.espacio_asignado && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Espacio asignado</p>
                      <p className="text-xl font-bold text-green-600">
                        #{reserva.espacio_asignado}
                      </p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/mis-reservas/${reserva.id}`)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Ver detalles
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  
                  {reserva.estado === 'pendiente' && (
                    <Button
                      onClick={() => handleCancelar(reserva.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </PageLayout>
  );
};

export default MisReservas;