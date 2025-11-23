// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';

// Iconos
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const RegisterForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Usuario',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Mínimo 8 caracteres, incluir mayúscula, minúscula y número';
    }

    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || 'Error al registrar usuario'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Input
        label="Nombre completo"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        icon={UserIcon}
        placeholder="Juan Pérez"
        autoComplete="name"
      />

      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={MailIcon}
        placeholder="tu@email.com"
        autoComplete="email"
      />

      <div className="relative">
        <Input
          label="Contraseña"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={LockIcon}
          placeholder="••••••••"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[42px] text-text-secondary hover:text-text-dark transition-colors"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      <div className="relative">
        <Input
          label="Confirmar contraseña"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={LockIcon}
          placeholder="••••••••"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-[42px] text-text-secondary hover:text-text-dark transition-colors"
        >
          {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-dark mb-2">
          Tipo de usuario
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-success-quindio transition-all duration-200"
        >
          <option value="Usuario">Usuario</option>
          <option value="Administrador de Parqueadero">Administrador de Parqueadero</option>
        </select>
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          required
          className="h-4 w-4 mt-1 text-success-quindio focus:ring-success-quindio border-gray-300 rounded"
        />
        <span className="ml-2 text-sm text-text-secondary">
          Acepto los{' '}
          <Link to="/terminos" className="text-info-blue hover:text-blue-800">
            términos y condiciones
          </Link>
          {' '}y la{' '}
          <Link to="/privacidad" className="text-info-blue hover:text-blue-800">
            política de privacidad
          </Link>
        </span>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full"
      >
        Crear Cuenta
      </Button>

      <div className="text-center">
        <span className="text-sm text-text-secondary">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-info-blue hover:text-blue-800 font-medium transition-colors"
          >
            Inicia sesión
          </Link>
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;