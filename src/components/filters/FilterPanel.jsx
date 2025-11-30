import { X } from 'lucide-react';
import { useState } from 'react';

const FilterPanel = ({ isOpen, onClose, onApplyFilters, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    disponibilidad: initialFilters.disponibilidad || 'ahora',
    tipoEspacio: initialFilters.tipoEspacio || ['cubierto'],
    precioMax: initialFilters.precioMax || 5000,
    distancia: initialFilters.distancia || 500,
    seguridad24: initialFilters.seguridad24 || false,
    cargaElectrica: initialFilters.cargaElectrica || false,
    accesoDiscapacitados: initialFilters.accesoDiscapacitados || false,
  });

  const handleTipoEspacioChange = (tipo) => {
    setFilters(prev => ({
      ...prev,
      tipoEspacio: prev.tipoEspacio.includes(tipo)
        ? prev.tipoEspacio.filter(t => t !== tipo)
        : [...prev.tipoEspacio, tipo]
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      disponibilidad: 'ahora',
      tipoEspacio: [],
      precioMax: 5000,
      distancia: 500,
      seguridad24: false,
      cargaElectrica: false,
      accesoDiscapacitados: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-text-dark bg-opacity-50">
      <div className="absolute inset-x-0 bottom-0 bg-primary-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary-white border-b border-secondary-white px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-dark">Filtrar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-white rounded-full transition-colors"
            aria-label="Cerrar filtros"
          >
            <X className="w-5 h-5 text-text-dark" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Disponibilidad */}
          <div>
            <h3 className="text-base font-medium text-text-dark mb-3">Disponibilidad</h3>
            <div className="flex gap-4">
              {[
                { value: 'ahora', label: 'Ahora' },
                { value: '30min', label: 'En 30 min' },
                { value: '1hora', label: 'En 1 hora' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="disponibilidad"
                    value={option.value}
                    checked={filters.disponibilidad === option.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, disponibilidad: e.target.value }))}
                    className="w-5 h-5 text-info-blue accent-info-blue"
                  />
                  <span className="text-sm text-text-dark">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tipo de Espacio */}
          <div>
            <h3 className="text-base font-medium text-text-dark mb-3">Tipo de Espacio</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'cubierto', label: 'Cubierto' },
                { value: 'descubierto', label: 'Descubierto' },
                { value: 'garaje', label: 'Garaje' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.tipoEspacio.includes(option.value)}
                    onChange={() => handleTipoEspacioChange(option.value)}
                    className="w-5 h-5 text-info-blue accent-info-blue rounded"
                  />
                  <span className="text-sm text-text-dark">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rango de Precio */}
          <div>
            <h3 className="text-base font-medium text-text-dark mb-3">
              Rango de Precio (Por Hora)
            </h3>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={filters.precioMax}
              onChange={(e) => setFilters(prev => ({ ...prev, precioMax: parseInt(e.target.value) }))}
              className="w-full h-2 bg-secondary-white rounded-lg appearance-none cursor-pointer accent-info-blue"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-2">
              <span>$1.000</span>
              <span className="font-semibold text-text-dark">${filters.precioMax.toLocaleString()}</span>
              <span>$10.000</span>
            </div>
          </div>

          {/* Distancia Máxima */}
          <div>
            <h3 className="text-base font-medium text-text-dark mb-3">Distancia Máxima</h3>
            <div className="flex gap-4">
              {[
                { value: 500, label: '500 m' },
                { value: 1000, label: '1 km' },
                { value: 2000, label: '2 km' },
                { value: 5000, label: '5 km' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="distancia"
                    value={option.value}
                    checked={filters.distancia === option.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, distancia: parseInt(e.target.value) }))}
                    className="w-5 h-5 text-info-blue accent-info-blue"
                  />
                  <span className="text-sm text-text-dark">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Características Adicionales */}
          <div>
            <h3 className="text-base font-medium text-text-dark mb-3">
              Características Adicionales
            </h3>
            <div className="space-y-3">
              {[
                { key: 'seguridad24', label: 'Seguridad 24/7' },
                { key: 'cargaElectrica', label: 'Carga Eléctrica' },
                { key: 'accesoDiscapacitados', label: 'Acceso para Discapacitados' }
              ].map((feature) => (
                <label key={feature.key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-text-dark">{feature.label}</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters[feature.key]}
                      onChange={(e) => setFilters(prev => ({ ...prev, [feature.key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-text-secondary rounded-full peer peer-checked:bg-info-blue transition-colors"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-primary-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleReset}
              className="flex-1 py-3 border-2 border-text-secondary text-text-dark rounded-lg font-medium hover:bg-secondary-white transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 bg-info-blue text-primary-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;