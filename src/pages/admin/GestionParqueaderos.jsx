import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  MapPin,
  Clock,
  Car,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  DollarSign,
  Minus,
  UserPlus
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import PageLayout from '../../components/layout/PageLayout';
import { mockParqueaderosService } from '../../api/mockParqueaderoService';
import { mockTarifasService } from '../../api/mockTarifasService';
import { useAuth } from '../../hooks/useAuth';

const GestionParqueaderos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [parqueaderos, setParqueaderos] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [adjustingSpaces, setAdjustingSpaces] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [searchText, selectedTipo, user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (!user || !user.id) {
        throw new Error('Usuario no autenticado');
      }

      const filters = {
        searchText,
        tipo: selectedTipo
      };

      const [parqueaderosResult, tarifasResult] = await Promise.all([
        mockParqueaderosService.getParqueaderosByCreador(user.id, filters),
        mockTarifasService.listarTarifas()
      ]);

      setParqueaderos(parqueaderosResult.data || []);
      setTarifas(tarifasResult || []);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // El filtrado ahora se hace en el servidor a través de getParqueaderosByCreador

  const getTarifaById = (tarifaId) => {
    return tarifas.find(t => t.id === tarifaId);
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await mockParqueaderosService.deleteParqueadero(id, user.id);
      setParqueaderos(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Error al eliminar el parqueadero: ' + err.message);
    }
  };

  const handleAdjustSpaces = async (parqueaderoId, operacion) => {
    try {
      setAdjustingSpaces(parqueaderoId);
      setError('');

      const result = await mockParqueaderosService.ajustarEspaciosDisponibles(
        parqueaderoId,
        operacion,
        user.id
      );

      // Actualizar el parqueadero en la lista local
      setParqueaderos(prev => prev.map(p =>
        p.id === parqueaderoId
          ? { ...p, espacios_disponibles: result.data.espacios_disponibles }
          : p
      ));

      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      setError('Error al ajustar espacios: ' + err.message);
    } finally {
      setAdjustingSpaces(null);
    }
  };

  const tiposParqueadero = [...new Set(parqueaderos.map(p => p.tipo))];

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <PageLayout title="Gestión de Parqueaderos" showBackButton={true} onBackClick={() => navigate('/admin')}>
      <div className="bg-secondary-white min-h-full">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-text-secondary">
                  {parqueaderos.length} parqueadero{parqueaderos.length !== 1 ? 's' : ''} registrado{parqueaderos.length !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  💡 Usa los botones <span className="text-red-600">➖</span> y <span className="text-green-600">➕</span> para ajustar espacios cuando clientes lleguen sin reserva o se vayan
                </p>
              </div>
              <Link to="/admin/parqueaderos/nuevo">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Parqueadero
                </Button>
              </Link>
            </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar parqueaderos..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info-blue focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {tiposParqueadero.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

        {parqueaderos.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-dark mb-2">
              {parqueaderos.length === 0 ? 'No hay parqueaderos' : 'No se encontraron resultados'}
            </h3>
            <p className="text-text-secondary mb-4">
              {parqueaderos.length === 0
                ? 'Comienza creando tu primer parqueadero'
                : 'Prueba con otros términos de búsqueda o filtros'
              }
            </p>
            {parqueaderos.length === 0 && (
              <Link to="/admin/parqueaderos/nuevo">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primer parqueadero
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {parqueaderos.map((parqueadero) => {
              const tarifa = getTarifaById(parqueadero.tarifa_id);

              return (
                <div key={parqueadero.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-text-dark">{parqueadero.nombre}</h3>
                        <Badge
                          variant={parqueadero.espacios_disponibles > 0 ? 'success' : 'error'}
                          text={`${parqueadero.espacios_disponibles}/${parqueadero.total_spaces} disponibles`}
                        />
                        {parqueadero.solo_motos && (
                          <Badge variant="info" text="Solo motos" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-text-secondary mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{parqueadero.direccion}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{parqueadero.horario_apertura} - {parqueadero.horario_cierre}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="w-4 h-4" />
                          <span>{parqueadero.tipo}</span>
                        </div>
                        {tarifa && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${tarifa.precio_hora.toLocaleString()}/hora</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {/* Controles de espacios */}
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdjustSpaces(parqueadero.id, 'reducir')}
                          disabled={parqueadero.espacios_disponibles === 0 || adjustingSpaces === parqueadero.id}
                          title="Reducir espacio (cliente sin reserva)"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdjustSpaces(parqueadero.id, 'aumentar')}
                          disabled={parqueadero.espacios_disponibles === parqueadero.total_spaces || adjustingSpaces === parqueadero.id}
                          title="Aumentar espacio (cliente se fue)"
                          className="text-green-600 hover:bg-green-50"
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Controles de gestión */}
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/parqueadero/${parqueadero.id}`)}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/parqueaderos/${parqueadero.id}/editar`)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteConfirm(parqueadero.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {parqueadero.caracteristicas && parqueadero.caracteristicas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {parqueadero.caracteristicas.map((caracteristica, index) => (
                        <Badge
                          key={index}
                          variant="neutral"
                          text={caracteristica}
                        />
                      ))}
                    </div>
                  )}

                  {parqueadero.fecha_creacion && (
                    <div className="mt-3 text-xs text-text-secondary">
                      Creado: {new Date(parqueadero.fecha_creacion).toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text-dark mb-2">Confirmar eliminación</h3>
            <p className="text-text-secondary mb-4">
              ¿Estás seguro de que deseas eliminar este parqueadero? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteConfirm(deleteConfirm)}
                className="flex-1"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PageLayout>
  );
};

export default GestionParqueaderos;