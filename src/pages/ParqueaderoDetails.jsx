// ParqueaderoDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Car,
  Shield,
  Zap,
  Accessibility,
  Star,
  Navigation,
  Phone,
  Calendar,
} from 'lucide-react';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import PageLayout from '../components/layout/PageLayout';
import 'leaflet/dist/leaflet.css';

const ParqueaderoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parqueadero, setParqueadero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParqueadero = async () => {
      try {
        setLoading(true);
        // Simulación de obtener datos del parqueadero
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Datos mock basados en el ID
        const parqueaderos = {
          'p1': {
            id: 'p1',
            nombre: 'Parqueadero Centro',
            descripcion: 'Parqueadero techado en el centro de Armenia, ideal para compras y trámites. Espacioso y seguro.',
            direccion: 'Cra 14 #15-25',
            coordenadas: [4.5339, -75.6811],
            precio: 3000,
            disponibilidad: 15,
            capacidadTotal: 50,
            tipo: 'Cubierto',
            horario: '24 horas',
            telefono: '+57 312 456 7890',
            calificacion: 4.5,
            numeroCalificaciones: 127,
            caracteristicas: ['Seguridad 24/7', 'Acceso para Discapacitados'],
            servicios: ['Vigilancia', 'Cámaras de seguridad', 'Iluminación LED', 'Baños'],
            tiposVehiculo: ['carro', 'moto'],
            imagenes: [
              'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
              'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
              'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=800',
            ],
          },
          'p3': {
            id: 'p3',
            nombre: 'Garaje Premium',
            descripcion: 'Garaje privado con todos los servicios incluidos. El mejor servicio de la ciudad con estación de carga eléctrica.',
            direccion: 'Av. Bolívar #20-45',
            coordenadas: [4.5419, -75.6741],
            precio: 5000,
            disponibilidad: 25,
            capacidadTotal: 80,
            tipo: 'Garaje',
            horario: '24 horas',
            telefono: '+57 310 123 4567',
            calificacion: 4.8,
            numeroCalificaciones: 243,
            caracteristicas: ['Seguridad 24/7', 'Carga Eléctrica', 'Acceso para Discapacitados'],
            servicios: ['Lavado de vehículos', 'Estación de carga', 'WiFi gratis', 'Sala de espera', 'Cafetería'],
            tiposVehiculo: ['carro', 'moto'],
            imagenes: [
              'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
              'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
            ],
          },
          'p5': {
            id: 'p5',
            nombre: 'AutoParque Norte',
            descripcion: 'Parqueadero moderno en la zona norte de la ciudad. Excelente ubicación y tarifas competitivas.',
            direccion: 'Cll 23 #18-60',
            coordenadas: [4.5389, -75.6741],
            precio: 3500,
            disponibilidad: 8,
            capacidadTotal: 60,
            tipo: 'Cubierto',
            horario: '6:00 AM - 10:00 PM',
            telefono: '+57 315 987 6543',
            calificacion: 4.3,
            numeroCalificaciones: 89,
            caracteristicas: ['Seguridad 24/7', 'Carga Eléctrica'],
            servicios: ['Vigilancia', 'Cámaras', 'Estación de carga'],
            tiposVehiculo: ['carro', 'moto'],
            imagenes: [
              'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800',
            ],
          },
        };
        
        const data = parqueaderos[id];
        if (!data) {
          throw new Error('Parqueadero no encontrado');
        }
        
        setParqueadero(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParqueadero();
  }, [id]);

  const handleReservar = () => {
    navigate(`/reservar/${id}`);
  };

  const handleVerEnMapa = () => {
    // Redirigir al home con el parqueadero centrado
    navigate('/', { state: { centrarParqueadero: id } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
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

  const disponibilidadPorcentaje = (parqueadero.disponibilidad / parqueadero.capacidadTotal) * 100;
  let disponibilidadColor = 'success-quindio';
  let disponibilidadTexto = 'Alta disponibilidad';
  
  if (disponibilidadPorcentaje < 20) {
    disponibilidadColor = 'red-600';
    disponibilidadTexto = 'Casi lleno';
  } else if (disponibilidadPorcentaje < 50) {
    disponibilidadColor = 'warning-quindio';
    disponibilidadTexto = 'Disponibilidad media';
  }

  return (
    <PageLayout title={parqueadero.nombre} showBackButton={true} onBackClick={() => navigate(-1)}>
      <div className="bg-secondary-white pb-20">
        {/* Header con imagen principal */}
        <div className="relative h-64 bg-gray-300">
          <img
            src={parqueadero.imagenes[0]}
            alt={parqueadero.nombre}
            className="w-full h-full object-cover"
          />
        </div>

      {/* Información principal */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-text-dark mb-2">
              {parqueadero.nombre}
            </h1>
            <div className="flex items-center gap-2 text-text-secondary mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{parqueadero.direccion}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning-quindio fill-current" />
              <span className="font-semibold">{parqueadero.calificacion}</span>
              <span className="text-text-secondary text-sm">
                ({parqueadero.numeroCalificaciones} reseñas)
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-info-blue">
              ${parqueadero.precio.toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary">por hora</div>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-text-secondary mb-6">{parqueadero.descripcion}</p>

        {/* Disponibilidad */}
        <div className={`bg-${disponibilidadColor} bg-opacity-10 border border-${disponibilidadColor} rounded-lg p-4 mb-6`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-text-dark">{disponibilidadTexto}</span>
            <span className={`text-${disponibilidadColor} font-bold`}>
              {parqueadero.disponibilidad} / {parqueadero.capacidadTotal} espacios
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-${disponibilidadColor} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${disponibilidadPorcentaje}%` }}
            />
          </div>
        </div>

        {/* Información básica */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-text-secondary mb-1">
              <Car className="w-5 h-5" />
              <span className="text-sm">Tipo</span>
            </div>
            <p className="font-semibold">{parqueadero.tipo}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-text-secondary mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Horario</span>
            </div>
            <p className="font-semibold">{parqueadero.horario}</p>
          </div>
        </div>

        {/* Características */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-dark mb-3">Características</h3>
          <div className="flex flex-wrap gap-2">
            {parqueadero.caracteristicas.map((car, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm"
              >
                {car === 'Seguridad 24/7' && <Shield className="w-4 h-4 text-success-quindio" />}
                {car === 'Carga Eléctrica' && <Zap className="w-4 h-4 text-warning-quindio" />}
                {car === 'Acceso para Discapacitados' && <Accessibility className="w-4 h-4 text-info-blue" />}
                <span className="text-sm">{car}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-dark mb-3">Servicios adicionales</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <ul className="space-y-2">
              {parqueadero.servicios.map((servicio, idx) => (
                <li key={idx} className="flex items-center gap-2 text-text-secondary">
                  <div className="w-2 h-2 bg-success-quindio rounded-full" />
                  {servicio}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mapa */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-text-dark mb-3">Ubicación</h3>
          <div className="rounded-lg overflow-hidden shadow-sm" style={{ height: '250px' }}>
            <MapContainer
              center={parqueadero.coordenadas}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={parqueadero.coordenadas}>
                <Popup>{parqueadero.nombre}</Popup>
              </Marker>
            </MapContainer>
          </div>
          <Button
            onClick={handleVerEnMapa}
            variant="outline"
            className="w-full mt-3"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Cómo llegar
          </Button>
        </div>

        {/* Contacto */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="flex items-center gap-2 text-text-secondary mb-2">
            <Phone className="w-5 h-5" />
            <span className="font-semibold">Contacto</span>
          </div>
          <a
            href={`tel:${parqueadero.telefono}`}
            className="text-info-blue hover:underline"
          >
            {parqueadero.telefono}
          </a>
        </div>
      </div>

        {/* Botón de reserva fijo en la parte inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <Button
            onClick={handleReservar}
            variant="primary"
            className="w-full py-3 text-lg"
            disabled={parqueadero.disponibilidad === 0}
          >
            <Calendar className="w-5 h-5 mr-2" />
            {parqueadero.disponibilidad === 0 ? 'No hay espacios disponibles' : 'Reservar ahora'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ParqueaderoDetails;