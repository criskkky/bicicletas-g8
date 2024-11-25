import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Sales from '@pages/Sales';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import Maintenance from '@pages/Maintenance';
import Orders from '@pages/Orders'; // Importa la nueva página de órdenes
import Inventory from '@pages/Inventory';

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
            <Maintenance />
          </ProtectedRoute>
        ),
      },
      {
        path: '/orders',  // Nueva ruta para las órdenes
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'tecnico']}>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: '/sales',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'tecnico']}>
            <Sales />
          </ProtectedRoute>
        ),
      },
      {
        path: '/inventory',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'tecnico']}>
            <Inventory />
          </ProtectedRoute>
        ),
      },   
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
