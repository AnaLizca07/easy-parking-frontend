// RUTA: src/api/mockUsuariosService.js
// Servicio mock para manejo de usuarios con persistencia en localStorage

// Clave para almacenamiento en localStorage
const USUARIOS_STORAGE_KEY = 'easyParking_usuarios';
const NEXT_ID_STORAGE_KEY = 'easyParking_usuarios_nextId';

// Datos iniciales por defecto
const datosInicialesPorDefecto = [
  {
    id: 1,
    nombre: 'Usuario Demo',
    email: 'demo@example.com',
    telefono: '3001234567',
    documento: '12345678',
    tipo_documento: 'cedula',
    tipo_usuario: 'cliente',
    fecha_registro: '2025-11-26T10:00:00Z',
    activo: true,
    vehiculos: [
      {
        id: 1,
        placa: 'ABC123',
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Blanco',
        tipo: 'automovil'
      }
    ]
  }
];

// Funciones para manejo de localStorage
const cargarUsuarios = () => {
  try {
    const usuariosGuardados = localStorage.getItem(USUARIOS_STORAGE_KEY);
    return usuariosGuardados ? JSON.parse(usuariosGuardados) : datosInicialesPorDefecto;
  } catch (error) {
    console.warn('Error al cargar usuarios desde localStorage:', error);
    return datosInicialesPorDefecto;
  }
};

