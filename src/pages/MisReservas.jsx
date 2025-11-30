// RUTA: src/pages/MisReservas.jsx
// Página que muestra las reservas del usuario

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Car, CheckCircle,
  XCircle, AlertCircle, ChevronRight, QrCode, X
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
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerDetalles = (reserva) => {
    setSelectedReserva(reserva);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReserva(null);
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
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Completada'
      }
    };

    const badge = badges[estado] || badges.pendiente;

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${badge.bg} ${badge.text}`}>
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
      <div className="bg-gray-50 py-6 px-4 min-h-full">
        <div className="max-w-5xl mx-auto">

        {error && (
          <Alert variant="error" className="mb-6">
            <AlertCircle className="w-5 h-5" />
            {error}
          </Alert>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrar reservas</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFiltroEstado('todas')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                filtroEstado === 'todas'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              Todas ({reservas.length})
            </button>
            <button
              onClick={() => setFiltroEstado('pendiente')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                filtroEstado === 'pendiente'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              Pendientes ({reservas.filter(r => r.estado === 'pendiente').length})
            </button>
            <button
              onClick={() => setFiltroEstado('confirmada')}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                filtroEstado === 'confirmada'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              Confirmadas ({reservas.filter(r => r.estado === 'confirmada').length})
            </button>
          </div>
        </div>

        {/* Lista de reservas */}
        {reservasFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="bg-gray-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No tienes reservas
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              {filtroEstado === 'todas'
                ? 'Aún no has creado ninguna reserva'
                : `No tienes reservas ${filtroEstado}s`
              }
            </p>
            <Button onClick={() => navigate('/')} size="lg">
              Buscar parqueadero
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {reservasFiltradas.map((reserva) => (
              <div
                key={reserva.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300"
              >
                {/* Header con estado y número */}
                <div className="flex items-center justify-between mb-4">
                  {getEstadoBadge(reserva.estado)}
                  <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full font-medium">
                    Reserva #{reserva.id}
                  </span>
                </div>

                {/* Información principal */}
                <div className="space-y-4">
                  {/* Código de acceso */}
                  {reserva.codigo && (
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1 font-medium">Código de acceso</p>
                      <p className="text-2xl font-bold text-primary-700 tracking-[0.2em] font-mono">
                        {reserva.codigo}
                      </p>
                    </div>
                  )}

                  {/* Fecha y hora */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="bg-info-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-info-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 capitalize">
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

                  {/* Botón ver detalles */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() => handleVerDetalles(reserva)}
                      variant="outline"
                      size="sm"
                      className="w-full hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 group"
                    >
                      Ver detalles
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de detalles */}
        {showModal && selectedReserva && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header del modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Detalles de Reserva</h2>
                  <p className="text-sm text-gray-500">Reserva #{selectedReserva.id}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="p-6 space-y-6">
                {/* Estado */}
                <div className="flex justify-center">
                  {getEstadoBadge(selectedReserva.estado)}
                </div>

                {/* Código QR */}
                {selectedReserva.codigo && (
                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <QrCode className="w-12 h-12 text-primary-600" />
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Código de acceso</p>
                        <p className="text-3xl font-bold text-primary-700 tracking-[0.3em] font-mono">
                          {selectedReserva.codigo}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Presenta este código en la entrada del parqueadero</p>
                  </div>
                )}

                {/* Información detallada */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la reserva</h3>

                  <div className="grid gap-4">
                    {/* Ubicación */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Parqueadero Centro</p>
                        <p className="text-sm text-gray-600">Cra 14 #15-25, Armenia</p>
                      </div>
                    </div>

                    {/* Fecha y hora */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="bg-info-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-info-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">
                          {new Date(selectedReserva.fecha_de_reserva).toLocaleDateString('es-CO', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedReserva.fecha_de_reserva).toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Duración */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="bg-warning-100 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-warning-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Duración: {selectedReserva.duracion_estimada} minutos
                        </p>
                      </div>
                    </div>

                    {/* Vehículo */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="bg-gray-200 p-2 rounded-lg">
                        <Car className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Placa: <span className="font-mono text-lg">{selectedReserva.placa_vehiculo}</span>
                        </p>
                      </div>
                    </div>

                    {/* Espacio asignado */}
                    {selectedReserva.espacio_asignado && (
                      <div className="bg-success-50 border border-success-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-success-200 p-2 rounded-lg">
                            <Car className="w-5 h-5 text-success-700" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Espacio asignado</p>
                            <p className="text-2xl font-bold text-success-700">#{selectedReserva.espacio_asignado}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones del modal */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {selectedReserva.estado === 'pendiente' && (
                    <Button
                      onClick={() => handleCancelar(selectedReserva.id)}
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                    >
                      Cancelar reserva
                    </Button>
                  )}
                  <Button
                    onClick={handleCloseModal}
                    variant="outline"
                    className="ml-auto"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </PageLayout>
  );
};

export default MisReservas;