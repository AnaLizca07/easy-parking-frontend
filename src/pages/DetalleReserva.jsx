// RUTA: src/pages/DetalleReserva.jsx
// Página que muestra el detalle completo de una reserva con QR

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Clock, Car, 
  AlertCircle, CheckCircle, XCircle 
} from 'lucide-react';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import CodigoQR from '../components/reservas/CodigoQR';
import PageLayout from '../components/layout/PageLayout';
import { mockReservasService } from '../api/mockReservasService';

const DetalleReserva = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarReserva();
  }, [reservaId]);

  const cargarReserva = async () => {
    try {
      setLoading(true);
      const data = await mockReservasService.obtenerReservaPorId(reservaId);
      setReserva(data);
    } catch (err) {
      setError(err.message || 'Error al cargar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      return;
    }

    try {
      await mockReservasService.cancelarReserva(reservaId);
      await cargarReserva();
    } catch (err) {
      alert(err.message);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <AlertCircle className="w-5 h-5" />,
        label: 'Pendiente de validación'
      },
      confirmada: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Confirmada - Espacio asignado'
      },
      cancelada: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-5 h-5" />,
        label: 'Reserva cancelada'
      },
      completada: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Completada'
      }
    };

    const badge = badges[estado] || badges.pendiente;

    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${badge.bg} ${badge.text}`}>
        {badge.icon}
        <span className="font-medium">{badge.label}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Alert variant="error">
            <AlertCircle className="w-5 h-5" />
            {error || 'Reserva no encontrada'}
          </Alert>
          <Button onClick={() => navigate('/mis-reservas')} className="mt-4">
            Volver a mis reservas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PageLayout title={`Reserva #${reserva.id}`} showBackButton={true} onBackClick={() => navigate('/mis-reservas')}>
      <div className="bg-gray-50 py-8 px-4 min-h-full">
        <div className="max-w-4xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información de la reserva */}
          <div className="space-y-6">
            {/* Estado */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Reserva #{reserva.id}
                  </h1>
                  {getEstadoBadge(reserva.estado)}
                </div>
              </div>

              {/* Detalles */}
              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Parqueadero</p>
                    <p className="font-medium text-gray-900">Parqueadero Centro</p>
                    <p className="text-sm text-gray-500">Cra 14 #15-25, Armenia</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha y hora</p>
                    <p className="font-medium text-gray-900">
                      {new Date(reserva.fecha_de_reserva).toLocaleDateString('es-CO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
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
                    <p className="text-sm text-gray-600">Duración estimada</p>
                    <p className="font-medium text-gray-900">
                      {reserva.duracion_estimada} minutos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Placa del vehículo</p>
                    <p className="font-medium text-gray-900 text-lg tracking-wider">
                      {reserva.placa_vehiculo}
                    </p>
                  </div>
                </div>

                {reserva.espacio_asignado && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-gray-600 mb-1">Espacio asignado</p>
                    <p className="text-3xl font-bold text-green-600">
                      #{reserva.espacio_asignado}
                    </p>
                  </div>
                )}
              </div>

              {/* Acciones */}
              {reserva.estado === 'pendiente' && (
                <div className="mt-6">
                  <Button
                    onClick={handleCancelar}
                    variant="outline"
                    className="w-full text-red-600 hover:bg-red-50"
                  >
                    Cancelar reserva
                  </Button>
                </div>
              )}
            </div>

            {/* Instrucciones según estado */}
            {reserva.estado === 'pendiente' && (
              <Alert variant="warning">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">Reserva pendiente</p>
                  <p className="text-sm mt-1">
                    Presenta tu código al llegar al parqueadero para que sea validado y se te asigne un espacio.
                  </p>
                </div>
              </Alert>
            )}

            {reserva.estado === 'confirmada' && (
              <Alert variant="success">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">Reserva confirmada</p>
                  <p className="text-sm mt-1">
                    Tu espacio está listo. Dirígete al espacio #{reserva.espacio_asignado}.
                  </p>
                </div>
              </Alert>
            )}
          </div>

          {/* Código QR */}
          {(reserva.estado === 'pendiente' || reserva.estado === 'confirmada') && (
            <div>
              <CodigoQR codigo={reserva.codigo} reservaId={reserva.id} />
            </div>
          )}
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DetalleReserva;