import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Outlet para renderizar rutas hijas
import { useAuth } from '../context/authContext.jsx'; // Hook personalizado para autenticación

function ProtectedRoute() {
  // Desestructuración correcta del hook
  const { estaAutenticado, cargando } = useAuth();

  // Mostrar spinner mientras carga el estado de autenticación
  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <span className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar la ruta protegida
  return <Outlet />;
}



export default ProtectedRoute;
