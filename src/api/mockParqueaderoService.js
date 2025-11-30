// RUTA: src/api/mockParqueaderoService.js
// Servicio mock para obtener parqueaderos con filtros (versión pública) con persistencia

// Clave para almacenamiento en localStorage
const PARQUEADEROS_STORAGE_KEY = 'easyParking_parqueaderos';

// Datos iniciales por defecto
const datosInicialesPorDefecto = [
  {
    id: 1,
    nombre: 'Parqueadero Centro',
    direccion: 'Cra 14 #15-25, Armenia',
    coordenadas: { lat: 4.5389, lng: -75.6811 },
    horario_apertura: '06:00',
    horario_cierre: '22:00',
    total_spaces: 50,
    espacios_disponibles: 15,
    tarifa_id: 1,
    tipo: 'Cubierto',
    caracteristicas: ['Seguridad 24/7', 'Acceso para Discapacitados'],
    imagen_url: '/images/parqueadero1.jpg',
    activo: true,
    creador_id: 1,
    fecha_creacion: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    nombre: 'Estacionamiento La 14',
    direccion: 'Calle 23 #14-10, Armenia',
    coordenadas: { lat: 4.5402, lng: -75.6828 },
    horario_apertura: '07:00',
    horario_cierre: '20:00',
    total_spaces: 30,
    espacios_disponibles: 3,
    tarifa_id: 2,
    tipo: 'Descubierto',
    caracteristicas: ['Seguridad 24/7'],
    imagen_url: '/images/parqueadero2.jpg',
    activo: true,
    creador_id: 2,
    fecha_creacion: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    nombre: 'Garaje Premium',
    direccion: 'Av. Bolívar #20-15, Armenia',
    coordenadas: { lat: 4.5356, lng: -75.6795 },
    horario_apertura: '00:00',
    horario_cierre: '23:59',
    total_spaces: 80,
    espacios_disponibles: 25,
    tarifa_id: 3,
    tipo: 'Garaje',
    caracteristicas: ['Seguridad 24/7', 'Carga Eléctrica', 'Acceso para Discapacitados'],
    imagen_url: '/images/parqueadero3.jpg',
    activo: true,
    creador_id: 1,
    fecha_creacion: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 4,
    nombre: 'Parking Plaza Bolívar',
    direccion: 'Cra 13 #14-50, Armenia',
    coordenadas: { lat: 4.5378, lng: -75.6803 },
    horario_apertura: '08:00',
    horario_cierre: '18:00',
    total_spaces: 40,
    espacios_disponibles: 0,
    tarifa_id: 4,
    tipo: 'Cubierto',
    caracteristicas: ['Acceso para Discapacitados'],
    imagen_url: '/images/parqueadero4.jpg',
    activo: true,
    creador_id: 3,
    fecha_creacion: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 5,
    nombre: 'AutoParque Norte',
    direccion: 'Calle 30 #15-20, Armenia',
    coordenadas: { lat: 4.5425, lng: -75.6842 },
    horario_apertura: '06:00',
    horario_cierre: '22:00',
    total_spaces: 60,
    espacios_disponibles: 8,
    tarifa_id: 5,
    tipo: 'Cubierto',
    caracteristicas: ['Seguridad 24/7', 'Carga Eléctrica'],
    imagen_url: '/images/parqueadero5.jpg',
    activo: true,
    creador_id: 1,
    fecha_creacion: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 6,
    nombre: 'Estacionamiento Motos',
    direccion: 'Cra 19 #22-35, Armenia',
    coordenadas: { lat: 4.5367, lng: -75.6820 },
    horario_apertura: '07:00',
    horario_cierre: '19:00',
    total_spaces: 100,
    espacios_disponibles: 45,
    tarifa_id: 6,
    tipo: 'Descubierto',
    caracteristicas: [],
    solo_motos: true,
    imagen_url: '/images/parqueadero6.jpg',
    activo: true,
    creador_id: 2,
    fecha_creacion: '2024-01-01T00:00:00.000Z'
  }
];

