//piezas de react -routes-dom Routes/route define el mapa de rutas
// navigate sirve para redirigir  de una ruta a otra
import { Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./page/Loginpage.jsx";
//Guardian que protege las rutas privadas del dashboard
//import ProtectedRoute from '.routes/ProtectedRoute';

function NotFoundPage() {
  return <h1 className="text-center mt-5">Pagina no encontada</h1>;
}

function App() {
  return (
    <Routes>
      {/* Ruta raiz: manda directo al login (si ya hay sesion,
      protectedRoute se encarga de dejarlo pasar al dashboard) */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;
