import { Navigate, Route, Routes } from 'react-router-dom';

// Guardian que protege las rutas privadas del dashboard
import ProtectedRoute from './routees/ProtectedRoutes';
// Esqueleto visual (sidebar + topbar) que comparten las paginas del dashboard
import DashboardLayout from './layoust/DashboardLayout';

// Paginas publicas y privadas de la aplicacion
import LoginPage from './page/LoginPage';
import DashboardHome from './page/DashboardHome';
import UsuariosPage from './page/UsuarioPage';
import CategoriasPage from './page/CategoriasPage';
import SubcategoriasPage from './page/SubcategoriasPage';
import ProductosPage from './page/ProductosPage';
import NotFoundPage from './page/NotFoundPage';

// Componente raiz: se renderiza dentro de <BrowserRouter> (ver main.jsx)
function App() {
  return (
    <Routes>
      {/* Ruta raiz: manda directo al login (si ya hay sesion,
          ProtectedRoute se encargara de dejarlo pasar al dashboard) */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Ruta publica: cualquiera puede entrar a /login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Grupo de rutas PROTEGIDAS: todo lo que este dentro de este
          <Route> solo se muestra si ProtectedRoute confirma que hay
          sesion activa; si no, redirige a /login. */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* index = lo que se muestra en exactamente "/dashboard" */}
          <Route index element={<DashboardHome />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          
          
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="subcategorias" element={<SubcategoriasPage />} />
          <Route path="productos" element={<ProductosPage />} />
        </Route>
      </Route>

      {/* Cualquier otra URL que no coincida con las anteriores */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Exportamos App para que main.jsx lo pueda renderizar
export default App;
