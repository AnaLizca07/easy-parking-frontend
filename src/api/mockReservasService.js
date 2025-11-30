// RUTA: src/api/mockReservasService.js
// Servicio mock para manejo de reservas con persistencia en localStorage

// Clave para almacenamiento en localStorage
const RESERVAS_STORAGE_KEY = 'easyParking_reservas';
const NEXT_ID_STORAGE_KEY = 'easyParking_reservas_nextId';

// Datos iniciales por defecto
const datosInicialesPorDefecto = [
  {
    id: 1,
    usuario_id: '1', // Cambiar a string para consistencia con mockAuthService
    parqueadero_id: 1,
    fecha_de_reserva: '2025-11-27T10:00:00',
    duracion_estimada: 120,
    placa_vehiculo: 'ABC123',
    codigo: 'A1B2C3',
    estado: 'confirmada',
    espacio_asignado: '101',
    fecha_creacion: '2025-11-26T15:00:00',
    fecha_entrada: null,
    fecha_salida: null
  }
];

// Funciones para manejo de localStorage
const cargarReservas = () => {
  try {
    const reservasGuardadas = localStorage.getItem(RESERVAS_STORAGE_KEY);
    return reservasGuardadas ? JSON.parse(reservasGuardadas) : datosInicialesPorDefecto;
  } catch (error) {
    console.warn('Error al cargar reservas desde localStorage:', error);
    return datosInicialesPorDefecto;
  }
};

const guardarReservas = (reservas) => {
  try {
    localStorage.setItem(RESERVAS_STORAGE_KEY, JSON.stringify(reservas));
  } catch (error) {
    console.error('Error al guardar reservas en localStorage:', error);
  }
};

