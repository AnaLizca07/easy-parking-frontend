import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Car,
  DollarSign,
  Search,
  Filter,
  ChevronRight,
  Navigation
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';
import Badge from '../components/common/Badge';
import PageLayout from '../components/layout/PageLayout';
import { mockParqueaderosService } from '../api/mockParqueaderoService';
import { mockTarifasService } from '../api/mockTarifasService';
// import { useGeolocation } from '../hooks/useGeolocation';

const SeleccionarParqueadero = () => {
  const navigate = useNavigate();
  // const { location: userLocation, getCurrentLocation } = useGeolocation();
  const userLocation = null;

  const [loading, setLoading] = useState(true);
  const [parqueaderos, setParqueaderos] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [filteredParqueaderos, setFilteredParqueaderos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    disponibilidad: '',
    vehicleType: 'car',
    seguridad24: false,
    cargaElectrica: false,
    accesoDiscapacitados: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [parqueaderos, searchText, filters, userLocation]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const filterParams = {
        ...filters,
        searchText,
        userLocation
      };

      const [parqueaderosResult, tarifasResult] = await Promise.all([
        mockParqueaderosService.getParqueaderos(filterParams),
        mockTarifasService.listarTarifas()
      ]);

      setParqueaderos(parqueaderosResult.data || []);
      setTarifas(tarifasResult || []);
    } catch (err) {
      setError('Error al cargar los parqueaderos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...parqueaderos];

    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre.toLowerCase().includes(search) ||
        p.direccion.toLowerCase().includes(search)
      );
    }

    setFilteredParqueaderos(filtered);
  };

  const getTarifaById = (tarifaId) => {
    return tarifas.find(t => t.id === tarifaId);
  };

  const handleParqueaderoSelect = (parqueadero) => {
    navigate(`/reserva/nuevo/${parqueadero.id}`);
  };

  const handleSearch = () => {
    fetchData();
  };

  const handleGetLocation = async () => {
    setError('Función de geolocalización temporalmente deshabilitada');
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <PageLayout title="Seleccionar Parqueadero" showBackButton={true} onBackClick={() => navigate(-1)}>
      <div className="bg-secondary-white min-h-full">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="mb-4">
              <p className="text-sm text-text-secondary">
                {filteredParqueaderos.length} parqueadero{filteredParqueaderos.length !== 1 ? 's' : ''} disponible{filteredParqueaderos.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre o dirección..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={handleGetLocation}>
                <Navigation className="w-4 h-4" />
              </Button>
            </div>

            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Disponibilidad
                    </label>
                    <select
                      value={filters.disponibilidad}
                      onChange={(e) => setFilters(prev => ({ ...prev, disponibilidad: e.target.value }))}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Todos</option>
                      <option value="ahora">Disponible ahora</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Tipo de vehículo
                    </label>
                    <select
                      value={filters.vehicleType}
                      onChange={(e) => setFilters(prev => ({ ...prev, vehicleType: e.target.value }))}
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="car">Automóvil</option>
                      <option value="motorcycle">Motocicleta</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={filters.seguridad24}
                      onChange={(e) => setFilters(prev => ({ ...prev, seguridad24: e.target.checked }))}
                      className="mr-2 rounded"
                    />
                    Seguridad 24/7
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={filters.cargaElectrica}
                      onChange={(e) => setFilters(prev => ({ ...prev, cargaElectrica: e.target.checked }))}
                      className="mr-2 rounded"
                    />
                    Carga eléctrica
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={filters.accesoDiscapacitados}
                      onChange={(e) => setFilters(prev => ({ ...prev, accesoDiscapacitados: e.target.checked }))}
                      className="mr-2 rounded"
                    />
                    Acceso discapacitados
                  </label>
                </div>

                <Button variant="primary" size="sm" onClick={handleSearch}>
                  Aplicar filtros
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          {filteredParqueaderos.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-dark mb-2">
                No se encontraron parqueaderos
              </h3>
              <p className="text-text-secondary mb-4">
                Prueba ajustando los filtros de búsqueda o ampliando el área de búsqueda.
              </p>
              <Button variant="outline" onClick={() => setShowFilters(true)}>
                <Filter className="w-4 h-4 mr-2" />
                Ajustar filtros
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredParqueaderos.map((parqueadero) => {
                const tarifa = getTarifaById(parqueadero.tarifa_id);

                return (
                  <button
                    key={parqueadero.id}
                    onClick={() => handleParqueaderoSelect(parqueadero)}
                    className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-info-blue transition-all text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-text-dark">{parqueadero.nombre}</h3>
                          <Badge
                            variant={parqueadero.espacios_disponibles > 0 ? 'success' : 'error'}
                            text={`${parqueadero.espacios_disponibles} disponibles`}
                          />
                          {parqueadero.solo_motos && (
                            <Badge variant="info" text="Solo motos" />
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-text-secondary mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{parqueadero.direccion}</span>
                          {parqueadero.distancia && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-sm font-medium text-info-blue">
                                {formatDistance(parqueadero.distancia)}
                              </span>
                            </>
                          )}
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
                              <span className="font-semibold text-success-quindio">
                                ${tarifa.precio_hora.toLocaleString()}/hora
                              </span>
                            </div>
                          )}
                        </div>

                        {parqueadero.caracteristicas && parqueadero.caracteristicas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {parqueadero.caracteristicas.slice(0, 3).map((caracteristica, index) => (
                              <Badge
                                key={index}
                                variant="neutral"
                                text={caracteristica}
                              />
                            ))}
                            {parqueadero.caracteristicas.length > 3 && (
                              <Badge
                                variant="neutral"
                                text={`+${parqueadero.caracteristicas.length - 3} más`}
                              />
                            )}
                          </div>
                        )}
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SeleccionarParqueadero;