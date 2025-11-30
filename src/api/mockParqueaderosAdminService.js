// RUTA: src/api/mockParqueaderosAdminService.js
// Servicio mock extendido para administración de parqueaderos con persistencia

// Clave para almacenamiento en localStorage
const PARQUEADEROS_ADMIN_STORAGE_KEY = 'easyParking_parqueaderosAdmin';
const NEXT_ID_STORAGE_KEY = 'easyParking_parqueaderos_nextId';

// Datos iniciales por defecto
const datosInicialesPorDefecto = [
  {
    id: 1,
    nombre: 'Parqueadero Centro',
    direccion: 'Cra 14 #15-25, Armenia',
    coordenadas: '4.5389,-75.6811',
    horario_apertura: '06:00',
    horario_cierre: '22:00',
    total_spaces: 50,
    espacios_disponibles: 15,
    tarifa_id: 1,
    tipo: 'Cubierto',
    caracteristicas: ['Seguridad 24/7', 'Acceso para Discapacitados'],
    imagen_url: '/images/parqueadero1.jpg',
    created_at: '2025-01-01T00:00:00Z',
    activo: true
  },
  {
    id: 2,
    nombre: 'Estacionamiento La 14',
    direccion: 'Calle 23 #14-10, Armenia',
    coordenadas: '4.5402,-75.6828',
    horario_apertura: '07:00',
    horario_cierre: '20:00',
    total_spaces: 30,
    espacios_disponibles: 3,
    tarifa_id: 2,
    tipo: 'Descubierto',
    caracteristicas: ['Seguridad 24/7'],
    imagen_url: '/images/parqueadero2.jpg',
    created_at: '2025-01-01T00:00:00Z',
    activo: true
  },
  {
    id: 3,
    nombre: 'Garaje Premium',
    direccion: 'Av. Bolívar #20-15, Armenia',
    coordenadas: '4.5356,-75.6795',
    horario_apertura: '00:00',
    horario_cierre: '23:59',
    total_spaces: 80,
    espacios_disponibles: 25,
    tarifa_id: 3,
    tipo: 'Garaje',
    caracteristicas: ['Seguridad 24/7', 'Carga Eléctrica', 'Acceso para Discapacitados'],
    imagen_url: '/images/parqueadero3.jpg',
    created_at: '2025-01-01T00:00:00Z',
    activo: true
  },
  {
    id: 4,
    nombre: 'Parking Plaza Bolívar',
    direccion: 'Cra 13 #14-50, Armenia',
    coordenadas: '4.5378,-75.6803',
    horario_apertura: '08:00',
    horario_cierre: '18:00',
    total_spaces: 40,
    espacios_disponibles: 0,
    tarifa_id: 4,
    tipo: 'Cubierto',
    caracteristicas: ['Acceso para Discapacitados'],
    imagen_url: '/images/parqueadero4.jpg',
    created_at: '2025-01-01T00:00:00Z',
    activo: true
  },
  {
    id: 5,
    nombre: 'AutoParque Norte',
    direccion: 'Calle 30 #15-20, Armenia',
    coordenadas: '4.5425,-75.6842',
    horario_apertura: '06:00',
    horario_cierre: '22:00',
    total_spaces: 60,
    espacios_disponibles: 8,
    tarifa_id: 5,
    tipo: 'Cubierto',
    caracteristicas: ['Seguridad 24/7', 'Carga Eléctrica'],
    imagen_url: '/images/parqueadero5.jpg',
    created_at: '2025-01-01T00:00:00Z',
    activo: true
  },
  {
    id: 6,
    nombre: 'Estacionamiento Motos',
    direccion: 'Cra 19 #22-35, Armenia',
    coordenadas: '4.5367,-75.6820',
    horario_apertura: '07:00',
    horario_cierre: '19:00',
    total_spaces: 100,
    espacios_disponibles: 45,
    tarifa_id: 6,
    tipo: 'Descubierto',
    caracteristicas: [],
    solo_motos: true,
    imagen_url: '/images/parqueadero6.jpg',
    created_at: '2025-01-01T00:00:00Z',
    activo: true
  }
];

// Funciones para manejo de localStorage
const cargarParqueaderos = () => {
  try {
    const parqueaderosGuardados = localStorage.getItem(PARQUEADEROS_ADMIN_STORAGE_KEY);
    return parqueaderosGuardados ? JSON.parse(parqueaderosGuardados) : datosInicialesPorDefecto;
  } catch (error) {
    console.warn('Error al cargar parqueaderos admin desde localStorage:', error);
    return datosInicialesPorDefecto;
  }
};

