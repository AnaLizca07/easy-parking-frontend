import { useState, useEffect } from 'react';
import { User, Mail, Phone, CreditCard, Car, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mockUsuariosService } from '../api/mockUsuariosService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import PageLayout from '../components/layout/PageLayout';

const Profile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [addingVehicle, setAddingVehicle] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    documento: '',
    tipo_documento: 'cedula'
  });

  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState({
    placa: '',
    marca: '',
    modelo: '',
    color: '',
    tipo: 'automovil'
  });

  // Load user profile
  useEffect(() => {
    loadUserProfile();
  }, [authUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserProfile = async () => {
    if (!authUser?.id) return;

    try {
      setLoading(true);
      // Usar directamente los datos del usuario autenticado
      // y agregar campos que puedan faltar con valores por defecto
      const userData = {
        ...authUser,
        nombre: authUser.nombre || authUser.name,
        telefono: authUser.telefono || '',
        documento: authUser.documento || '',
        tipo_documento: authUser.tipo_documento || 'cedula',
        fecha_registro: authUser.created_at || new Date().toISOString(),
        activo: authUser.is_active || true,
        vehiculos: authUser.vehiculos || []
      };

      setUser(userData);
      setFormData({
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono,
        documento: userData.documento,
        tipo_documento: userData.tipo_documento
      });
    } catch (err) {
      setError('Error al cargar el perfil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editing) {
      // Cancel editing - reset form
      setFormData({
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        documento: user.documento,
        tipo_documento: user.tipo_documento
      });
    }
    setEditing(!editing);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      // Actualizar directamente en el contexto de autenticación
      const updatedUser = {
        ...user,
        ...formData,
        name: formData.nombre, // Mantener compatibilidad
        updated_at: new Date().toISOString()
      };

      setUser(updatedUser);
      updateUser(updatedUser);
      setEditing(false);
      setSuccess('Perfil actualizado correctamente');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al actualizar perfil: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddVehicle = async () => {
    try {
      if (!vehicleForm.placa || !vehicleForm.marca || !vehicleForm.modelo) {
        setError('Por favor completa todos los campos del vehículo');
        return;
      }

      setSaving(true);
      setError(null);

      // Validar que la placa no esté duplicada
      const vehiculos = user.vehiculos || [];
      const placaExistente = vehiculos.find(v => v.placa === vehicleForm.placa.toUpperCase());
      if (placaExistente) {
        throw new Error('Ya tienes un vehículo registrado con esta placa');
      }

      // Crear nuevo vehículo
      const vehiculoId = vehiculos.length > 0 ? Math.max(...vehiculos.map(v => v.id)) + 1 : 1;
      const nuevoVehiculo = {
        id: vehiculoId,
        placa: vehicleForm.placa.toUpperCase(),
        marca: vehicleForm.marca,
        modelo: vehicleForm.modelo,
        color: vehicleForm.color,
        tipo: vehicleForm.tipo,
        fecha_registro: new Date().toISOString()
      };

      // Actualizar usuario con nuevo vehículo
      const updatedUser = {
        ...user,
        vehiculos: [...vehiculos, nuevoVehiculo],
        updated_at: new Date().toISOString()
      };

      setUser(updatedUser);
      updateUser(updatedUser);

      setVehicleForm({
        placa: '',
        marca: '',
        modelo: '',
        color: '',
        tipo: 'automovil'
      });
      setAddingVehicle(false);
      setSuccess('Vehículo agregado correctamente');

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al agregar vehículo: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) return;

      setSaving(true);
      setError(null);

      // Filtrar vehículos para eliminar el seleccionado
      const vehiculos = user.vehiculos || [];
      const vehiculosActualizados = vehiculos.filter(v => v.id !== vehicleId);

      // Actualizar usuario sin el vehículo eliminado
      const updatedUser = {
        ...user,
        vehiculos: vehiculosActualizados,
        updated_at: new Date().toISOString()
      };

      setUser(updatedUser);
      updateUser(updatedUser);

      setSuccess('Vehículo eliminado correctamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al eliminar vehículo: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Mi Perfil">
        <div className="bg-gray-50 p-6 min-h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success-quindio mx-auto"></div>
            <p className="mt-4 text-text-secondary">Cargando perfil...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout title="Mi Perfil">
        <div className="bg-gray-50 p-6 min-h-full">
          <div className="max-w-4xl mx-auto">
            <Alert type="error" message="No se pudo cargar la información del perfil" />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Mi Perfil">
      <div className="bg-gray-50 p-6 min-h-full">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-dark">Mi Perfil</h1>
            <Button
              onClick={handleEditToggle}
              variant={editing ? "outline" : "primary"}
              className="flex items-center gap-2"
            >
              {editing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Editar Perfil
                </>
              )}
            </Button>
          </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-text-dark mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Información Personal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              disabled={!editing}
              icon={User}
            />

            <Input
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editing}
              icon={Mail}
            />

            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              disabled={!editing}
              icon={Phone}
            />

            <Input
              label="Documento"
              name="documento"
              value={formData.documento}
              onChange={handleInputChange}
              disabled={!editing}
              icon={CreditCard}
            />

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-text-dark mb-2">
                Tipo de documento
              </label>
              <select
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleInputChange}
                disabled={!editing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-success-quindio transition-all duration-200"
              >
                <option value="cedula">Cédula</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="cedula_extranjeria">Cédula de Extranjería</option>
              </select>
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSaveProfile}
                loading={saving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </Button>
            </div>
          )}
        </div>

        {/* Vehicles Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text-dark flex items-center gap-2">
              <Car className="w-5 h-5" />
              Mis Vehículos
            </h2>
            <Button
              onClick={() => setAddingVehicle(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Vehículo
            </Button>
          </div>

          {/* Vehicle List */}
          {user.vehiculos && user.vehiculos.length > 0 ? (
            <div className="space-y-3">
              {user.vehiculos.map((vehiculo) => (
                <div key={vehiculo.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-success-quindio bg-opacity-10 p-2 rounded-lg">
                      <Car className="w-6 h-6 text-success-quindio" />
                    </div>
                    <div>
                      <h3 className="font-medium text-text-dark">{vehiculo.marca} {vehiculo.modelo}</h3>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span>Placa: <strong>{vehiculo.placa}</strong></span>
                        <span>Color: {vehiculo.color}</span>
                        <span>Tipo: {vehiculo.tipo}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteVehicle(vehiculo.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">
              No tienes vehículos registrados
            </p>
          )}

          {/* Add Vehicle Form */}
          {addingVehicle && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium text-text-dark mb-4">Agregar Nuevo Vehículo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Placa"
                  name="placa"
                  value={vehicleForm.placa}
                  onChange={handleVehicleInputChange}
                  placeholder="ABC123"
                />

                <Input
                  label="Marca"
                  name="marca"
                  value={vehicleForm.marca}
                  onChange={handleVehicleInputChange}
                  placeholder="Toyota"
                />

                <Input
                  label="Modelo"
                  name="modelo"
                  value={vehicleForm.modelo}
                  onChange={handleVehicleInputChange}
                  placeholder="Corolla"
                />

                <Input
                  label="Color"
                  name="color"
                  value={vehicleForm.color}
                  onChange={handleVehicleInputChange}
                  placeholder="Blanco"
                />

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Tipo de vehículo
                  </label>
                  <select
                    name="tipo"
                    value={vehicleForm.tipo}
                    onChange={handleVehicleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-success-quindio transition-all duration-200"
                  >
                    <option value="automovil">Automóvil</option>
                    <option value="motocicleta">Motocicleta</option>
                    <option value="camioneta">Camioneta</option>
                    <option value="bicicleta">Bicicleta</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => {
                    setAddingVehicle(false);
                    setVehicleForm({
                      placa: '',
                      marca: '',
                      modelo: '',
                      color: '',
                      tipo: 'automovil'
                    });
                    setError(null);
                  }}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddVehicle}
                  loading={saving}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Vehículo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-text-dark mb-4">Información de la Cuenta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Tipo de usuario:</span>
              <span className="ml-2 font-medium capitalize">{user.tipo_usuario}</span>
            </div>
            <div>
              <span className="text-text-secondary">Fecha de registro:</span>
              <span className="ml-2 font-medium">
                {new Date(user.fecha_registro).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">Estado:</span>
              <span className={`ml-2 font-medium ${user.activo ? 'text-green-600' : 'text-red-600'}`}>
                {user.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            {user.fecha_actualizacion && (
              <div>
                <span className="text-text-secondary">Última actualización:</span>
                <span className="ml-2 font-medium">
                  {new Date(user.fecha_actualizacion).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;