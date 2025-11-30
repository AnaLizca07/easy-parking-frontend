// RUTA: src/pages/admin/CrearParqueadero.jsx
// Formulario para crear un nuevo parqueadero

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, DollarSign, Car, Shield, 
  Zap, Accessibility, ArrowLeft, Save, AlertCircle 
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { mockParqueaderosAdminService } from '../../api/mockParqueaderosAdminService';
import { mockTarifasService } from '../../api/mockTarifasService';

const CrearParqueadero = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tarifas, setTarifas] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    coordenadas: '',
    horario_apertura: '06:00',
    horario_cierre: '22:00',
    total_spaces: '',
    tarifa_id: '',
    tipo: 'Cubierto',
    caracteristicas: [],
    solo_motos: false
  });

  useEffect(() => {
    cargarTarifas();
  }, []);

  const cargarTarifas = async () => {
    try {
      const data = await mockTarifasService.listarTarifas();
      setTarifas(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, tarifa_id: data[0].id }));
      }
    } catch (err) {
      console.error('Error al cargar tarifas:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleCaracteristicaToggle = (caracteristica) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.includes(caracteristica)
        ? prev.caracteristicas.filter(c => c !== caracteristica)
        : [...prev.caracteristicas, caracteristica]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        throw new Error('El nombre es requerido');
      }

      if (!formData.direccion.trim()) {
        throw new Error('La dirección es requerida');
      }

      if (!formData.coordenadas.trim()) {
        throw new Error('Las coordenadas son requeridas');
      }

      if (!formData.total_spaces || formData.total_spaces <= 0) {
        throw new Error('El número de espacios debe ser mayor a 0');
      }

      // Crear parqueadero
      const parqueadero = await mockParqueaderosAdminService.crearParqueadero({
        ...formData,
        total_spaces: parseInt(formData.total_spaces),
        tarifa_id: parseInt(formData.tarifa_id)
      });

      setSuccess(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin/parqueaderos');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Error al crear el parqueadero');
    } finally {
      setLoading(false);
    }
  };

  const caracteristicasDisponibles = [
    { id: 'seguridad', label: 'Seguridad 24/7', icon: Shield },
    { id: 'carga', label: 'Carga Eléctrica', icon: Zap },
    { id: 'acceso', label: 'Acceso para Discapacitados', icon: Accessibility }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/admin/parqueaderos')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a parqueaderos
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Título */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">Crear Nuevo Parqueadero</h1>
            <p className="text-blue-100 mt-1">Completa la información del parqueadero</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <Alert variant="error">
                <AlertCircle className="w-5 h-5" />
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success">
                <AlertCircle className="w-5 h-5" />
                ¡Parqueadero creado exitosamente! Redirigiendo...
              </Alert>
            )}

            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Información Básica
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Parqueadero *
                </label>
                <Input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Parqueadero Centro"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <Input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Cra 14 #15-25, Armenia"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coordenadas (lat,lng) *
                </label>
                <Input
                  type="text"
                  name="coordenadas"
                  value={formData.coordenadas}
                  onChange={handleChange}
                  placeholder="Ej: 4.5389,-75.6811"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formato: latitud,longitud (sin espacios)
                </p>
              </div>
            </div>

            {/* Horarios y Capacidad */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horarios y Capacidad
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Apertura
                  </label>
                  <Input
                    type="time"
                    name="horario_apertura"
                    value={formData.horario_apertura}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Cierre
                  </label>
                  <Input
                    type="time"
                    name="horario_cierre"
                    value={formData.horario_cierre}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total de Espacios *
                </label>
                <Input
                  type="number"
                  name="total_spaces"
                  value={formData.total_spaces}
                  onChange={handleChange}
                  placeholder="Ej: 50"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Tarifas y Tipo */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Tarifas y Tipo
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarifa Aplicable *
                </label>
                <select
                  name="tarifa_id"
                  value={formData.tarifa_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona una tarifa</option>
                  {tarifas.map(tarifa => (
                    <option key={tarifa.id} value={tarifa.id}>
                      ${tarifa.precio_hora.toLocaleString()}/hora
                      {tarifa.precio_mensualidad && ` - $${tarifa.precio_mensualidad.toLocaleString()}/mes`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Espacio
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Cubierto">Cubierto</option>
                  <option value="Descubierto">Descubierto</option>
                  <option value="Garaje">Garaje</option>
                </select>
              </div>
            </div>

            {/* Características */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Características
              </h3>

              <div className="space-y-2">
                {caracteristicasDisponibles.map(({ id, label, icon: Icon }) => (
                  <label
                    key={id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.caracteristicas.includes(label)}
                      onChange={() => handleCaracteristicaToggle(label)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="solo_motos"
                  checked={formData.solo_motos}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">Solo para motocicletas</span>
              </label>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/parqueaderos')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || success}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Crear Parqueadero
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearParqueadero;