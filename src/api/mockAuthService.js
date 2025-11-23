// src/api/mockAuthService.js
import { saveToken, saveUser } from '../utils/storageHelpers';

// Simulación de base de datos en memoria
let usersDB = [
  {
    id: '1',
    name: 'Usuario Demo',
    email: 'demo@easyparking.com',
    password: 'Demo123!',
    role: 'Usuario',
    is_verified: true,
    is_active: true,
    created_at: new Date().toISOString(),
  }
];

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

    // Validar que el email no exista
    const existingUser = usersDB.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Validar rol
    if (!['Usuario', 'Administrador de Parqueadero'].includes(userData.role)) {
      throw new Error('Rol inválido');
    }

    // Crear nuevo usuario
    const newUser = {
      id: String(usersDB.length + 1),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      is_verified: false, // En producción sería false hasta verificar email
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    usersDB.push(newUser);

    // Para el mock, auto-verificamos
    newUser.is_verified = true;

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(newUser.id);

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
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

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
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

    // Extraer userId del token mock
    const userId = token.split('_')[2];
    const user = usersDB.find(u => u.id === userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  },
};