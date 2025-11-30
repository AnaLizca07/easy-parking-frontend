// RUTA: src/pages/admin/AdminDashboard.jsx
// Panel principal de administración

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, MapPin, CreditCard, CheckCircle, 
  TrendingUp, Users, Clock, AlertCircle 
} from 'lucide-react';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import PageLayout from '../../components/layout/PageLayout';

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
    <PageLayout title="Panel de Control">
      <div className="bg-gray-50 py-8 px-4 min-h-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-gray-600">
              Gestiona parqueaderos, reservas y validaciones
            </p>
          </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            onClick={() => navigate('/admin/parqueaderos/nuevo')}
            className="h-20"
          >
            <MapPin className="w-6 h-6 mr-2" />
            Crear Parqueadero
          </Button>
          
          <Button
            onClick={() => navigate('/admin/validar-reserva')}
            variant="outline"
            className="h-20"
          >
            <CheckCircle className="w-6 h-6 mr-2" />
            Validar Reserva
          </Button>
          
          <Button
            onClick={() => navigate('/admin/reservas')}
            variant="outline"
            className="h-20"
          >
            <Clock className="w-6 h-6 mr-2" />
            Ver Reservas
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Parqueaderos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Parqueaderos
              </h3>
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {estadisticas.totalParqueaderos}
            </p>
            <p className="text-sm text-gray-500 mt-1">Activos</p>
          </div>

          {/* Ocupación */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Ocupación
              </h3>
              <Car className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {porcentajeOcupacion}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {estadisticas.espaciosOcupados} / {estadisticas.espaciosTotales} espacios
            </p>
          </div>

          {/* Reservas Hoy */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Reservas Hoy
              </h3>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {estadisticas.reservasHoy}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {estadisticas.reservasPendientes} pendientes
            </p>
          </div>

          {/* Ingresos del Día */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">
                Ingresos Hoy
              </h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${(estadisticas.ingresosDia / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-green-600 mt-1">+12% vs ayer</p>
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-1">
                Atención requerida
              </h3>
              <p className="text-sm text-yellow-800">
                Tienes {estadisticas.reservasPendientes} reservas pendientes de validación.
              </p>
            </div>
          </div>
        </div>

        {/* Resumen de Reservas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reservas por Estado */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Reservas por Estado
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Pendientes</span>
                </div>
                <span className="font-medium text-gray-900">{estadisticas.reservasPendientes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Confirmadas</span>
                </div>
                <span className="font-medium text-gray-900">{estadisticas.reservasConfirmadas}</span>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas Adicionales */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Gestión Rápida
            </h3>
            <div className="space-y-2">
              <Button
                onClick={() => navigate('/admin/parqueaderos')}
                variant="outline"
                className="w-full justify-start"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Administrar Parqueaderos
              </Button>
              <Button
                onClick={() => navigate('/admin/tarifas')}
                variant="outline"
                className="w-full justify-start"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Configurar Tarifas
              </Button>
              <Button
                onClick={() => navigate('/admin/reportes')}
                variant="outline"
                className="w-full justify-start"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Ver Reportes
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