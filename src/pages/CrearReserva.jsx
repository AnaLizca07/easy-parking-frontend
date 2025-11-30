// RUTA: src/pages/CrearReserva.jsx
// Página para crear una nueva reserva

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Car, CreditCard, AlertCircle,
  CheckCircle, ArrowLeft, MapPin 
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import PageLayout from '../components/layout/PageLayout';
import { mockReservasService } from '../api/mockReservasService';
import { mockParqueaderosService } from '../api/mockParqueaderoService';
import { mockTarifasService } from '../api/mockTarifasService';
import { useAuth } from '../hooks/useAuth';

const CrearReserva = () => {
  const { parqueaderoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [parqueadero, setParqueadero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [reservaCreada, setReservaCreada] = useState(null);

  const [formData, setFormData] = useState({
    fecha_de_reserva: '',
    hora_reserva: '',
    duracion_estimada: 60,
    placa_vehiculo: ''
  });

  useEffect(() => {
    cargarParqueadero();
    setFechaMinima();
  }, [parqueaderoId]);

  const setFechaMinima = () => {
    const ahora = new Date();
    const fechaMin = ahora.toISOString().slice(0, 16);
    setFormData(prev => ({
      ...prev,
      fecha_de_reserva: fechaMin
    }));
  };

  const cargarParqueadero = async () => {
    try {
      setLoading(true);

      // Cargar información del parqueadero
      const responseParqueadero = await mockParqueaderosService.getParqueaderoById(parqueaderoId);
      const datosParqueadero = responseParqueadero.data;

      // Cargar información de la tarifa
      const tarifa = await mockTarifasService.obtenerTarifaPorId(datosParqueadero.tarifa_id);

      setParqueadero({
        ...datosParqueadero,
        precio_hora: tarifa.precio_hora
      });

      console.log('✅ Parqueadero cargado:', datosParqueadero);
    } catch (err) {
      console.error('Error al cargar parqueadero:', err);
      setError(err.message || 'Error al cargar información del parqueadero');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const calcularTotal = () => {
    if (!parqueadero) return 0;
    const horas = formData.duracion_estimada / 60;
    return Math.ceil(horas * parqueadero.precio_hora);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Validaciones
      if (!formData.placa_vehiculo.trim()) {
        throw new Error('La placa del vehículo es requerida');
      }

      if (!formData.fecha_de_reserva) {
        throw new Error('La fecha de reserva es requerida');
      }

      // Crear la reserva
      const reservaData = {
        usuario_id: user.id,
        parqueadero_id: parseInt(parqueaderoId),
        fecha_de_reserva: formData.fecha_de_reserva,
        duracion_estimada: parseInt(formData.duracion_estimada),
        placa_vehiculo: formData.placa_vehiculo
      };

      const reserva = await mockReservasService.crearReserva(reservaData);

      setReservaCreada(reserva);
      setSuccess(true);

    } catch (err) {
      setError(err.message || 'Error al crear la reserva');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerReserva = () => {
    navigate(`/mis-reservas/${reservaCreada.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (success && reservaCreada) {
    return (
      <PageLayout title="Reserva Creada" showBackButton onBackClick={() => navigate('/')}>
        <div className="bg-background py-8 px-4 min-h-full flex items-center justify-center">
          <div className="max-w-md mx-auto bg-surface card-elevated p-8 text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-success-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              ¡Reserva Creada Exitosamente!
            </h2>

            <p className="text-text-secondary mb-6">
              Tu código de reserva es:
            </p>
            
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 mb-6">
              <p className="text-4xl font-bold text-primary-700 tracking-widest">
                {reservaCreada.codigo}
              </p>
            </div>

            <div className="alert-warning">
              <p className="text-sm">
                <strong>Importante:</strong> Guarda este código. Lo necesitarás para ingresar al parqueadero.
              </p>
            </div>

            <div className="space-y-3 text-left mb-8">
              <div className="flex justify-between">
                <span className="text-text-secondary">Parqueadero:</span>
                <span className="font-medium text-text-primary">{parqueadero.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Fecha:</span>
                <span className="font-medium text-text-primary">
                  {new Date(reservaCreada.fecha_de_reserva).toLocaleString('es-CO')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Duración:</span>
                <span className="font-medium text-text-primary">{reservaCreada.duracion_estimada} minutos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Placa:</span>
                <span className="font-medium text-text-primary">{reservaCreada.placa_vehiculo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total estimado:</span>
                <span className="font-bold text-lg text-primary-700">${calcularTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handleVerReserva} className="w-full">
                Ver detalles de la reserva
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Volver al mapa
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Crear Reserva" showBackButton onBackClick={() => navigate(-1)}>
      <div className="bg-background py-8 px-4 min-h-full">
        <div className="max-w-2xl mx-auto">

        <div className="bg-surface card-elevated overflow-hidden">
          {/* Título */}
          <div className="bg-primary-600 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">Crear Reserva</h1>
            <p className="text-primary-100 mt-1">Completa los datos para tu reserva</p>
          </div>

          {/* Info del parqueadero */}
          {parqueadero && (
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-text-muted mt-0.5" />
                <div>
                  <p className="font-medium text-text-primary">{parqueadero.nombre}</p>
                  <p className="text-sm text-text-secondary">{parqueadero.direccion}</p>
                  <p className="text-sm text-primary-600 mt-1">
                    ${parqueadero.precio_hora.toLocaleString()} / hora
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <Alert variant="error">
                <AlertCircle className="w-5 h-5" />
                {error}
              </Alert>
            )}

            {/* Fecha y hora */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha y hora de llegada
              </label>
              <Input
                type="datetime-local"
                name="fecha_de_reserva"
                value={formData.fecha_de_reserva}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
              <p className="text-sm text-text-muted mt-1">
                Selecciona cuándo planeas llegar al parqueadero
              </p>
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Duración estimada
              </label>
              <select
                name="duracion_estimada"
                value={formData.duracion_estimada}
                onChange={handleChange}
                className="w-full input-field"
                required
              >
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="120">2 horas</option>
                <option value="180">3 horas</option>
                <option value="240">4 horas</option>
                <option value="300">5 horas</option>
                <option value="360">6 horas</option>
              </select>
              <p className="text-sm text-text-muted mt-1">
                ¿Cuánto tiempo planeas quedarte?
              </p>
            </div>

            {/* Placa */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Car className="w-4 h-4 inline mr-1" />
                Placa del vehículo
              </label>
              <Input
                type="text"
                name="placa_vehiculo"
                value={formData.placa_vehiculo}
                onChange={handleChange}
                placeholder="ABC123"
                maxLength="6"
                required
                className="uppercase"
              />
              <p className="text-sm text-text-muted mt-1">
                Ingresa la placa de tu vehículo (sin espacios ni guiones)
              </p>
            </div>

            {/* Resumen de pago */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-text-primary" />
                <h3 className="font-medium text-text-primary">Resumen</h3>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Duración:</span>
                <span className="font-medium text-text-primary">
                  {formData.duracion_estimada} minutos
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Tarifa por hora:</span>
                <span className="font-medium text-text-primary">
                  ${parqueadero?.precio_hora.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-text-primary">Total estimado:</span>
                  <span className="font-bold text-xl text-primary-600">
                    ${calcularTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón de envío */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creando reserva...
                </>
              ) : (
                'Confirmar reserva'
              )}
            </Button>
          </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CrearReserva;