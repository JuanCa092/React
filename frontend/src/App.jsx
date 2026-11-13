import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./page/Loginpage.jsx";
// Asegúrate de crear e importar correctamente estos componentes:
import ProtectedRoute from "./routes/ProtectedRoute";
//import DashboardLayout from "./page/DashboardLayout.jsx"; // Corregido el posible typo Layour -> Layout
//import DashboardHome from "./page/DashboardHome.jsx";
//import UsuariosPage from "./page/UsuariosPage.jsx";

function NotFoundPage() {
  return <h1 className="text-center mt-5">Página no encontrada</h1>;
}

function App() {
  return (
    <Routes>
      {/* Ruta raíz: manda directo al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="*" element={<NotFoundPage />} />

      {/* Grupo de rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="usuarios" element={<UsuariosPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;