import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar la geolocalización del usuario
const UserLocationMarker = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, {
        duration: 1.5
      });
    }
  }, [position, map]);

  if (!position) return null;

  // Icono personalizado para la ubicación del usuario
  const userIcon = L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #0066CC;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>Tu ubicación actual</Popup>
    </Marker>
  );
};

// Componente principal del mapa
const MapView = ({ parqueaderos = [], userLocation, onMarkerClick, onReservarClick, selectedParqueadero }) => {
  // Centro por defecto: Armenia, Quindío, Colombia
  const defaultCenter = [4.5389, -75.6811];
  const center = userLocation || defaultCenter;

  // Crear iconos personalizados según disponibilidad
  const createCustomIcon = (disponibilidad) => {
    let color;
    if (disponibilidad > 5) {
      color = '#196619'; // success-quindio
    } else if (disponibilidad > 0) {
      color = '#FFD700'; // warning-quindio
    } else {
      color = '#6C757D'; // text-secondary (sin espacios)
    }

    return L.divIcon({
      className: 'parking-marker',
      html: `
        <div style="
          width: 36px;
          height: 36px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          font-size: 18px;
          cursor: pointer;
          transform: scale(1);
          transition: transform 0.2s;
        "
        onmouseover="this.style.transform='scale(1.1)'"
        onmouseout="this.style.transform='scale(1)'"
        title="Click para ver detalles"
        >
          🅿️
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marcador de ubicación del usuario */}
      <UserLocationMarker position={userLocation} />

      {/* Marcadores de parqueaderos */}
      {parqueaderos.map((parqueadero) => (
        <Marker
          key={parqueadero.id}
          position={[parqueadero.coordenadas.lat, parqueadero.coordenadas.lng]}
          icon={createCustomIcon(parqueadero.espacios_disponibles)}
          eventHandlers={{
            click: () => onMarkerClick(parqueadero)
          }}
        >
          <Popup>
            <div className="text-sm min-w-[200px]">
              <h3 className="font-semibold text-text-dark mb-2">
                {parqueadero.nombre}
              </h3>
              <p className="text-text-secondary text-xs mb-2">
                {parqueadero.direccion}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium ${
                  parqueadero.espacios_disponibles > 5
                    ? 'text-success-quindio'
                    : parqueadero.espacios_disponibles > 0
                    ? 'text-warning-quindio'
                    : 'text-text-secondary'
                }`}>
                  {parqueadero.espacios_disponibles} espacios disponibles
                </span>
              </div>
              <p className="text-text-dark font-semibold text-xs mb-3">
                Tipo: {parqueadero.tipo}
              </p>
              {parqueadero.espacios_disponibles > 0 && (
                <div className="text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReservarClick(parqueadero);
                    }}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors w-full"
                  >
                    🅿️ Reservar ahora
                  </button>
                </div>
              )}
              {parqueadero.espacios_disponibles === 0 && (
                <div className="text-center">
                  <span className="text-gray-500 text-xs">
                    Sin espacios disponibles
                  </span>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;