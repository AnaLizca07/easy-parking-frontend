// src/routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import MisReservas from './pages/MisReservas';
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
    path: '/reservas',
    element: (
      <ProtectedRoute>
        <MisReservas />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);