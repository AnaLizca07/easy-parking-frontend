import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/map/MapView';
import MapControls from '../components/map/MapControls';
import SearchBar from '../components/map/SearchBar';
import FilterPanel from '../components/filters/FilterPanel';
import GlobalNavigation from '../components/navigation/GlobalNavigation';
import { useGeolocation } from '../hooks/useGeolocation';
import { mockParqueaderosService } from '../api/mockParqueaderoService';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';

const Home = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  // Estado de geolocalización
  const { location: userLocation, loading: locationLoading, error: locationError, refetch: refetchLocation } = useGeolocation();

  // Estado del tipo de vehículo
  const [vehicleType, setVehicleType] = useState('car');

  // Estado de búsqueda y filtros
  const [searchText, setSearchText] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState({
    disponibilidad: 'ahora',
    tipoEspacio: [],
    precioMax: 10000,
    distancia: 5000,
    seguridad24: false,
    cargaElectrica: false,
    accesoDiscapacitados: false,
  });

  // Estado de parqueaderos
  const [parqueaderos, setParqueaderos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParqueadero, setSelectedParqueadero] = useState(null);


  // Cargar parqueaderos cuando cambian los filtros, vehículo o búsqueda
  useEffect(() => {
    loadParqueaderos();
  }, [vehicleType, filters, searchText, userLocation]);


  const loadParqueaderos = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterParams = {
        ...filters,
        vehicleType,
        searchText,
        userLocation: userLocation ? {
          lat: userLocation.lat,
          lng: userLocation.lng
        } : null,
      };

      const response = await mockParqueaderosService.getParqueaderos(filterParams);
      setParqueaderos(response.data);
    } catch (err) {
      setError('Error al cargar los parqueaderos. Por favor, intenta de nuevo.');
      console.error('Error loading parqueaderos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers de controles del mapa
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  };

  const handleLocateUser = () => {
    refetchLocation();
  };

  const handleVehicleTypeChange = (type) => {
    setVehicleType(type);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
  };

  const handleFilterClick = () => {
    setIsFilterPanelOpen(true);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleMarkerClick = (parqueadero) => {
    setSelectedParqueadero(parqueadero);
    // Solo seleccionar el parqueadero, no navegar automáticamente
  };

  const handleReservarClick = (parqueadero) => {
    // Navegar a crear reserva cuando se haga click en el botón
    navigate(`/reserva/nuevo/${parqueadero.id}`);
  };


  // Preparar ubicación del usuario en formato [lat, lng]
  const userLocationArray = userLocation ? [userLocation.lat, userLocation.lng] : null;

  return (
    <div className="h-screen w-screen flex flex-col bg-primary-white overflow-hidden">
      {/* Header con navegación */}
      <div className="w-full bg-text-dark px-4 py-3 flex items-center gap-2">
        {/* Navegación global */}
        <GlobalNavigation />

        {/* Título de la página */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-primary-white font-semibold text-lg">Easy Parking</h1>
        </div>

        {/* Espaciador */}
        <div className="w-12"></div>
      </div>

      {/* Barra de búsqueda */}
      <SearchBar
        onSearchChange={handleSearchChange}
        onFilterClick={handleFilterClick}
        searchValue={searchText}
      />

      {/* Contenedor del mapa */}
      <div className="flex-1 relative">
        {/* Spinner de carga */}
        {loading && (
          <div className="absolute inset-0 z-[1500] bg-primary-white bg-opacity-75 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error de ubicación */}
        {locationError && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1500] max-w-md">
            <Alert type="warning">
              No se pudo obtener tu ubicación. Mostrando todos los parqueaderos.
            </Alert>
          </div>
        )}

        {/* Error de carga */}
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1500] max-w-md">
            <Alert type="error">{error}</Alert>
          </div>
        )}

        {/* Mapa */}
        <MapView
          parqueaderos={parqueaderos}
          userLocation={userLocationArray}
          onMarkerClick={handleMarkerClick}
          onReservarClick={handleReservarClick}
          selectedParqueadero={selectedParqueadero}
        />

        {/* Controles del mapa */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onLocateUser={handleLocateUser}
          vehicleType={vehicleType}
          onVehicleTypeChange={handleVehicleTypeChange}
          isLocating={locationLoading}
        />

        {/* Badge con número de resultados */}
        {!loading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-primary-white rounded-full px-4 py-2 shadow-lg">
            <span className="text-sm font-medium text-text-dark">
              {parqueaderos.length} {parqueaderos.length === 1 ? 'parqueadero encontrado' : 'parqueaderos encontrados'}
            </span>
          </div>
        )}
      </div>

      {/* Panel de filtros */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />
    </div>
  );
};

export default Home;