// src/utils/constants.js
export const COLORS = {
  PRIMARY_WHITE: '#FFFFFF',
  SECONDARY_WHITE: '#F8F9FA',
  WARNING_QUINDIO: '#FFD700',
  WARNING_LIGHT: '#FFC300',
  SUCCESS_QUINDIO: '#196619',
  INFO_BLUE: '#0066CC',
  TEXT_DARK: '#000000',
  TEXT_SECONDARY: '#6C757D',
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/perfil',
  RESERVAS: '/reservas',
};

export const STORAGE_KEYS = {
  TOKEN: 'easy_parking_token',
  USER: 'easy_parking_user',
};