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
    <div className="fixed inset-0 z-[2000] bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between rounded-t-3xl z-10" style={{borderColor: 'var(--color-gray-200)'}}>
          <h2 className="text-xl font-bold" style={{color: 'var(--color-text-primary)'}}>Filtrar</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors hover:bg-gray-100"
            style={{color: 'var(--color-text-primary)'}}
            aria-label="Cerrar filtros"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Disponibilidad */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{color: 'var(--color-text-primary)'}}>
              Disponibilidad
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'ahora', label: 'Ahora' },
                { value: '30min', label: 'En 30 min' },
                { value: '1hora', label: 'En 1 hora' }
              ].map((option) => (
                <label 
                  key={option.value} 
                  className="relative flex items-center justify-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="disponibilidad"
                    value={option.value}
                    checked={filters.disponibilidad === option.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, disponibilidad: e.target.value }))}
                    className="sr-only peer"
                  />
                  <div 
                    className="w-full py-3 px-4 text-center text-sm font-medium rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: filters.disponibilidad === option.value ? 'var(--color-primary-600)' : 'var(--color-gray-300)',
                      backgroundColor: filters.disponibilidad === option.value ? 'var(--color-primary-50)' : 'transparent',
                      color: filters.disponibilidad === option.value ? 'var(--color-primary-700)' : 'var(--color-text-secondary)'
                    }}
                  >
                    {option.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Tipo de Espacio */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{color: 'var(--color-text-primary)'}}>
              Tipo de Espacio
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'cubierto', label: 'Cubierto' },
                { value: 'descubierto', label: 'Descubierto' },
                { value: 'garaje', label: 'Garaje' }
              ].map((option) => (
                <label key={option.value} className="relative cursor-pointer flex-1 min-w-[100px]">
                  <input
                    type="checkbox"
                    checked={filters.tipoEspacio.includes(option.value)}
                    onChange={() => handleTipoEspacioChange(option.value)}
                    className="sr-only peer"
                  />
                  <div 
                    className="py-3 px-4 text-center text-sm font-medium rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: filters.tipoEspacio.includes(option.value) ? 'var(--color-primary-600)' : 'var(--color-gray-300)',
                      backgroundColor: filters.tipoEspacio.includes(option.value) ? 'var(--color-primary-50)' : 'transparent',
                      color: filters.tipoEspacio.includes(option.value) ? 'var(--color-primary-700)' : 'var(--color-text-secondary)'
                    }}
                  >
                    {option.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Rango de Precio */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold" style={{color: 'var(--color-text-primary)'}}>
                Rango de Precio (Por Hora)
              </h3>
              <span className="text-lg font-bold" style={{color: 'var(--color-primary-600)'}}>
                ${filters.precioMax.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={filters.precioMax}
                onChange={(e) => setFilters(prev => ({ ...prev, precioMax: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: 'var(--color-primary-600)',
                  background: `linear-gradient(to right, var(--color-primary-600) 0%, var(--color-primary-600) ${((filters.precioMax - 1000) / 9000) * 100}%, var(--color-gray-200) ${((filters.precioMax - 1000) / 9000) * 100}%, var(--color-gray-200) 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-2" style={{color: 'var(--color-text-muted)'}}>
              <span>$1.000</span>
              <span>$10.000</span>
            </div>
          </div>

          {/* Distancia Máxima */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{color: 'var(--color-text-primary)'}}>
              Distancia Máxima
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 500, label: '500 m' },
                { value: 1000, label: '1 km' },
                { value: 2000, label: '2 km' },
                { value: 5000, label: '5 km' }
              ].map((option) => (
                <label key={option.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="distancia"
                    value={option.value}
                    checked={filters.distancia === option.value}
                    onChange={(e) => setFilters(prev => ({ ...prev, distancia: parseInt(e.target.value) }))}
                    className="sr-only peer"
                  />
                  <div 
                    className="py-3 px-2 text-center text-sm font-medium rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: filters.distancia === option.value ? 'var(--color-primary-600)' : 'var(--color-gray-300)',
                      backgroundColor: filters.distancia === option.value ? 'var(--color-primary-50)' : 'transparent',
                      color: filters.distancia === option.value ? 'var(--color-primary-700)' : 'var(--color-text-secondary)'
                    }}
                  >
                    {option.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Características Adicionales */}
          <div>
            <h3 className="text-sm font-semibold mb-4" style={{color: 'var(--color-text-primary)'}}>
              Características Adicionales
            </h3>
            <div className="space-y-4">
              {[
                { key: 'seguridad24', label: 'Seguridad 24/7' },
                { key: 'cargaElectrica', label: 'Carga Eléctrica' },
                { key: 'accesoDiscapacitados', label: 'Acceso para Discapacitados' }
              ].map((feature) => (
                <label 
                  key={feature.key} 
                  className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-colors hover:bg-gray-50"
                  style={{backgroundColor: filters[feature.key] ? 'var(--color-primary-50)' : 'transparent'}}
                >
                  <span className="text-sm font-medium" style={{color: 'var(--color-text-primary)'}}>
                    {feature.label}
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters[feature.key]}
                      onChange={(e) => setFilters(prev => ({ ...prev, [feature.key]: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div 
                      className="w-12 h-6 rounded-full transition-colors"
                      style={{backgroundColor: filters[feature.key] ? 'var(--color-primary-600)' : 'var(--color-gray-300)'}}
                    ></div>
                    <div 
                      className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-md"
                      style={{transform: filters[feature.key] ? 'translateX(24px)' : 'translateX(0)'}}
                    ></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2">
            <button
              onClick={handleReset}
              className="flex-1 py-4 rounded-2xl font-semibold transition-all hover:bg-gray-100"
              style={{
                border: '2px solid var(--color-primary-600)',
                color: 'var(--color-primary-700)',
                backgroundColor: 'transparent'
              }}
            >
              Limpiar
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: 'var(--color-primary-600)',
                color: 'var(--color-white)'
              }}
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