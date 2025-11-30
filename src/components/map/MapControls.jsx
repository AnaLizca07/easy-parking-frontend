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
          className="bg-primary-white rounded-full p-3 shadow-lg hover:bg-secondary-white transition-colors"
          aria-label="Acercar"
        >
          <Plus className="w-5 h-5 text-text-dark" />
        </button>
        <button
          onClick={onZoomOut}
          className="bg-primary-white rounded-full p-3 shadow-lg hover:bg-secondary-white transition-colors"
          aria-label="Alejar"
        >
          <Minus className="w-5 h-5 text-text-dark" />
        </button>
        <button
          onClick={onLocateUser}
          className={`bg-primary-white rounded-full p-3 shadow-lg hover:bg-secondary-white transition-colors ${
            isLocating ? 'animate-pulse' : ''
          }`}
          aria-label="Mi ubicación"
          disabled={isLocating}
        >
          <MapPin 
            className={`w-5 h-5 ${isLocating ? 'text-info-blue' : 'text-text-dark'}`} 
          />
        </button>
      </div>

      {/* Selector de tipo de vehículo */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] flex gap-2 bg-text-dark rounded-full p-1 shadow-lg">
        <button
          onClick={() => onVehicleTypeChange('car')}
          className={`rounded-full p-3 transition-all ${
            vehicleType === 'car'
              ? 'bg-info-blue'
              : 'bg-transparent hover:bg-text-secondary'
          }`}
          aria-label="Buscar parqueadero para carro"
        >
          <Car className="w-6 h-6 text-primary-white" />
        </button>
        <button
          onClick={() => onVehicleTypeChange('bike')}
          className={`rounded-full p-3 transition-all ${
            vehicleType === 'bike'
              ? 'bg-info-blue'
              : 'bg-transparent hover:bg-text-secondary'
          }`}
          aria-label="Buscar parqueadero para moto"
        >
          <Bike className="w-6 h-6 text-primary-white" />
        </button>
      </div>
    </>
  );
};

export default MapControls;