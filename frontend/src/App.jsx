import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./page/Loginpage.jsx";
// Asegúrate de crear e importar correctamente estos componentes:
import ProtectedRoute from "../src/routees/ProtectedRoutes.jsx";
import DashboardLayout from "./layoust/DashboardLayout.jsx"; // Corregido el posible typo Layour -> Layout
import DashboardHome from "./page/DashboardHome.jsx";
import PlaceholderPage from "./page/PlaceholderPage.jsx";

function NotFoundPage() {
  return <h1 className="text-center mt-5">Página no encontrada</h1>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="usuarios" element={<PlaceholderPage titulo="Usuarios" />} />
          <Route path="categorias" element={<PlaceholderPage titulo="Categorías" />} />
          <Route path="subcategorias" element={<PlaceholderPage titulo="Subcategorías" />} />
          <Route path="productos" element={<PlaceholderPage titulo="Productos" />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}



export default App;
