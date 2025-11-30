import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Car,
  DollarSign,
  Check,
  AlertCircle,
  Camera
} from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import Spinner from '../common/Spinner';
import { mockParqueaderosService } from '../../api/mockParqueaderoService';
import { mockTarifasService } from '../../api/mockTarifasService';
import { useAuth } from '../../hooks/useAuth';

const ParqueaderoForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [tarifas, setTarifas] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    coordenadas: {
      lat: '',
      lng: ''
    },
    horario_apertura: '06:00',
    horario_cierre: '22:00',
    total_spaces: '',
    tarifa_id: '',
    tipo: 'Cubierto',
    caracteristicas: [],
    imagen_url: '',
    solo_motos: false
  });

  const tiposParqueadero = ['Cubierto', 'Descubierto', 'Garaje'];

  const caracteristicasDisponibles = [
    'Seguridad 24/7',
    'Acceso para Discapacitados',
    'Carga Eléctrica',
    'Vigilancia CCTV',
    'Techado',
    'Lavado de Vehículos'
  ];

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        setLoading(true);
        const tarifasData = await mockTarifasService.listarTarifas();
        setTarifas(tarifasData);

        if (tarifasData.length > 0) {
          setFormData(prev => ({ ...prev, tarifa_id: tarifasData[0].id }));
        }
      } catch (err) {
        setError('Error al cargar las tarifas: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTarifas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('coordenadas.')) {
      const campo = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        coordenadas: {
          ...prev.coordenadas,
          [campo]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCaracteristicaToggle = (caracteristica) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.includes(caracteristica)
        ? prev.caracteristicas.filter(c => c !== caracteristica)
        : [...prev.caracteristicas, caracteristica]
    }));
  };

  const obtenerUbicacionActual = () => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada en este navegador');
      return;
    }

    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          coordenadas: {
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString()
          }
        }));
      },
      (err) => {
        setError('Error al obtener la ubicación: ' + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      if (!formData.nombre.trim()) {
        throw new Error('El nombre es requerido');
      }

      if (!formData.direccion.trim()) {
        throw new Error('La dirección es requerida');
      }

      if (!formData.coordenadas.lat || !formData.coordenadas.lng) {
        throw new Error('Las coordenadas son requeridas');
      }

      if (!formData.total_spaces || parseInt(formData.total_spaces) < 1) {
        throw new Error('El número de espacios debe ser mayor a 0');
      }

      if (!formData.tarifa_id) {
        throw new Error('Debe seleccionar una tarifa');
      }

      if (!user || !user.id) {
        throw new Error('Usuario no autenticado');
      }

      // Agregar creador_id antes de enviar
      const dataToSend = {
        ...formData,
        creador_id: parseInt(user.id)
      };

      const result = await mockParqueaderosService.createParqueadero(dataToSend);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/parqueaderos');
        }, 2000);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-white pb-24">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-text-dark" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-dark">Crear Parqueadero</h1>
            <p className="text-sm text-text-secondary">Agrega un nuevo parqueadero</p>
          </div>
        </div>
      </div>

      {success ? (
        <div className="p-4">
          <Alert
            type="success"
            message="¡Parqueadero creado exitosamente! Redirigiendo..."
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-text-dark flex items-center gap-2">
              <Car className="w-5 h-5 text-info-blue" />
              Información Básica
            </h3>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">
                Nombre del parqueadero *
              </label>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Parqueadero Centro Comercial"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">
                Dirección *
              </label>
              <Input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Ej: Cra 14 #15-25, Armenia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">
                Número total de espacios *
              </label>
              <Input
                type="number"
                name="total_spaces"
                value={formData.total_spaces}
                onChange={handleInputChange}
                placeholder="50"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">
                Tipo de parqueadero
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info-blue focus:border-transparent"
              >
                {tiposParqueadero.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="solo_motos"
                name="solo_motos"
                checked={formData.solo_motos}
                onChange={handleInputChange}
                className="w-4 h-4 text-info-blue bg-gray-100 border-gray-300 rounded focus:ring-info-blue"
              />
              <label htmlFor="solo_motos" className="text-sm font-medium text-text-dark">
                Solo para motocicletas
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-text-dark flex items-center gap-2">
              <MapPin className="w-5 h-5 text-info-blue" />
              Ubicación
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Latitud *
                </label>
                <Input
                  type="number"
                  step="any"
                  name="coordenadas.lat"
                  value={formData.coordenadas.lat}
                  onChange={handleInputChange}
                  placeholder="4.5389"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Longitud *
                </label>
                <Input
                  type="number"
                  step="any"
                  name="coordenadas.lng"
                  value={formData.coordenadas.lng}
                  onChange={handleInputChange}
                  placeholder="-75.6811"
                  required
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={obtenerUbicacionActual}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Usar mi ubicación actual
            </Button>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-text-dark flex items-center gap-2">
              <Clock className="w-5 h-5 text-info-blue" />
              Horarios
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Hora de apertura
                </label>
                <Input
                  type="time"
                  name="horario_apertura"
                  value={formData.horario_apertura}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">
                  Hora de cierre
                </label>
                <Input
                  type="time"
                  name="horario_cierre"
                  value={formData.horario_cierre}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-text-dark flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-info-blue" />
              Tarifa
            </h3>

            {tarifas.length > 0 ? (
              <div className="space-y-2">
                {tarifas.map(tarifa => (
                  <div
                    key={tarifa.id}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      parseInt(formData.tarifa_id) === tarifa.id
                        ? 'border-info-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, tarifa_id: tarifa.id }))}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-text-dark">
                          ${tarifa.precio_hora.toLocaleString()} / hora
                        </p>
                        {tarifa.precio_mensualidad && (
                          <p className="text-sm text-text-secondary">
                            Mensualidad: ${tarifa.precio_mensualidad.toLocaleString()}
                          </p>
                        )}
                      </div>
                      {parseInt(formData.tarifa_id) === tarifa.id && (
                        <Check className="w-5 h-5 text-info-blue" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert type="warning" message="No hay tarifas disponibles. Contacta al administrador." />
            )}
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-text-dark">Características</h3>

            <div className="grid grid-cols-2 gap-2">
              {caracteristicasDisponibles.map(caracteristica => (
                <button
                  key={caracteristica}
                  type="button"
                  onClick={() => handleCaracteristicaToggle(caracteristica)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    formData.caracteristicas.includes(caracteristica)
                      ? 'border-info-blue bg-blue-50 text-info-blue'
                      : 'border-gray-200 hover:border-gray-300 text-text-dark'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{caracteristica}</span>
                    {formData.caracteristicas.includes(caracteristica) && (
                      <Check className="w-4 h-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
            <h3 className="font-semibold text-text-dark flex items-center gap-2">
              <Camera className="w-5 h-5 text-info-blue" />
              Imagen (opcional)
            </h3>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">
                URL de la imagen
              </label>
              <Input
                type="url"
                name="imagen_url"
                value={formData.imagen_url}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <p className="text-xs text-text-secondary mt-1">
                Deja vacío para usar la imagen predeterminada
              </p>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-lg"
            disabled={submitting || tarifas.length === 0}
            loading={submitting}
          >
            {submitting ? 'Creando...' : 'Crear parqueadero'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ParqueaderoForm;