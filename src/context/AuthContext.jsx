// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getToken, getUser, clearStorage } from '../utils/storageHelpers';
import { mockAuthService } from '../api/mockAuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario del localStorage al iniciar
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      // Asegurar que el usuario tenga el campo tipo_usuario si no lo tiene
      if (storedUser.role && !storedUser.tipo_usuario) {
        switch (storedUser.role) {
          case 'Administrador de Parqueadero':
            storedUser.tipo_usuario = 'admin';
            break;
          case 'Usuario':
          default:
            storedUser.tipo_usuario = 'cliente';
            break;
        }
        // Actualizar en localStorage
        localStorage.setItem('user', JSON.stringify(storedUser));
      }

      setToken(storedToken);
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  const login = async (correo, contrasena) => {
    try {
      const response = await mockAuthService.login(correo, contrasena);
      setToken(response.access_token);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await mockAuthService.register(userData);
      setToken(response.access_token);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await mockAuthService.logout();
    clearStorage();
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    // Asegurar que el usuario tenga el campo tipo_usuario si no lo tiene
    if (updatedUserData.role && !updatedUserData.tipo_usuario) {
      switch (updatedUserData.role) {
        case 'Administrador de Parqueadero':
          updatedUserData.tipo_usuario = 'admin';
          break;
        case 'Usuario':
        default:
          updatedUserData.tipo_usuario = 'cliente';
          break;
      }
    }

    setUser(updatedUserData);
    // También actualizar en localStorage para persistencia
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};