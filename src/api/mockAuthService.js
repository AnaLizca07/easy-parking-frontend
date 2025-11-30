// src/api/mockAuthService.js
import { saveToken, saveUser } from '../utils/storageHelpers';

// Claves para localStorage
const USERS_STORAGE_KEY = 'easyParking_usuarios';
const NEXT_USER_ID_STORAGE_KEY = 'easyParking_usuarios_nextId';

// Datos iniciales por defecto
const datosUsuariosPorDefecto = [
  {
    id: '1',
    name: 'Usuario Demo',
    email: 'demo@easyparking.com',
    password: 'Demo123!',
    role: 'Usuario',
    tipo_usuario: 'cliente',
    is_verified: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Admin Demo',
    email: 'admin@easyparking.com',
    password: 'Admin123!',
    role: 'Administrador de Parqueadero',
    tipo_usuario: 'admin',
    is_verified: true,
    is_active: true,
    created_at: new Date().toISOString(),
  }
];

// Funciones para manejo de localStorage de usuarios
const cargarUsuarios = () => {
  try {
    const usuariosGuardados = localStorage.getItem(USERS_STORAGE_KEY);
    return usuariosGuardados ? JSON.parse(usuariosGuardados) : datosUsuariosPorDefecto;
  } catch (error) {
    console.warn('Error al cargar usuarios desde localStorage:', error);
    return datosUsuariosPorDefecto;
  }
};

const guardarUsuarios = (usuarios) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usuarios));
  } catch (error) {
    console.error('Error al guardar usuarios en localStorage:', error);
  }
};

const cargarNextUserId = () => {
  try {
    const nextId = localStorage.getItem(NEXT_USER_ID_STORAGE_KEY);
    return nextId ? parseInt(nextId) : 3; // Empezar desde 3 porque ya hay usuarios con ID 1 y 2
  } catch (error) {
    console.warn('Error al cargar nextUserId desde localStorage:', error);
    return 3;
  }
};

const guardarNextUserId = (id) => {
  try {
    localStorage.setItem(NEXT_USER_ID_STORAGE_KEY, id.toString());
  } catch (error) {
    console.error('Error al guardar nextUserId en localStorage:', error);
  }
};

// Cargar usuarios desde localStorage al inicializar
let usersDB = cargarUsuarios();
let nextUserId = cargarNextUserId();

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generar tokens simulados
const generateTokens = (userId) => {
  const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_access_${userId}_${Date.now()}`;
  const refreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_refresh_${userId}_${Date.now()}`;
  return { accessToken, refreshToken };
};

export const mockAuthService = {
  // POST /api/v1/auth/register
  register: async (userData) => {
    await delay(1000);

    // Recargar usuarios desde localStorage para asegurar consistencia
    usersDB = cargarUsuarios();
    nextUserId = cargarNextUserId();

    // Validar que el email no exista
    const existingUser = usersDB.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Validar rol
    if (!['Usuario', 'Administrador de Parqueadero'].includes(userData.role)) {
      throw new Error('Rol inválido');
    }

    // Mapear rol a tipo_usuario para compatibilidad con la UI
    const mapRoleToTipoUsuario = (role) => {
      switch (role) {
        case 'Administrador de Parqueadero':
          return 'admin';
        case 'Usuario':
        default:
          return 'cliente';
      }
    };

    // Crear nuevo usuario
    const newUser = {
      id: String(nextUserId),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      tipo_usuario: mapRoleToTipoUsuario(userData.role),
      is_verified: true, // Para el mock, auto-verificamos
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    usersDB.push(newUser);
    nextUserId++;

    // Guardar en localStorage
    guardarUsuarios(usersDB);
    guardarNextUserId(nextUserId);

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(newUser.id);

    const userResponse = {
      id: newUser.id,
      nombre: newUser.name, // Mapear name a nombre para compatibilidad
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      tipo_usuario: newUser.tipo_usuario,
      is_verified: newUser.is_verified,
      is_active: newUser.is_active,
      created_at: newUser.created_at,
    };

    saveToken(accessToken);
    saveUser(userResponse);

    return {
      message: 'Usuario registrado exitosamente',
      user: userResponse,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  },

  // POST /api/v1/auth/login
  login: async (email, password) => {
    await delay(800);

    // Recargar usuarios desde localStorage para asegurar consistencia
    usersDB = cargarUsuarios();

    const user = usersDB.find(u => u.email === email);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    if (user.password !== password) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.is_verified) {
      throw new Error('Por favor verifica tu email antes de iniciar sesión');
    }

    if (!user.is_active) {
      throw new Error('Tu cuenta ha sido desactivada');
    }

    // Mapear rol a tipo_usuario para compatibilidad con la UI
    const mapRoleToTipoUsuario = (role) => {
      switch (role) {
        case 'Administrador de Parqueadero':
          return 'admin';
        case 'Usuario':
        default:
          return 'cliente';
      }
    };

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Asegurar que el usuario tenga el campo tipo_usuario
    if (!user.tipo_usuario) {
      user.tipo_usuario = mapRoleToTipoUsuario(user.role);
    }

    const userResponse = {
      id: user.id,
      nombre: user.name, // Mapear name a nombre para compatibilidad
      name: user.name,
      email: user.email,
      role: user.role,
      tipo_usuario: user.tipo_usuario,
      is_verified: user.is_verified,
      is_active: user.is_active,
      created_at: user.created_at,
    };

    saveToken(accessToken);
    saveUser(userResponse);

    return {
      message: 'Login exitoso',
      access_token: accessToken,
      refresh_token: refreshToken,
      user: userResponse,
    };
  },

  // POST /api/v1/auth/logout
  logout: async () => {
    await delay(300);
    return { 
      message: 'Logout exitoso' 
    };
  },

  // GET /api/v1/users/me
  getProfile: async (token) => {
    await delay(500);

    if (!token) {
      throw new Error('Token no proporcionado');
    }

    // Recargar usuarios desde localStorage para asegurar consistencia
    usersDB = cargarUsuarios();

    // Extraer userId del token mock
    const userId = token.split('_')[2];
    const user = usersDB.find(u => u.id === userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Mapear rol a tipo_usuario para compatibilidad con la UI
    const mapRoleToTipoUsuario = (role) => {
      switch (role) {
        case 'Administrador de Parqueadero':
          return 'admin';
        case 'Usuario':
        default:
          return 'cliente';
      }
    };

    // Asegurar que el usuario tenga el campo tipo_usuario
    if (!user.tipo_usuario) {
      user.tipo_usuario = mapRoleToTipoUsuario(user.role);
    }

    return {
      id: user.id,
      nombre: user.name, // Mapear name a nombre para compatibilidad
      name: user.name,
      email: user.email,
      role: user.role,
      tipo_usuario: user.tipo_usuario,
      is_verified: user.is_verified,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  },

  // Función utilitaria para limpiar datos (desarrollo)
  limpiarDatos() {
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(NEXT_USER_ID_STORAGE_KEY);
    usersDB = cargarUsuarios();
    nextUserId = cargarNextUserId();
    console.log('🗑️ Datos de usuarios limpiados');
  }
};