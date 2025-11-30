// ReservaDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Car,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Navigation,
  Phone,
  Edit,
} from 'lucide-react';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import CodigoQR from '../components/reservas/CodigoQR';
import { getReservaById, cancelarReserva } from '../api/mockReservasService';
import { format, formatDistanceToNow, isBefore, isPast, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';

const ReservaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelando, setCancelando] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const nuevaReserva = location.state?.nuevaReserva;

  useEffect(() => {
    const fetchReserva = async () => {
      try {
        setLoading(true);
        const data = await getReservaById(id);
        
        if (!data) {
          throw new Error('Reserva no encontrada');
        }
        
        setReserva(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReserva();
  }, [id]);

  const handleCancelar = async () => {
    try {
      setCancelando(true);
      await cancelarReserva(id);
      
      // Actualizar estado local
      setReserva(prev => ({ ...prev, estado: 'cancelada' }));
      setShowCancelConfirm(false);
      
      // Mostrar mensaje de éxito
      setError(null);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelando(false);
    }
  };

  const handleVerEnMapa = () => {
    navigate('/', {
      state: {
        centrarParqueadero: reserva.parqueadero.id,
        coordenadas: reserva.parqueadero.coordenadas,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !reserva) {
    return (
      <div className="min-h-screen bg-secondary-white p-4">
        <Alert type="error" message={error} />
        <Button
          onClick={() => navigate('/mis-reservas')}
          variant="outline"
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ver mis reservas
        </Button>
      </div>
    );
  }

  const fechaInicio = new Date(reserva.fechaInicio);
  const fechaFin = new Date(reserva.fechaFin);
  const horasHastaInicio = differenceInHours(fechaInicio, new Date());
  const puedeModificar = reserva.estado === 'activa' && horasHastaInicio >= 1;
  const puedeCancelar = reserva.estado === 'activa' && horasHastaInicio >= 1;

  // Determinar el estado visual
  let estadoInfo = {
    icon: CheckCircle,
    color: 'success-quindio',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    texto: 'Reserva Activa',
  };

  if (reserva.estado === 'completada') {
    estadoInfo = {
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      texto: 'Completada',
    };
  } else if (reserva.estado === 'cancelada') {
    estadoInfo = {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      texto: 'Cancelada',
    };
  } else if (isPast(fechaInicio)) {
    estadoInfo = {
      icon: Clock,
      color: 'text-warning-quindio',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      texto: 'En curso',
    };
  }

  const EstadoIcon = estadoInfo.icon;

  return (
    <div className="min-h-screen bg-secondary-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/mis-reservas')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-text-dark" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-text-dark">Detalle de Reserva</h1>
              <p className="text-sm text-text-secondary">#{reserva.codigo}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Alerta de nueva reserva */}
        {nuevaReserva && (
          <Alert
            type="success"
            message="¡Reserva creada exitosamente!"
          />
        )}

        {/* Estado de la reserva */}
        <div className={`${estadoInfo.bgColor} border ${estadoInfo.borderColor} rounded-lg p-4`}>
          <div className="flex items-center gap-3">
            <EstadoIcon className={`w-6 h-6 ${estadoInfo.color}`} />
            <div className="flex-1">
              <p className={`font-semibold ${estadoInfo.color}`}>
                {estadoInfo.texto}
              </p>
              {reserva.estado === 'activa' && !isPast(fechaInicio) && (
                <p className="text-sm text-text-secondary mt-1">
                  Comienza {formatDistanceToNow(fechaInicio, { addSuffix: true, locale: es })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Código QR (solo para reservas activas) */}
        {reserva.estado === 'activa' && (
          <CodigoQR reserva={reserva} />
        )}

        {/* Información del parqueadero */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-text-dark mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-info-blue" />
            Parqueadero
          </h3>
          <div className="space-y-2">
            <p className="text-lg font-semibold">{reserva.parqueadero.nombre}</p>
            <p className="text-sm text-text-secondary">{reserva.parqueadero.direccion}</p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleVerEnMapa}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Cómo llegar
              </Button>
              <a href={`tel:${reserva.usuario.telefono}`}>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Fecha y hora */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-text-dark mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-info-blue" />
            Fecha y Hora
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-text-secondary">Inicio</p>
                <p className="font-semibold">
                  {format(fechaInicio, "d 'de' MMMM, yyyy", { locale: es })}
                </p>
                <p className="text-sm text-text-secondary">
                  {format(fechaInicio, 'h:mm a')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary">Fin</p>
                <p className="font-semibold">
                  {format(fechaFin, "d 'de' MMMM, yyyy", { locale: es })}
                </p>
                <p className="text-sm text-text-secondary">
                  {format(fechaFin, 'h:mm a')}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-secondary" />
                <span className="font-semibold">
                  Duración: {reserva.duracion} {reserva.duracion === 1 ? 'hora' : 'horas'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehículo */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-text-dark mb-3 flex items-center gap-2">
            <Car className="w-5 h-5 text-info-blue" />
            Vehículo
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-info-blue" />
            </div>
            <div>
              <p className="font-semibold">
                {reserva.vehiculo.marca} {reserva.vehiculo.modelo}
              </p>
              <p className="text-sm text-text-secondary">
                {reserva.vehiculo.placa} • {reserva.vehiculo.color}
              </p>
            </div>
          </div>
        </div>

        {/* Notas */}
        {reserva.notas && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-text-dark mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-info-blue" />
              Notas
            </h3>
            <p className="text-sm text-text-secondary">{reserva.notas}</p>
          </div>
        )}

        {/* Resumen de pago */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-text-dark mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-success-quindio" />
            Resumen de Pago
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">
                {reserva.duracion} {reserva.duracion === 1 ? 'hora' : 'horas'} × ${reserva.parqueadero.precio.toLocaleString()}
              </span>
              <span className="font-semibold">${reserva.total.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="text-2xl font-bold text-success-quindio">
                  ${reserva.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información de creación */}
        <div className="text-center text-xs text-text-secondary">
          Reserva creada {formatDistanceToNow(new Date(reserva.createdAt), { addSuffix: true, locale: es })}
        </div>
      </div>

      {/* Acciones fijas en el footer */}
      {reserva.estado === 'activa' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          {showCancelConfirm ? (
            <div className="space-y-3">
              <p className="text-sm text-center text-text-dark font-medium">
                ¿Estás seguro de cancelar esta reserva?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowCancelConfirm(false)}
                  variant="outline"
                  disabled={cancelando}
                >
                  No, mantener
                </Button>
                <Button
                  onClick={handleCancelar}
                  variant="danger"
                  loading={cancelando}
                  disabled={!puedeCancelar}
                >
                  Sí, cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {puedeModificar && (
                <Button
                  onClick={() => navigate(`/modificar-reserva/${id}`)}
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modificar
                </Button>
              )}
              <Button
                onClick={() => setShowCancelConfirm(true)}
                variant="outline"
                className={`${!puedeModificar ? 'col-span-2' : ''} text-red-600 border-red-600 hover:bg-red-50`}
                disabled={!puedeCancelar}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar reserva
              </Button>
            </div>
          )}
          {!puedeCancelar && reserva.estado === 'activa' && (
            <p className="text-xs text-center text-red-600 mt-2">
              Solo puedes cancelar con más de 1 hora de anticipación
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservaDetail;