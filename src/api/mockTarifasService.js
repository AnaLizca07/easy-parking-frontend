// RUTA: src/api/mockTarifasService.js
// Servicio mock para manejo de tarifas con persistencia en localStorage

// Clave para almacenamiento en localStorage
const TARIFAS_STORAGE_KEY = 'easyParking_tarifas';
const NEXT_ID_STORAGE_KEY = 'easyParking_tarifas_nextId';

// Datos iniciales por defecto
const datosInicialesPorDefecto = [
  {
    id: 1,
    precio_hora: 3000,
    precio_mensualidad: 90000,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    precio_hora: 2500,
    precio_mensualidad: 75000,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    precio_hora: 5000,
    precio_mensualidad: 150000,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 4,
    precio_hora: 2000,
    precio_mensualidad: 60000,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 5,
    precio_hora: 3500,
    precio_mensualidad: 105000,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 6,
    precio_hora: 1500,
    precio_mensualidad: 45000,
    created_at: '2025-01-01T00:00:00Z'
  }
];

// Funciones para manejo de localStorage
const cargarTarifas = () => {
  try {
    const tarifasGuardadas = localStorage.getItem(TARIFAS_STORAGE_KEY);
    return tarifasGuardadas ? JSON.parse(tarifasGuardadas) : datosInicialesPorDefecto;
  } catch (error) {
    console.warn('Error al cargar tarifas desde localStorage:', error);
    return datosInicialesPorDefecto;
  }
};

const guardarTarifas = (tarifas) => {
  try {
    localStorage.setItem(TARIFAS_STORAGE_KEY, JSON.stringify(tarifas));
  } catch (error) {
    console.error('Error al guardar tarifas en localStorage:', error);
  }
};

const cargarNextId = () => {
  try {
    const nextId = localStorage.getItem(NEXT_ID_STORAGE_KEY);
    return nextId ? parseInt(nextId) : 7;
  } catch (error) {
    console.warn('Error al cargar nextId desde localStorage:', error);
    return 7;
  }
};

const guardarNextId = (id) => {
  try {
    localStorage.setItem(NEXT_ID_STORAGE_KEY, id.toString());
  } catch (error) {
    console.error('Error al guardar nextId en localStorage:', error);
  }
};

// Variables globales que se sincronizan con localStorage
let tarifas = cargarTarifas();
let nextId = cargarNextId();

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockTarifasService = {
  // Crear nueva tarifa
  async crearTarifa(data) {
    await delay(500);

    // Recargar datos desde localStorage
    tarifas = cargarTarifas();
    nextId = cargarNextId();

    const nuevaTarifa = {
      id: nextId,
      precio_hora: data.precio_hora,
      precio_mensualidad: data.precio_mensualidad || null,
      created_at: new Date().toISOString()
    };

    tarifas.push(nuevaTarifa);
    nextId++;

    // Guardar en localStorage
    guardarTarifas(tarifas);
    guardarNextId(nextId);

    console.log('✅ Nueva tarifa creada y guardada:', nuevaTarifa);
    return nuevaTarifa;
  },

  // Listar todas las tarifas
  async listarTarifas() {
    await delay(300);
    // Recargar datos desde localStorage
    tarifas = cargarTarifas();
    return [...tarifas];
  },

  // Obtener tarifa por ID
  async obtenerTarifaPorId(id) {
    await delay(200);
    // Recargar datos desde localStorage
    tarifas = cargarTarifas();
    const tarifa = tarifas.find(t => t.id === parseInt(id));
    if (!tarifa) {
      throw new Error('Tarifa no encontrada');
    }
    return tarifa;
  },

  // Actualizar tarifa
  async actualizarTarifa(id, data) {
    await delay(500);

    // Recargar datos desde localStorage
    tarifas = cargarTarifas();

    const index = tarifas.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
      throw new Error('Tarifa no encontrada');
    }

    tarifas[index] = {
      ...tarifas[index],
      ...data,
      updated_at: new Date().toISOString()
    };

    // Guardar cambios en localStorage
    guardarTarifas(tarifas);
    console.log('✅ Tarifa actualizada y guardada:', tarifas[index]);

    return tarifas[index];
  },

  // Eliminar tarifa
  async eliminarTarifa(id) {
    await delay(300);

    // Recargar datos desde localStorage
    tarifas = cargarTarifas();

    const index = tarifas.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
      throw new Error('Tarifa no encontrada');
    }

    const tarifaEliminada = tarifas.splice(index, 1)[0];

    // Guardar cambios en localStorage
    guardarTarifas(tarifas);
    console.log('✅ Tarifa eliminada:', tarifaEliminada);

    return { message: 'Tarifa eliminada exitosamente' };
  },

  // Función utilitaria para limpiar datos (desarrollo)
  limpiarDatos() {
    localStorage.removeItem(TARIFAS_STORAGE_KEY);
    localStorage.removeItem(NEXT_ID_STORAGE_KEY);
    tarifas = cargarTarifas();
    nextId = cargarNextId();
    console.log('🗑️ Datos de tarifas limpiados');
  }
};