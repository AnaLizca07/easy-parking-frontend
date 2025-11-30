// ReservaForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Car,
  DollarSign,
  MapPin,
  Plus,
  Check,
  AlertCircle,
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import { createReserva, getVehiculos, validarDisponibilidad } from '../api/mockReservasService';
import { mockParqueaderosService } from '../api/mockParqueaderoService';
import { mockTarifasService } from '../api/mockTarifasService';
import { format, addHours, addDays, startOfHour, isBefore, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';

const ReservaForm = () => {
  const { parqueaderoId } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Datos
  const [parqueadero, setParqueadero] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState(null);
  
  // Formulario
  const [selectedVehiculo, setSelectedVehiculo] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [duracion, setDuracion] = useState(2); // horas
  const [notas, setNotas] = useState('');
  
  // Calculados
  const [fechaFin, setFechaFin] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener parqueadero desde el servicio
        const parqueaderoResult = await mockParqueaderosService.getParqueaderoById(parqueaderoId);
        const parqueaderoData = parqueaderoResult.data;

        // Obtener tarifa del parqueadero
        const tarifaResult = await mockTarifasService.obtenerTarifaPorId(parqueaderoData.tarifa_id);

        // Combinar datos del parqueadero con la tarifa
        const parqueaderoConPrecio = {
          ...parqueaderoData,
          precio: tarifaResult.precio_hora,
          disponibilidad: parqueaderoData.espacios_disponibles
        };

        setParqueadero(parqueaderoConPrecio);
        
        // Obtener vehículos del usuario
        const vehs = await getVehiculos('u1');
        setVehiculos(vehs);
        
        // Seleccionar vehículo predeterminado
        const predeterminado = vehs.find(v => v.predeterminado);
        if (predeterminado) {
          setSelectedVehiculo(predeterminado.id);
        }
        
        // Establecer fecha y hora iniciales (siguiente hora)
        const ahora = new Date();
        const siguienteHora = startOfHour(addHours(ahora, 1));
        setFechaInicio(format(siguienteHora, 'yyyy-MM-dd'));
        setHoraInicio(format(siguienteHora, 'HH:mm'));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parqueaderoId]);

  // Calcular fecha fin y total cuando cambian los valores
  useEffect(() => {
    if (fechaInicio && horaInicio && duracion && parqueadero) {
      const inicio = new Date(`${fechaInicio}T${horaInicio}`);
      const fin = addHours(inicio, duracion);
      setFechaFin(fin);
      setTotal(duracion * parqueadero.precio);
      
      // Validar disponibilidad
      validarDisponibilidad(parqueaderoId, inicio, fin)
        .then(result => setDisponibilidad(result))
        .catch(err => console.error(err));
    }
  }, [fechaInicio, horaInicio, duracion, parqueadero, parqueaderoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedVehiculo) {
      setError('Por favor selecciona un vehículo');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const inicio = new Date(`${fechaInicio}T${horaInicio}`);
      const fin = addHours(inicio, duracion);
      
      // Validar que no sea en el pasado
      if (isBefore(inicio, new Date())) {
        throw new Error('No puedes hacer reservas en el pasado');
      }
      
      // Validar que no sea muy en el futuro (máximo 30 días)
      const maxFuturo = addDays(new Date(), 30);
      if (isAfter(inicio, maxFuturo)) {
        throw new Error('No puedes hacer reservas con más de 30 días de anticipación');
      }
      
      const reserva = await createReserva({
        usuarioId: 'u1',
        parqueaderoId,
        vehiculoId: selectedVehiculo,
        fechaInicio: inicio.toISOString(),
        fechaFin: fin.toISOString(),
        notas,
      });
      
      setSuccess(true);
      
      // Redirigir a la página de confirmación después de 2 segundos
      setTimeout(() => {
        navigate(`/reserva/${reserva.id}`, { state: { nuevaReserva: true } });
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDuracionChange = (horas) => {
    if (horas >= 1 && horas <= 24) {
      setDuracion(horas);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !parqueadero) {
    return (
      <div className="min-h-screen bg-secondary-white p-4">
        <Alert type="error" message={error} />
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-white pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-text-dark" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-dark">Nueva Reserva</h1>
            <p className="text-sm text-text-secondary">{parqueadero.nombre}</p>
          </div>
        </div>
      </div>

      {success ? (
        <div className="p-4">
          <Alert
            type="success"
            message="¡Reserva creada exitosamente! Redirigiendo..."
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          {/* Información del parqueadero */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-info-blue mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-text-dark">{parqueadero.nombre}</h3>
                <p className="text-sm text-text-secondary">{parqueadero.direccion}</p>
                <div className="mt-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-success-quindio" />
                  <span className="font-semibold text-success-quindio">
                    ${parqueadero.precio.toLocaleString()} / hora
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selección de vehículo */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-text-dark">
              Selecciona tu vehículo
            </label>
            
            {vehiculos.length === 0 ? (
              <div className="bg-warning-quindio bg-opacity-10 border border-warning-quindio rounded-lg p-4">
                <p className="text-sm text-text-dark mb-3">
                  No tienes vehículos registrados. Agrega uno para continuar.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/perfil/vehiculos')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar vehículo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {vehiculos.map((vehiculo) => (
                  <button
                    key={vehiculo.id}
                    type="button"
                    onClick={() => setSelectedVehiculo(vehiculo.id)}
                    className={`w-full bg-white rounded-lg p-4 border-2 transition-all ${
                      selectedVehiculo === vehiculo.id
                        ? 'border-info-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Car className={`w-5 h-5 ${
                          selectedVehiculo === vehiculo.id ? 'text-info-blue' : 'text-text-secondary'
                        }`} />
                        <div className="text-left">
                          <p className="font-semibold text-text-dark">
                            {vehiculo.marca} {vehiculo.modelo}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {vehiculo.placa} • {vehiculo.color}
                          </p>
                        </div>
                      </div>
                      {selectedVehiculo === vehiculo.id && (
                        <Check className="w-5 h-5 text-info-blue" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha
              </label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Hora
              </label>
              <Input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Duración */}
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-3">
              Duración
            </label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDuracionChange(duracion - 1)}
                disabled={duracion <= 1}
                className="px-3"
              >
                -
              </Button>
              <div className="flex-1 bg-white rounded-lg border border-gray-300 py-3 text-center">
                <span className="text-2xl font-bold text-text-dark">{duracion}</span>
                <span className="text-sm text-text-secondary ml-2">
                  {duracion === 1 ? 'hora' : 'horas'}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDuracionChange(duracion + 1)}
                disabled={duracion >= 24}
                className="px-3"
              >
                +
              </Button>
            </div>
            
            {fechaFin && (
              <p className="text-sm text-text-secondary mt-2 text-center">
                Hasta: {format(fechaFin, "d 'de' MMMM, h:mm a", { locale: es })}
              </p>
            )}
          </div>

          {/* Disponibilidad */}
          {disponibilidad && (
            <div className={`rounded-lg p-4 ${
              disponibilidad.disponible
                ? 'bg-success-quindio bg-opacity-10 border border-success-quindio'
                : 'bg-red-50 border border-red-500'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 mt-0.5 ${
                  disponibilidad.disponible ? 'text-success-quindio' : 'text-red-600'
                }`} />
                <div>
                  <p className={`font-semibold ${
                    disponibilidad.disponible ? 'text-success-quindio' : 'text-red-600'
                  }`}>
                    {disponibilidad.mensaje}
                  </p>
                  {disponibilidad.disponible && (
                    <p className="text-sm text-text-secondary mt-1">
                      Espacios disponibles: {disponibilidad.espaciosLibres}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notas adicionales */}
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              Notas adicionales (opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Estacionar cerca de la entrada"
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info-blue focus:border-transparent resize-none"
            />
            <p className="text-xs text-text-secondary mt-1">
              {notas.length}/200 caracteres
            </p>
          </div>

          {/* Resumen de pago */}
          <div className="bg-gradient-to-r from-info-blue to-blue-600 rounded-lg p-4 text-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm opacity-90">Total a pagar</span>
              <span className="text-3xl font-bold">
                ${total.toLocaleString()}
              </span>
            </div>
            <p className="text-xs opacity-80">
              {duracion} {duracion === 1 ? 'hora' : 'horas'} × ${parqueadero.precio.toLocaleString()}
            </p>
          </div>

          {/* Botón de confirmar */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-lg"
            disabled={submitting || !selectedVehiculo || !disponibilidad?.disponible}
            loading={submitting}
          >
            {submitting ? 'Procesando...' : 'Confirmar reserva'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ReservaForm;