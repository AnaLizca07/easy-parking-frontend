// src/routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import MisReservas from './pages/MisReservas';
import ParqueaderoDetails from './pages/ParqueaderoDetails';
import CrearReserva from './pages/CrearReserva';
import DetalleReserva from './pages/DetalleReserva';
import AdminDashboard from './pages/admin/AdminDashboard';
import ValidarReserva from './pages/admin/ValidarReserva';
import CrearParqueadero from './pages/admin/CrearParqueadero';
import GestionParqueaderos from './pages/admin/GestionParqueaderos';
import SeleccionarParqueadero from './pages/SeleccionarParqueadero';
import ParqueaderoForm from './components/parqueadero/ParqueaderoForm';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/perfil',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/mis-reservas',
    element: (
      <ProtectedRoute>
        <MisReservas />
      </ProtectedRoute>
    ),
  },
  {
    path: '/parqueadero/:id',
    element: (
      <ProtectedRoute>
        <ParqueaderoDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reserva/seleccionar',
    element: (
      <ProtectedRoute>
        <SeleccionarParqueadero />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reserva/nuevo/:parqueaderoId',
    element: (
      <ProtectedRoute>
        <CrearReserva />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reserva/:id',
    element: (
      <ProtectedRoute>
        <DetalleReserva />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="Administrador de Parqueadero">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/validar-reserva',
    element: (
      <ProtectedRoute requiredRole="Administrador de Parqueadero">
        <ValidarReserva />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/parqueaderos',
    element: (
      <ProtectedRoute requiredRole="Administrador de Parqueadero">
        <GestionParqueaderos />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/parqueaderos/nuevo',
    element: (
      <ProtectedRoute requiredRole="Administrador de Parqueadero">
        <ParqueaderoForm />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/crear-parqueadero',
    element: (
      <ProtectedRoute requiredRole="Administrador de Parqueadero">
        <CrearParqueadero />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);