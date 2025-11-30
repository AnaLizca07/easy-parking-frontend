// RUTA: src/pages/admin/ValidarReserva.jsx
// Página para validar reservas ingresando código

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, CheckCircle, XCircle, AlertCircle, 
  ArrowLeft, Search, Car, MapPin, Calendar, Clock 
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import PageLayout from '../../components/layout/PageLayout';
import { mockReservasService } from '../../api/mockReservasService';

const ValidarReserva = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reserva, setReserva] = useState(null);
  const [validada, setValidada] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      setError('Por favor ingresa un código de reserva');
      return;
    }

    setError('');
    setLoading(true);
    setReserva(null);
    setValidada(false);

    try {
      const data = await mockReservasService.buscarReservaPorCodigo(codigo);
      setReserva(data);
    } catch (err) {
      setError(err.message || 'Código de reserva no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleValidar = async () => {
    setLoading(true);
    setError('');

    try {
      const reservaValidada = await mockReservasService.validarReserva(codigo);
      setReserva(reservaValidada);
      setValidada(true);
    } catch (err) {
      setError(err.message || 'Error al validar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaBusqueda = () => {
    setCodigo('');
    setReserva(null);
    setValidada(false);
    setError('');
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <AlertCircle className="w-5 h-5" />,
        label: 'Pendiente'
      },
      confirmada: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Confirmada'
      },
      cancelada: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-5 h-5" />,
        label: 'Cancelada'
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
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${badge.bg} ${badge.text}`}>
        {badge.icon}
        <span className="font-medium">{badge.label}</span>
      </div>
    );
  };

  return (
    <PageLayout title="Validar Reserva" showBackButton={true} onBackClick={() => navigate('/admin')}>
      <div className="bg-gray-50 py-8 px-4 min-h-full">
        <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Título */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <QrCode className="w-7 h-7" />
              Validar Reserva
            </h1>
            <p className="text-blue-100 mt-1">
              Ingresa el código de reserva para validar el acceso
            </p>
          </div>

          {/* Buscador */}
          <div className="p-6 border-b">
            <form onSubmit={handleBuscar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Reserva
                </label>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    placeholder="Ej: A1B2C3"
                    maxLength="6"
                    className="flex-1 text-center text-2xl font-bold tracking-widest uppercase"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !codigo.trim()}
                    className="px-8"
                  >
                    {loading ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Ingresa el código de 6 caracteres proporcionado al cliente
                </p>
              </div>

              {error && (
                <Alert variant="error">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </Alert>
              )}
            </form>
          </div>

          {/* Resultado de la búsqueda */}
          {reserva && (
            <div className="p-6 space-y-6">
              {/* Estado */}
              <div className="flex items-center justify-between">
                {getEstadoBadge(reserva.estado)}
                <span className="text-sm text-gray-500">
                  ID: #{reserva.id}
                </span>
              </div>

              {/* Validación exitosa */}
              {validada && (
                <Alert variant="success">
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <p className="font-medium">¡Reserva validada exitosamente!</p>
                    <p className="text-sm mt-1">
                      Espacio asignado: <strong>#{reserva.espacio_asignado}</strong>
                    </p>
                  </div>
                </Alert>
              )}

              {/* Información de la reserva */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-medium text-gray-900 text-lg mb-3">
                  Información de la Reserva
                </h3>

                <div className="space-y-3">
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
                      <p className="text-sm text-gray-600">Fecha de reserva</p>
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
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-3">
                {reserva.estado === 'pendiente' && !validada && (
                  <Button
                    onClick={handleValidar}
                    disabled={loading}
                    size="lg"
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Validando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Validar y Asignar Espacio
                      </>
                    )}
                  </Button>
                )}

                <Button
                  onClick={handleNuevaBusqueda}
                  variant="outline"
                  className="w-full"
                >
                  Validar otra reserva
                </Button>
              </div>

              {/* Advertencias según estado */}
              {reserva.estado === 'confirmada' && !validada && (
                <Alert variant="warning">
                  <AlertCircle className="w-5 h-5" />
                  Esta reserva ya fue confirmada anteriormente
                </Alert>
              )}

              {reserva.estado === 'cancelada' && (
                <Alert variant="error">
                  <XCircle className="w-5 h-5" />
                  Esta reserva fue cancelada y no puede ser validada
                </Alert>
              )}

              {reserva.estado === 'completada' && (
                <Alert variant="info">
                  <CheckCircle className="w-5 h-5" />
                  Esta reserva ya fue completada
                </Alert>
              )}
            </div>
          )}

          {/* Instrucciones iniciales */}
          {!reserva && !loading && !error && (
            <div className="p-12 text-center">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Esperando código de reserva
              </h3>
              <p className="text-gray-600">
                Ingresa el código de 6 caracteres que el cliente te proporcione
              </p>
            </div>
          )}
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ValidarReserva;