const guardarParqueaderos = (parqueaderos) => {
  try {
    localStorage.setItem(PARQUEADEROS_ADMIN_STORAGE_KEY, JSON.stringify(parqueaderos));
    // También sincronizar con el servicio público
    localStorage.setItem('easyParking_parqueaderos', JSON.stringify(parqueaderos));
  } catch (error) {
    console.error('Error al guardar parqueaderos admin en localStorage:', error);
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
let parqueaderos = cargarParqueaderos();
let nextId = cargarNextId();

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockParqueaderosAdminService = {
  // Crear nuevo parqueadero
  async crearParqueadero(data) {
    await delay(800);
    
    // Validar datos requeridos
    if (!data.nombre || !data.direccion || !data.coordenadas) {
      throw new Error('Faltan campos requeridos');
    }
    
    const nuevoParqueadero = {
      id: nextId++,
      nombre: data.nombre,
      direccion: data.direccion,
      coordenadas: data.coordenadas,
      horario_apertura: data.horario_apertura || '00:00',
      horario_cierre: data.horario_cierre || '23:59',
      total_spaces: data.total_spaces || 0,
      espacios_disponibles: data.total_spaces || 0,
      tarifa_id: data.tarifa_id,
      tipo: data.tipo || 'Descubierto',
      caracteristicas: data.caracteristicas || [],
      solo_motos: data.solo_motos || false,
      imagen_url: data.imagen_url || '/images/default.jpg',
      created_at: new Date().toISOString(),
      activo: true
    };
    
    parqueaderos.push(nuevoParqueadero);
    return nuevoParqueadero;
  },

  // Listar todos los parqueaderos (admin)
  async listarTodosParqueaderos(filtros = {}) {
    await delay(400);
    
    let resultado = [...parqueaderos];
    
    // Filtrar por estado activo/inactivo
    if (filtros.activo !== undefined) {
      resultado = resultado.filter(p => p.activo === filtros.activo);
    }
    
    // Filtrar por tipo
    if (filtros.tipo) {
      resultado = resultado.filter(p => p.tipo === filtros.tipo);
    }
    
    return resultado;
  },

  // Obtener parqueadero por ID
  async obtenerParqueaderoPorId(id) {
    await delay(200);
    const parqueadero = parqueaderos.find(p => p.id === parseInt(id));
    if (!parqueadero) {
      throw new Error('Parqueadero no encontrado');
    }
    return parqueadero;
  },

  // Actualizar parqueadero
  async actualizarParqueadero(id, data) {
    await delay(600);
    
    const index = parqueaderos.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Parqueadero no encontrado');
    }
    
    parqueaderos[index] = {
      ...parqueaderos[index],
      ...data,
      id: parqueaderos[index].id, // Mantener el ID original
      updated_at: new Date().toISOString()
    };
    
    return parqueaderos[index];
  },

  // Desactivar parqueadero (soft delete)
  async desactivarParqueadero(id) {
    await delay(400);
    
    const parqueadero = parqueaderos.find(p => p.id === parseInt(id));
    if (!parqueadero) {
      throw new Error('Parqueadero no encontrado');
    }
    
    parqueadero.activo = false;
    parqueadero.updated_at = new Date().toISOString();
    
    return parqueadero;
  },

  // Activar parqueadero
  async activarParqueadero(id) {
    await delay(400);
    
    const parqueadero = parqueaderos.find(p => p.id === parseInt(id));
    if (!parqueadero) {
      throw new Error('Parqueadero no encontrado');
    }
    
    parqueadero.activo = true;
    parqueadero.updated_at = new Date().toISOString();
    
    return parqueadero;
  },

  // Actualizar disponibilidad de espacios
  async actualizarDisponibilidad(id, espaciosDisponibles) {
    await delay(300);
    
    const parqueadero = parqueaderos.find(p => p.id === parseInt(id));
    if (!parqueadero) {
      throw new Error('Parqueadero no encontrado');
    }
    
    if (espaciosDisponibles > parqueadero.total_spaces) {
      throw new Error('Los espacios disponibles no pueden superar el total');
    }
    
    parqueadero.espacios_disponibles = espaciosDisponibles;
    parqueadero.updated_at = new Date().toISOString();
    
    return parqueadero;
  },

  // Obtener estadísticas del parqueadero
  async obtenerEstadisticas(id) {
    await delay(500);
    
    const parqueadero = parqueaderos.find(p => p.id === parseInt(id));
    if (!parqueadero) {
      throw new Error('Parqueadero no encontrado');
    }
    
    const ocupacion = parqueadero.total_spaces - parqueadero.espacios_disponibles;
    const porcentajeOcupacion = (ocupacion / parqueadero.total_spaces) * 100;
    
    return {
      id: parqueadero.id,
      nombre: parqueadero.nombre,
      total_spaces: parqueadero.total_spaces,
      espacios_ocupados: ocupacion,
      espacios_disponibles: parqueadero.espacios_disponibles,
      porcentaje_ocupacion: porcentajeOcupacion.toFixed(2),
      estado: parqueadero.espacios_disponibles === 0 ? 'Lleno' :
              parqueadero.espacios_disponibles <= 5 ? 'Casi Lleno' : 'Disponible'
    };
  },

  // Función utilitaria para limpiar datos (desarrollo)
  limpiarDatos() {
    localStorage.removeItem(PARQUEADEROS_ADMIN_STORAGE_KEY);
    localStorage.removeItem(NEXT_ID_STORAGE_KEY);
    localStorage.removeItem('easyParking_parqueaderos'); // También limpiar el público
    parqueaderos = cargarParqueaderos();
    nextId = cargarNextId();
    console.log('🗑️ Datos de parqueaderos admin limpiados');
  }
};