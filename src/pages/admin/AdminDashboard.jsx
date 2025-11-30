// RUTA: src/pages/admin/AdminDashboard.jsx
// Panel principal de administración

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, MapPin, CreditCard, CheckCircle, 
  TrendingUp, Users, Clock, AlertCircle, BarChart3
} from 'lucide-react';
// Asumo que 'Button' tiene variantes con colores definidos (primary, outline)
import Button from '../../components/common/Button'; 
import Spinner from '../../components/common/Spinner';
import PageLayout from '../../components/layout/PageLayout';

// Componente de Tarjeta de Estadística con color de énfasis
const StatCard = ({ title, value, subtext, Icon, iconColorClass, link }) => (
  <div 
    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border-t-4"
    style={{ borderColor: iconColorClass.replace('text-', '').replace('600', '') }} // Usar el color para el borde superior
  >
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1">
          {title}
        </h3>
        <p className="text-4xl font-extrabold text-gray-900">
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-full ${iconColorClass.replace('600', '100')}`}>
        <Icon className={`w-6 h-6 ${iconColorClass}`} />
      </div>
    </div>
    {subtext && (
      <p className="text-sm text-gray-500 mt-4">
        {subtext}
      </p>
    )}
    {link && (
        <a href={link} className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-2 block">
            Ver detalle &rarr;
        </a>
    )}
  </div>
);

// Componente de Tarjeta de Acción Rápida
const QuickActionCard = ({ title, icon: Icon, onClick, className = '' }) => (
    <div 
        onClick={onClick}
        className={`bg-white rounded-xl shadow-md p-6 flex flex-col items-start justify-center cursor-pointer 
                   hover:bg-blue-50 hover:shadow-lg transition-all duration-200 border border-gray-100 ${className}`}
    >
        <div className="p-2 rounded-lg bg-blue-100 mb-3">
            <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
);


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalParqueaderos: 6,
    espaciosTotales: 360,
    espaciosOcupados: 189,
    reservasHoy: 24,
    reservasPendientes: 8,
    reservasConfirmadas: 16,
    ingresosDia: 450000
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      // Simulación de carga de datos
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const porcentajeOcupacion = (
    (estadisticas.espaciosOcupados / estadisticas.espaciosTotales) * 100
  ).toFixed(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <PageLayout title="Panel de Control Principal">
      <div className="bg-gray-50 py-8 px-4 min-h-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido, Administrador
            </h1>
            <p className="text-gray-600">
              Gestión centralizada de parqueaderos, reservas y validaciones.
            </p>
          </div>

          <hr className="my-8" />

          {/* Estadísticas Clave */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">
            Métricas Clave del Día
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Total Parqueaderos */}
            <StatCard
              title="Parqueaderos"
              value={estadisticas.totalParqueaderos}
              subtext="Ubicaciones activas"
              Icon={MapPin}
              iconColorClass="text-blue-600"
              link="/admin/parqueaderos"
            />

            {/* Ocupación */}
            <StatCard
              title="Ocupación"
              value={`${porcentajeOcupacion}%`}
              subtext={`${estadisticas.espaciosOcupados} / ${estadisticas.espaciosTotales} espacios`}
              Icon={Car}
              iconColorClass="text-green-600"
            />

            {/* Reservas Hoy */}
            <StatCard
              title="Reservas Hoy"
              value={estadisticas.reservasHoy}
              subtext={`${estadisticas.reservasPendientes} pendientes de validar`}
              Icon={Clock}
              iconColorClass="text-yellow-600"
              link="/admin/reservas?estado=pendiente"
            />

            {/* Ingresos del Día */}
            <StatCard
              title="Ingresos Hoy"
              value={`$${(estadisticas.ingresosDia).toLocaleString('es-CO')}`} // Formato de moneda mejorado
              subtext={<span className="text-green-600 font-medium">+12% vs ayer</span>} // Enfatizar el cambio
              Icon={TrendingUp}
              iconColorClass="text-purple-600"
              link="/admin/reportes"
            />
          </div>

          {/* Alertas y Acciones Rápidas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Alertas */}
            <div className="lg:col-span-1 bg-yellow-50 border border-yellow-300 rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-700 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-yellow-900 mb-1">
                            Atención Requerida
                        </h3>
                        <p className="text-sm text-yellow-800 mb-3">
                            Tienes **{estadisticas.reservasPendientes} reservas** pendientes de validación. ¡Actúa rápido!
                        </p>
                        <Button
                            onClick={() => navigate('/admin/validar-reserva')}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                            Validar Ahora
                        </Button>
                    </div>
                </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-5">
                    Acciones Rápidas 🚀
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Crear Parqueadero"
                        icon={MapPin}
                        onClick={() => navigate('/admin/parqueaderos/nuevo')}
                    />
                    <QuickActionCard
                        title="Ver Reservas"
                        icon={Clock}
                        onClick={() => navigate('/admin/reservas')}
                    />
                    <QuickActionCard
                        title="Ver Reportes"
                        icon={BarChart3}
                        onClick={() => navigate('/admin/reportes')}
                    />
                </div>
            </div>
          </div>
          
          <hr className="my-8" />
          
          {/* Resumen de Gestión */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">
            Resumen de Gestión ⚙️
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Reservas por Estado (Visualmente mejorado) */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-5">
                Estado de Reservas
              </h3>
              <div className="space-y-4">
                {/* Indicador Pendientes */}
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Pendientes de Validación</span>
                  </div>
                  <span className="text-xl font-extrabold text-yellow-600">{estadisticas.reservasPendientes}</span>
                </div>
                
                {/* Indicador Confirmadas */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Reservas Confirmadas</span>
                  </div>
                  <span className="text-xl font-extrabold text-green-600">{estadisticas.reservasConfirmadas}</span>
                </div>
                
                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-base font-semibold text-gray-600">Total Reservas Hoy</span>
                    <span className="text-xl font-extrabold text-gray-900">{estadisticas.reservasHoy}</span>
                </div>
              </div>
            </div>

            {/* Acciones de Configuración */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-5">
                Configuración y Administración
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/admin/parqueaderos')}
                  variant="outline"
                  className="w-full justify-start py-3 text-base border-gray-200 hover:bg-gray-50"
                >
                  <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                  Administrar Ubicaciones y Parqueaderos
                </Button>
                <Button
                  onClick={() => navigate('/admin/tarifas')}
                  variant="outline"
                  className="w-full justify-start py-3 text-base border-gray-200 hover:bg-gray-50"
                >
                  <CreditCard className="w-5 h-5 mr-3 text-purple-500" />
                  Configurar Tarifas y Precios
                </Button>
                <Button
                  onClick={() => navigate('/admin/usuarios')}
                  variant="outline"
                  className="w-full justify-start py-3 text-base border-gray-200 hover:bg-gray-50"
                >
                  <Users className="w-5 h-5 mr-3 text-green-500" />
                  Gestión de Usuarios y Clientes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;