const guardarUsuarios = (usuarios) => {
  try {
    localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));
  } catch (error) {
    console.error('Error al guardar usuarios en localStorage:', error);
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
let usuarios = cargarUsuarios();
let nextId = cargarNextId();

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockUsuariosService = {
  // Registrar nuevo usuario
  async registrarUsuario(data) {
    await delay(800);

    // Recargar datos desde localStorage para asegurar consistencia
    usuarios = cargarUsuarios();
    nextId = cargarNextId();

    // Validar que el email no esté en uso
    const emailExistente = usuarios.find(u => u.email === data.email && u.activo);
    if (emailExistente) {
      throw new Error('El email ya está registrado');
    }

    // Validar que el documento no esté en uso
    const documentoExistente = usuarios.find(u => u.documento === data.documento && u.activo);
    if (documentoExistente) {
      throw new Error('El documento ya está registrado');
    }

    const nuevoUsuario = {
      id: nextId,
      nombre: data.nombre,
      email: data.email.toLowerCase(),
      telefono: data.telefono,
      documento: data.documento,
      tipo_documento: data.tipo_documento || 'cedula',
      tipo_usuario: data.tipo_usuario || 'cliente',
      fecha_registro: new Date().toISOString(),
      activo: true,
      vehiculos: []
    };

    usuarios.push(nuevoUsuario);
    nextId++;

    // Guardar en localStorage
    guardarUsuarios(usuarios);
    guardarNextId(nextId);

    console.log('✅ Nuevo usuario registrado y guardado:', nuevoUsuario);
    return nuevoUsuario;
  },

  // Obtener usuario por ID
  async obtenerUsuarioPorId(id) {
    await delay(200);
    // Recargar datos desde localStorage
    usuarios = cargarUsuarios();
    const usuario = usuarios.find(u => u.id === parseInt(id) && u.activo);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  },

  // Obtener usuario por email
  async obtenerUsuarioPorEmail(email) {
    await delay(200);
    // Recargar datos desde localStorage
    usuarios = cargarUsuarios();
    const usuario = usuarios.find(u => u.email === email.toLowerCase() && u.activo);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  },

  // Actualizar perfil de usuario
  async actualizarPerfil(id, data) {
    await delay(500);

    // Recargar datos desde localStorage
    usuarios = cargarUsuarios();

    const index = usuarios.findIndex(u => u.id === parseInt(id));
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }

    // Validar email único si está cambiando
    if (data.email && data.email !== usuarios[index].email) {
      const emailExistente = usuarios.find(u => u.email === data.email.toLowerCase() && u.id !== parseInt(id) && u.activo);
      if (emailExistente) {
        throw new Error('El email ya está en uso');
      }
    }

    usuarios[index] = {
      ...usuarios[index],
      ...data,
      id: usuarios[index].id, // Mantener el ID original
      email: data.email ? data.email.toLowerCase() : usuarios[index].email,
      fecha_actualizacion: new Date().toISOString()
    };

    // Guardar cambios en localStorage
    guardarUsuarios(usuarios);
    console.log('✅ Perfil actualizado y guardado:', usuarios[index]);

    return usuarios[index];
  },

  // Agregar vehículo
  async agregarVehiculo(usuarioId, vehiculo) {
    await delay(400);

    // Recargar datos desde localStorage
    usuarios = cargarUsuarios();

    const usuario = usuarios.find(u => u.id === parseInt(usuarioId) && u.activo);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Validar que la placa no esté registrada para este usuario
    const placaExistente = usuario.vehiculos.find(v => v.placa === vehiculo.placa.toUpperCase());
    if (placaExistente) {
      throw new Error('Ya tienes un vehículo registrado con esta placa');
    }

    const vehiculoId = usuario.vehiculos.length > 0 ? Math.max(...usuario.vehiculos.map(v => v.id)) + 1 : 1;

    const nuevoVehiculo = {
      id: vehiculoId,
      placa: vehiculo.placa.toUpperCase(),
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      color: vehiculo.color,
      tipo: vehiculo.tipo || 'automovil',
      fecha_registro: new Date().toISOString()
    };

    usuario.vehiculos.push(nuevoVehiculo);

    // Guardar cambios en localStorage
    guardarUsuarios(usuarios);
    console.log('✅ Vehículo agregado y guardado:', nuevoVehiculo);

    return nuevoVehiculo;
  },

  // Eliminar vehículo
  async eliminarVehiculo(usuarioId, vehiculoId) {
    await delay(300);

    // Recargar datos desde localStorage
    usuarios = cargarUsuarios();

    const usuario = usuarios.find(u => u.id === parseInt(usuarioId) && u.activo);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const vehiculoIndex = usuario.vehiculos.findIndex(v => v.id === parseInt(vehiculoId));
    if (vehiculoIndex === -1) {
      throw new Error('Vehículo no encontrado');
    }

    const vehiculoEliminado = usuario.vehiculos.splice(vehiculoIndex, 1)[0];

    // Guardar cambios en localStorage
    guardarUsuarios(usuarios);
    console.log('✅ Vehículo eliminado:', vehiculoEliminado);

    return vehiculoEliminado;
  },

  // Listar todos los usuarios (admin)
  async listarTodosUsuarios(filtros = {}) {
    await delay(400);

    // Recargar datos desde localStorage
    usuarios = cargarUsuarios();

    let resultado = [...usuarios];

    // Filtrar por estado activo/inactivo
    if (filtros.activo !== undefined) {
      resultado = resultado.filter(u => u.activo === filtros.activo);
    }

    // Filtrar por tipo de usuario
    if (filtros.tipo_usuario) {
      resultado = resultado.filter(u => u.tipo_usuario === filtros.tipo_usuario);
    }

    // Filtrar por texto de búsqueda
    if (filtros.busqueda) {
      const busquedaLower = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(u =>
        u.nombre.toLowerCase().includes(busquedaLower) ||
        u.email.toLowerCase().includes(busquedaLower) ||
        u.documento.includes(busquedaLower)
      );
    }

    return resultado;
  },

  // Desactivar usuario (soft delete)
  async desactivarUsuario(id) {
    await delay(300);

    // Recargar datos desde localStorage
    usuarios = cargarUsuarios();

    const usuario = usuarios.find(u => u.id === parseInt(id));
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    usuario.activo = false;
    usuario.fecha_desactivacion = new Date().toISOString();

    // Guardar cambios en localStorage
    guardarUsuarios(usuarios);
    console.log('✅ Usuario desactivado:', usuario);

    return usuario;
  },

  // Activar usuario
  async activarUsuario(id) {
    await delay(300);

    // Recargar datos desde localStorage
    usuarios = cargarUsuarios();

    const usuario = usuarios.find(u => u.id === parseInt(id));
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    usuario.activo = true;
    delete usuario.fecha_desactivacion;

    // Guardar cambios en localStorage
    guardarUsuarios(usuarios);
    console.log('✅ Usuario activado:', usuario);

    return usuario;
  },

  // Función utilitaria para limpiar datos (desarrollo)
  limpiarDatos() {
    localStorage.removeItem(USUARIOS_STORAGE_KEY);
    localStorage.removeItem(NEXT_ID_STORAGE_KEY);
    usuarios = cargarUsuarios();
    nextId = cargarNextId();
    console.log('🗑️ Datos de usuarios limpiados');
  }
};