const cargarNextId = () => {
  try {
    const nextId = localStorage.getItem(NEXT_ID_STORAGE_KEY);
    return nextId ? parseInt(nextId) : 2;
  } catch (error) {
    console.warn('Error al cargar nextId desde localStorage:', error);
    return 2;
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
let reservas = cargarReservas();
let nextId = cargarNextId();

// Función para generar código aleatorio de 6 caracteres
const generarCodigo = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
};

// Función para asignar espacio disponible
const asignarEspacio = (parqueaderoId) => {
  // Simulación de espacios del 101 al 150
  const espacioBase = 100 + (parqueaderoId * 10);
  const espacioAleatorio = Math.floor(Math.random() * 50);
  return (espacioBase + espacioAleatorio).toString();
};

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockReservasService = {
  // Crear nueva reserva (RF03, RF04)
  async crearReserva(data) {
    await delay(800);

    // Recargar datos desde localStorage para asegurar consistencia
    reservas = cargarReservas();
    nextId = cargarNextId();

    // Validar que haya cupo disponible (simulado)
    const cupoDisponible = Math.random() > 0.1; // 90% de probabilidad de éxito

    if (!cupoDisponible) {
      throw new Error('No hay espacios disponibles en este parqueadero');
    }

    const codigo = generarCodigo();

    const nuevaReserva = {
      id: nextId,
      usuario_id: String(data.usuario_id), // Asegurar que sea string para consistencia
      parqueadero_id: data.parqueadero_id,
      fecha_de_reserva: data.fecha_de_reserva,
      duracion_estimada: data.duracion_estimada,
      placa_vehiculo: data.placa_vehiculo.toUpperCase(),
      codigo: codigo,
      estado: 'pendiente',
      espacio_asignado: null,
      fecha_creacion: new Date().toISOString(),
      fecha_entrada: null,
      fecha_salida: null
    };

    reservas.push(nuevaReserva);
    nextId++;

    // Guardar en localStorage
    guardarReservas(reservas);
    guardarNextId(nextId);

    console.log('✅ Nueva reserva creada y guardada:', nuevaReserva);
    return nuevaReserva;
  },

  // Validar reserva por código
  async validarReserva(codigo) {
    await delay(500);

    // Recargar datos desde localStorage para asegurar consistencia
    reservas = cargarReservas();

    const reserva = reservas.find(r => r.codigo === codigo.toUpperCase());

    if (!reserva) {
      throw new Error('Código de reserva no válido');
    }

    if (reserva.estado === 'confirmada') {
      throw new Error('Esta reserva ya fue confirmada');
    }

    if (reserva.estado === 'cancelada') {
      throw new Error('Esta reserva fue cancelada');
    }

    if (reserva.estado === 'completada') {
      throw new Error('Esta reserva ya fue completada');
    }

    // Asignar espacio y actualizar estado
    reserva.estado = 'confirmada';
    reserva.espacio_asignado = asignarEspacio(reserva.parqueadero_id);
    reserva.fecha_entrada = new Date().toISOString();

    // Guardar cambios en localStorage
    guardarReservas(reservas);

    return reserva;
  },

  // Cancelar reserva
  async cancelarReserva(id) {
    await delay(400);

    // Recargar datos desde localStorage para asegurar consistencia
    reservas = cargarReservas();

    const reserva = reservas.find(r => r.id === parseInt(id));

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (reserva.estado === 'confirmada') {
      throw new Error('No se puede cancelar una reserva ya confirmada');
    }

    if (reserva.estado === 'completada') {
      throw new Error('No se puede cancelar una reserva completada');
    }

    reserva.estado = 'cancelada';

    // Guardar cambios en localStorage
    guardarReservas(reservas);

    return reserva;
  },

  // Completar reserva (marcar salida)
  async completarReserva(id) {
    await delay(400);

    // Recargar datos desde localStorage para asegurar consistencia
    reservas = cargarReservas();

    const reserva = reservas.find(r => r.id === parseInt(id));

    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }

    if (reserva.estado !== 'confirmada') {
      throw new Error('Solo se pueden completar reservas confirmadas');
    }

    reserva.estado = 'completada';
    reserva.fecha_salida = new Date().toISOString();

    // Guardar cambios en localStorage
    guardarReservas(reservas);

    return reserva;
  },

  // Listar reservas por usuario
  async listarReservasPorUsuario(usuarioId) {
    await delay(300);
    // Recargar datos desde localStorage para asegurar consistencia
    reservas = cargarReservas();

    const reservasDelUsuario = reservas.filter(r => {
      // Comparar como strings para evitar problemas de tipo
      return String(r.usuario_id) === String(usuarioId);
    });

    return reservasDelUsuario;
  },

  // Listar todas las reservas (admin)
  async listarTodasReservas(filtros = {}) {
    await delay(400);
    
    let resultado = [...reservas];
    
    // Filtrar por estado
    if (filtros.estado) {
      resultado = resultado.filter(r => r.estado === filtros.estado);
    }
    
    // Filtrar por parqueadero
    if (filtros.parqueadero_id) {
      resultado = resultado.filter(r => r.parqueadero_id === parseInt(filtros.parqueadero_id));
    }
    
    // Filtrar por fecha
    if (filtros.fecha) {
      resultado = resultado.filter(r => 
        r.fecha_de_reserva.startsWith(filtros.fecha)
      );
    }
    
    return resultado;
  },

  // Obtener reserva por ID
  async obtenerReservaPorId(id) {
    await delay(200);
    const reserva = reservas.find(r => r.id === parseInt(id));
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }
    return reserva;
  },

  // Buscar reserva por código
  async buscarReservaPorCodigo(codigo) {
    await delay(300);
    // Recargar datos desde localStorage
    reservas = cargarReservas();
    const reserva = reservas.find(r => r.codigo === codigo.toUpperCase());
    if (!reserva) {
      throw new Error('Reserva no encontrada');
    }
    return reserva;
  },

  // Función utilitaria para limpiar datos (desarrollo)
  limpiarDatos() {
    localStorage.removeItem(RESERVAS_STORAGE_KEY);
    localStorage.removeItem(NEXT_ID_STORAGE_KEY);
    reservas = cargarReservas();
    nextId = cargarNextId();
    console.log('🗑️ Datos de reservas limpiados');
  }
};