import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Ventas from '@pages/Ventas';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import Mantenimiento from '@pages/Mantenimiento';
import Orden from '@pages/Orden'; // Importa la nueva página de órdenes
import Inventario from '@pages/Inventario';
import Pagos from '@pages/Pagos';
import Facturas from '@pages/Facturas';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/maintenance',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'tecnico']}>
            <Mantenimiento />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'tecnico']}>
            <Orden />
          </ProtectedRoute>
        ),
      },
      {
        path: '/sales',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'tecnico']}>
            <Ventas />
          </ProtectedRoute>
        ),
      },
      {
        path: '/inventory',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'tecnico']}>
            <Inventario />
          </ProtectedRoute>
        ),
      },
      {
        path: '/pagos',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Pagos />
          </ProtectedRoute>
        ),
      },
      {
        path: 'facturas',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'tecnico']}>
            <Facturas />
          </ProtectedRoute>
        ),
      }
    ],
  },
  {
    path: '/auth',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
