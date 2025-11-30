// RUTA: src/pages/admin/CrearParqueadero.jsx
// Formulario para crear un nuevo parqueadero

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, DollarSign, Car, Shield, 
  Zap, Accessibility, ArrowLeft, Save, AlertCircle 
} from 'lucide-react';
// Asegúrate de que estos componentes existen y manejan bien el estilo (Button, Input, Alert, Spinner)
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import { mockParqueaderosService } from '../../api/mockParqueaderoService';
import { mockTarifasService } from '../../api/mockTarifasService';
import { useAuth } from '../../hooks/useAuth';

// --- Componente de Badge/Pill para Características (Nuevo) ---
const FeatureBadge = ({ label, icon: Icon, isSelected, onClick }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer
            ${isSelected 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400'
            }`}
    >
        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
        <span className="text-sm font-medium">{label}</span>
    </div>
);
// -----------------------------------------------------------------

const CrearParqueadero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
        // Establecer la primera tarifa por defecto
        setFormData(prev => ({ ...prev, tarifa_id: data[0].id.toString() })); 
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
      if (!user || !user.id) {
        throw new Error('Usuario no autenticado o sin ID válido');
      }
      if (!formData.nombre.trim() || !formData.direccion.trim() || !formData.coordenadas.trim()) {
        throw new Error('Los campos Nombre, Dirección y Coordenadas son requeridos');
      }
      if (!formData.total_spaces || parseInt(formData.total_spaces) <= 0) {
        throw new Error('El número de espacios debe ser mayor a 0');
      }
      if (!formData.tarifa_id) {
        throw new Error('Debes seleccionar una tarifa');
      }

      const [lat, lng] = formData.coordenadas.split(',').map(coord => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Las coordenadas deben tener el formato latitud,longitud');
      }

      const creadorId = parseInt(user.id);

      const dataToSend = {
        ...formData,
        coordenadas: { lat, lng },
        total_spaces: parseInt(formData.total_spaces),
        tarifa_id: parseInt(formData.tarifa_id),
        creador_id: creadorId
      };

      await mockParqueaderosService.createParqueadero(dataToSend);

      setSuccess(true);
      
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
    { id: 'acceso', label: 'Acceso Discapacitados', icon: Accessibility }
  ];

  // Helper para agrupar secciones
  const FormSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-5 pb-2 border-b border-gray-100 flex items-center gap-3">
        <Icon className="w-6 h-6 text-blue-600" />
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header y Navegación */}
        <div className="mb-8">
            <button
                onClick={() => navigate('/admin/parqueaderos')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-lg font-medium">Volver a la lista de parqueaderos</span>
            </button>
        </div>

        {/* Título Principal de la Tarjeta */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 text-white px-8 py-5">
            <h1 className="text-3xl font-extrabold">Nuevo Parqueadero</h1>
            <p className="text-blue-200 mt-1">Configura las propiedades y tarifas de la nueva ubicación.</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Alertas */}
            {(error || success) && (
                <Alert variant={error ? "error" : "success"}>
                    <AlertCircle className="w-5 h-5" />
                    {error || '¡Parqueadero creado exitosamente! Redirigiendo...'}
                </Alert>
            )}

            {/* Grid de Secciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Columna 1: Datos Básicos y Horarios */}
                <div className="space-y-6">
                    {/* Sección: Información Básica */}
                    <FormSection title="Detalles de Ubicación" icon={MapPin}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre del Parqueadero *
                                </label>
                                <Input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Parqueadero Centro"
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Dirección *
                                </label>
                                <Input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Ej: Cra 14 #15-25"
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Coordenadas (lat,lng) *
                                </label>
                                <Input
                                    type="text"
                                    name="coordenadas"
                                    value={formData.coordenadas}
                                    onChange={handleChange}
                                    placeholder="Ej: 4.5389,-75.6811"
                                    className="w-full"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Formato: latitud,longitud. Útil para mapas.
                                </p>
                            </div>
                        </div>
                    </FormSection>
                    
                    {/* Sección: Horarios */}
                    <FormSection title="Horario de Funcionamiento" icon={Clock}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Apertura
                                </label>
                                <Input
                                    type="time"
                                    name="horario_apertura"
                                    value={formData.horario_apertura}
                                    onChange={handleChange}
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Cierre
                                </label>
                                <Input
                                    type="time"
                                    name="horario_cierre"
                                    value={formData.horario_cierre}
                                    onChange={handleChange}
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>
                    </FormSection>
                </div>


                {/* Columna 2: Capacidad, Tarifas y Características */}
                <div className="space-y-6">
                    {/* Sección: Capacidad y Tipo */}
                    <FormSection title="Capacidad y Tipo" icon={Car}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Total de Espacios *
                                </label>
                                <Input
                                    type="number"
                                    name="total_spaces"
                                    value={formData.total_spaces}
                                    onChange={handleChange}
                                    placeholder="Ej: 50"
                                    min="1"
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tipo de Espacio
                                </label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Cubierto">Cubierto</option>
                                    <option value="Descubierto">Descubierto</option>
                                    <option value="Garaje">Garaje Privado</option>
                                </select>
                            </div>
                        </div>
                    </FormSection>

                    {/* Sección: Tarifas */}
                    <FormSection title="Tarifa Aplicable" icon={DollarSign}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Seleccionar Tarifa *
                            </label>
                            <select
                                name="tarifa_id"
                                value={formData.tarifa_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">--- Selecciona una tarifa ---</option>
                                {tarifas.map(tarifa => (
                                    <option key={tarifa.id} value={tarifa.id}>
                                        {tarifa.nombre} - ${tarifa.precio_hora.toLocaleString('es-CO')}/hora
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                ¿No encuentras la tarifa? <a href="/admin/tarifas" className="text-blue-600 hover:underline">Gestiona tarifas aquí</a>
                            </p>
                        </div>
                    </FormSection>

                    {/* Sección: Características */}
                    <FormSection title="Características Adicionales" icon={Shield}>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Servicios ofrecidos:</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {caracteristicasDisponibles.map(({ id, label, icon: Icon }) => (
                                <FeatureBadge
                                    key={id}
                                    label={label}
                                    icon={Icon}
                                    isSelected={formData.caracteristicas.includes(label)}
                                    onClick={() => handleCaracteristicaToggle(label)}
                                />
                            ))}
                        </div>

                        <label className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                            <input
                            type="checkbox"
                            name="solo_motos"
                            checked={formData.solo_motos}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-base font-semibold text-gray-700">Espacio exclusivo para motocicletas</span>
                        </label>
                    </FormSection>
                </div>
            </div>

            {/* Botones de Acción (Fijos al final) */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/parqueaderos')}
                className="flex-1 py-3 text-base"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || success}
                className="flex-1 py-3 text-base bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2 border-white" />
                    Creando Parqueadero...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Confirmar Creación
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