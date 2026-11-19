/**
 * Página de bienvenida del dashboard (ruta /dashboard)
 * Muestra el conteo de registros activos de cada módulo simulado.
 */

// Hook para leer el usuario logueado (mostrar su nombre en el saludo)
import { useAuth } from '../context/authContext.jsx';

// Tarjeta reutilizable para mostrar un número grande con su etiqueta
// Recibe: icono (clase de Bootstrap Icons), titulo, total (número) y color
function TarjetaResumen({ icono, titulo, total, color }) {
  return (
    <div className="col-sm-6 col-lg-3">
      <div className={`card border-0 shadow-sm border-start border-4 border-${color}`}>
        <div className="card-body d-flex align-items-center gap-3">
          <i className={`bi ${icono} fs-1 text-${color}`}></i>
          <div>
            <div className="fs-3 fw-bold">{total}</div>
            <div className="text-muted small">{titulo}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// No recibe props: es el "element" de la ruta index de /dashboard en App.jsx
function DashboardHome() {
  // Solo necesitamos el usuario logueado para mostrar su nombre
  const { usuario } = useAuth();

  const usuarios = [
    { activo: true },
    { activo: true },
    { activo: false }
  ];
  const categorias = [
    { activo: true },
    { activo: true },
    { activo: false }
  ];
  const subcategorias = [
    { activo: true },
    { activo: false }
  ];
  const productos = [
    { activo: true },
    { activo: true },
    { activo: true }
  ];

  return (
    <div>
      <h2 className="h4 mb-1">Hola, {usuario?.nombre ?? 'Usuario'}</h2>
      <p className="text-muted mb-4">
        Este es el resumen general del sistema de inventario
      </p>

      <div className="row g-3">
        <TarjetaResumen
          icono="bi-people"
          titulo="Usuarios activos"
          total={usuarios.filter((u) => u.activo).length}
          color="primary"
        />

        <TarjetaResumen
          icono="bi-diagram-3"
          titulo="Subcategorías activas"
          total={subcategorias.filter((s) => s.activo).length}
          color="success"
        />

        <TarjetaResumen
          icono="bi-tags"
          titulo="Categorías activas"
          total={categorias.filter((c) => c.activo).length}
          color="warning"
        />

        <TarjetaResumen
          icono="bi-box-seam"
          titulo="Productos activos"
          total={productos.filter((p) => p.activo).length}
          color="danger"
        />
      </div>

      <div className="alert alert-info mt-4 mb-0">
        <i className="bi bi-info-circle me-2"></i>
        Resumen general del inventario.
      </div>
    </div>
  );
}

export default DashboardHome;