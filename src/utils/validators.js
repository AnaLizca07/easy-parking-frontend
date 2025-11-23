// src/utils/validators.js
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  // Mínimo 8 caracteres, al menos una letra y un número
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
};

export const validatePhone = (phone) => {
  // Formato colombiano: 10 dígitos
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};