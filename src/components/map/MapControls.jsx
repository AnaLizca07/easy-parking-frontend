import { MapPin, Plus, Minus, Car, Bike } from 'lucide-react';

const MapControls = ({ 
  onZoomIn, 
  onZoomOut, 
  onLocateUser,
  vehicleType,
  onVehicleTypeChange,
  isLocating 
}) => {
  return (
    <>
      {/* Controles de zoom (top-right) */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={onZoomIn}
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Acercar"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onZoomOut}
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Alejar"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onLocateUser}
          className={`bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200 ${
            isLocating ? 'animate-pulse' : ''
          }`}
          aria-label="Mi ubicación"
          disabled={isLocating}
        >
          <MapPin
            className={`w-5 h-5 ${isLocating ? 'text-primary-600' : 'text-gray-700'}`}
          />
        </button>
      </div>

      {/* Selector de tipo de vehículo */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] flex gap-2 bg-white rounded-full p-1 shadow-lg border border-gray-200">
        <button
          onClick={() => onVehicleTypeChange('car')}
          className={`rounded-full p-3 transition-all ${
            vehicleType === 'car'
              ? 'bg-primary-600 shadow-sm'
              : 'bg-transparent hover:bg-gray-100'
          }`}
          aria-label="Buscar parqueadero para carro"
        >
          <Car className={`w-6 h-6 ${vehicleType === 'car' ? 'text-white' : 'text-gray-600'}`} />
        </button>
        <button
          onClick={() => onVehicleTypeChange('bike')}
          className={`rounded-full p-3 transition-all ${
            vehicleType === 'bike'
              ? 'bg-primary-600 shadow-sm'
              : 'bg-transparent hover:bg-gray-100'
          }`}
          aria-label="Buscar parqueadero para moto"
        >
          <Bike className={`w-6 h-6 ${vehicleType === 'bike' ? 'text-white' : 'text-gray-600'}`} />
        </button>
      </div>
    </>
  );
};

export default MapControls;