// Funciones para manejo de localStorage
const cargarParqueaderos = () => {
  try {
    const parqueaderosGuardados = localStorage.getItem(PARQUEADEROS_STORAGE_KEY);
    return parqueaderosGuardados ? JSON.parse(parqueaderosGuardados) : datosInicialesPorDefecto;
  } catch (error) {
    console.warn('Error al cargar parqueaderos desde localStorage:', error);
    return datosInicialesPorDefecto;
  }
};

const guardarParqueaderos = (parqueaderos) => {
  try {
    localStorage.setItem(PARQUEADEROS_STORAGE_KEY, JSON.stringify(parqueaderos));
  } catch (error) {
    console.error('Error al guardar parqueaderos en localStorage:', error);
  }
};

// Variable global que se sincroniza con localStorage
let parqueaderos = cargarParqueaderos();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const calculateDistance = (userLat, userLng, parkingLat, parkingLng) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = userLat * Math.PI/180;
  const φ2 = parkingLat * Math.PI/180;
  const Δφ = (parkingLat-userLat) * Math.PI/180;
  const Δλ = (parkingLng-userLng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

export const mockParqueaderosService = {
  async getParqueaderos(filters = {}) {
    await delay(600);

    // Recargar datos desde localStorage
    parqueaderos = cargarParqueaderos();

    let resultado = parqueaderos.filter(p => p.activo);

    // Filtrar por tipo de vehículo
    if (filters.vehicleType === 'motorcycle') {
      resultado = resultado.filter(p => p.solo_motos === true);
    } else if (filters.vehicleType === 'car') {
      resultado = resultado.filter(p => !p.solo_motos);
    }

    // Filtrar por búsqueda de texto
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(searchLower) ||
        p.direccion.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por disponibilidad
    if (filters.disponibilidad === 'ahora') {
      resultado = resultado.filter(p => p.espacios_disponibles > 0);
    }

    // Filtrar por tipo de espacio
    if (filters.tipoEspacio && filters.tipoEspacio.length > 0) {
      resultado = resultado.filter(p => filters.tipoEspacio.includes(p.tipo));
    }

    // Filtrar por características
    if (filters.seguridad24) {
      resultado = resultado.filter(p => p.caracteristicas.includes('Seguridad 24/7'));
    }
    if (filters.cargaElectrica) {
      resultado = resultado.filter(p => p.caracteristicas.includes('Carga Eléctrica'));
    }
    if (filters.accesoDiscapacitados) {
      resultado = resultado.filter(p => p.caracteristicas.includes('Acceso para Discapacitados'));
    }

    // Filtrar por distancia si hay ubicación del usuario
    if (filters.userLocation && filters.distancia) {
      resultado = resultado.filter(p => {
        const distance = calculateDistance(
          filters.userLocation.lat,
          filters.userLocation.lng,
          p.coordenadas.lat,
          p.coordenadas.lng
        );
        return distance <= filters.distancia;
      });
    }

    // Ordenar por distancia si hay ubicación del usuario
    if (filters.userLocation) {
      resultado = resultado.map(p => ({
        ...p,
        distancia: calculateDistance(
          filters.userLocation.lat,
          filters.userLocation.lng,
          p.coordenadas.lat,
          p.coordenadas.lng
        )
      })).sort((a, b) => a.distancia - b.distancia);
    }

    return {
      success: true,
      data: resultado,
      total: resultado.length
    };
  },

  async getParqueaderoById(id) {
    await delay(200);
    // Recargar datos desde localStorage
    parqueaderos = cargarParqueaderos();
    const parqueadero = parqueaderos.find(p => p.id === parseInt(id) && p.activo);
    if (!parqueadero) {
      throw new Error('Parqueadero no encontrado');
    }
    return { success: true, data: parqueadero };
  },

  async createParqueadero(parqueaderoData) {
    await delay(400);

    // Recargar datos desde localStorage
    parqueaderos = cargarParqueaderos();

    // Generar nuevo ID
    const maxId = Math.max(...parqueaderos.map(p => p.id), 0);
    const nuevoId = maxId + 1;

    // Validar datos requeridos
    const { nombre, direccion, coordenadas, horario_apertura, horario_cierre, total_spaces, tarifa_id, tipo, creador_id } = parqueaderoData;


    const camposFaltantes = [];
    if (!nombre) camposFaltantes.push('nombre');
    if (!direccion) camposFaltantes.push('direccion');
    if (!coordenadas || !coordenadas.lat || !coordenadas.lng) camposFaltantes.push('coordenadas');
    if (!horario_apertura) camposFaltantes.push('horario_apertura');
    if (!horario_cierre) camposFaltantes.push('horario_cierre');
    if (!total_spaces) camposFaltantes.push('total_spaces');
    if (!tarifa_id) camposFaltantes.push('tarifa_id');
    if (!tipo) camposFaltantes.push('tipo');
    if (!creador_id) camposFaltantes.push('creador_id');

    if (camposFaltantes.length > 0) {
      throw new Error(`Faltan los siguientes campos requeridos: ${camposFaltantes.join(', ')}`);
    }

    // Crear nuevo parqueadero
    const nuevoParqueadero = {
      id: nuevoId,
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      coordenadas: {
        lat: parseFloat(coordenadas.lat),
        lng: parseFloat(coordenadas.lng)
      },
      horario_apertura,
      horario_cierre,
      total_spaces: parseInt(total_spaces),
      espacios_disponibles: parseInt(total_spaces), // Inicialmente todos los espacios están disponibles
      tarifa_id: parseInt(tarifa_id),
      tipo,
      caracteristicas: parqueaderoData.caracteristicas || [],
      imagen_url: parqueaderoData.imagen_url || '/images/parqueadero-default.jpg',
      solo_motos: parqueaderoData.solo_motos || false,
      activo: true,
      creador_id: parseInt(creador_id),
      fecha_creacion: new Date().toISOString()
    };

    // Agregar a la lista
    parqueaderos.push(nuevoParqueadero);

    // Guardar en localStorage
    guardarParqueaderos(parqueaderos);

    return {
      success: true,
      data: nuevoParqueadero,
      message: 'Parqueadero creado exitosamente'
    };
  },

  async updateParqueadero(id, updateData, creadorId = null) {
    await delay(300);

    // Recargar datos desde localStorage
    parqueaderos = cargarParqueaderos();

    const index = parqueaderos.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Parqueadero no encontrado');
    }

    // Verificar permisos si se proporciona creadorId
    if (creadorId && parqueaderos[index].creador_id !== parseInt(creadorId)) {
      throw new Error('No tienes permisos para modificar este parqueadero');
    }

    // Actualizar parqueadero (mantener creador_id original)
    parqueaderos[index] = {
      ...parqueaderos[index],
      ...updateData,
      id: parseInt(id), // Mantener el ID original
      creador_id: parqueaderos[index].creador_id, // Mantener el creador original
      fecha_modificacion: new Date().toISOString()
    };

    // Guardar en localStorage
    guardarParqueaderos(parqueaderos);

    return {
      success: true,
      data: parqueaderos[index],
      message: 'Parqueadero actualizado exitosamente'
    };
  },

  async deleteParqueadero(id, creadorId = null) {
    await delay(200);

    // Recargar datos desde localStorage
    parqueaderos = cargarParqueaderos();

    const index = parqueaderos.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Parqueadero no encontrado');
    }

    // Verificar permisos si se proporciona creadorId
    if (creadorId && parqueaderos[index].creador_id !== parseInt(creadorId)) {
      throw new Error('No tienes permisos para eliminar este parqueadero');
    }

    // Marcar como inactivo en lugar de eliminar
    parqueaderos[index].activo = false;
    parqueaderos[index].fecha_eliminacion = new Date().toISOString();

    // Guardar en localStorage
    guardarParqueaderos(parqueaderos);

    return {
      success: true,
      message: 'Parqueadero eliminado exitosamente'
    };
  },

  // Método específico para obtener parqueaderos de un administrador
  async getParqueaderosByCreador(creadorId, filters = {}) {
    await delay(300);

    // Recargar datos desde localStorage
    parqueaderos = cargarParqueaderos();

    let resultado = parqueaderos.filter(p => p.activo && p.creador_id === parseInt(creadorId));

    // Aplicar filtros adicionales si se proporcionan
    if (filters.searchText) {
      const search = filters.searchText.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(search) ||
        p.direccion.toLowerCase().includes(search)
      );
    }

    if (filters.tipo) {
      resultado = resultado.filter(p => p.tipo === filters.tipo);
    }

    return {
      success: true,
      data: resultado,
      total: resultado.length
    };
  },

  // Función para reducir espacios disponibles cuando se crea una reserva
  async reducirEspaciosDisponibles(parqueaderoId) {
    // Recargar datos desde localStorage
    parqueaderos = cargarParqueaderos();

    const index = parqueaderos.findIndex(p => p.id === parseInt(parqueaderoId));
    if (index === -1) {
      throw new Error('Parqueadero no encontrado');
    }

    if (parqueaderos[index].espacios_disponibles <= 0) {
      throw new Error('No hay espacios disponibles');
    }

    // Reducir espacios disponibles
    parqueaderos[index].espacios_disponibles -= 1;

    // Guardar en localStorage
    guardarParqueaderos(parqueaderos);

    return parqueaderos[index];
  },

  // Función para aumentar espacios disponibles cuando se cancela una reserva
  async aumentarEspaciosDisponibles(parqueaderoId) {
    // Recargar datos desde localStorage
    parqueaderos = cargarParqueaderos();

    const index = parqueaderos.findIndex(p => p.id === parseInt(parqueaderoId));
    if (index === -1) {
      throw new Error('Parqueadero no encontrado');
    }

    // No debe exceder el total de espacios
    if (parqueaderos[index].espacios_disponibles < parqueaderos[index].total_spaces) {
      parqueaderos[index].espacios_disponibles += 1;
    }

    // Guardar en localStorage
    guardarParqueaderos(parqueaderos);

    return parqueaderos[index];
  },

  // Función para que administradores ajusten espacios manualmente
  async ajustarEspaciosDisponibles(parqueaderoId, operacion, creadorId = null) {
    await delay(200);

    // Recargar datos desde localStorage
    parqueaderos = cargarParqueaderos();

    const index = parqueaderos.findIndex(p => p.id === parseInt(parqueaderoId));
    if (index === -1) {
      throw new Error('Parqueadero no encontrado');
    }

    // Verificar permisos si se proporciona creadorId
    if (creadorId && parqueaderos[index].creador_id !== parseInt(creadorId)) {
      throw new Error('No tienes permisos para modificar este parqueadero');
    }

    const parqueadero = parqueaderos[index];

    if (operacion === 'reducir') {
      if (parqueadero.espacios_disponibles <= 0) {
        throw new Error('No hay espacios disponibles para reducir');
      }
      parqueadero.espacios_disponibles -= 1;
    } else if (operacion === 'aumentar') {
      if (parqueadero.espacios_disponibles >= parqueadero.total_spaces) {
        throw new Error('No se puede exceder el total de espacios');
      }
      parqueadero.espacios_disponibles += 1;
    } else {
      throw new Error('Operación no válida. Use "reducir" o "aumentar"');
    }

    // Agregar log de modificación
    parqueadero.fecha_modificacion = new Date().toISOString();

    // Guardar en localStorage
    guardarParqueaderos(parqueaderos);

    return {
      success: true,
      data: parqueadero,
      message: `Espacios ${operacion === 'reducir' ? 'reducidos' : 'aumentados'} exitosamente`
    };
  },

  // Función utilitaria para limpiar datos (desarrollo)
  limpiarDatos() {
    localStorage.removeItem(PARQUEADEROS_STORAGE_KEY);
    parqueaderos = cargarParqueaderos();
    console.log('🗑️ Datos de parqueaderos limpiados');
  }
};