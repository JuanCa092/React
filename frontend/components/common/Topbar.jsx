import { NavLink } from "react-router-dom";

const opcionesMenu = [
  { texto: "inicio", ruta: "/dashboard/inicio", icono: "bi-house", fin: true },
  { texto: "usuarios", ruta: "/dashboard/usuarios", icono: "bi-people", fin: false },
  { texto: "categorias", ruta: "/dashboard/subcategorias", icono: "bi-tags", fin: false },
];

function Sidebar() {
  return (
    <aside
      className="bg-dark text-white d-flex flex-column p-3"
      style={{ width: 240, minHeight: "100vh" }}
    >
      <div className="d-flex align-items-center gap-2 mb-4 px-2">
        <i className="bi bi-boxes fs-5"></i>
        <span className="fs-5 fw-semibold">Inventario React</span>
      </div>

      <nav className="nav nav-pills flex-column gap-1">
        {opcionesMenu.map((opcion) => (
          <NavLink
            key={opcion.ruta}
            to={opcion.ruta}
            end={opcion.fin}
            className={({ isActive }) =>
              "nav-link d-flex align-items-center gap-2 text-white" +
              (isActive ? " active bg-primary" : "")
            }
          >
            <i className={`bi ${opcion.icono}`}></i>
            {opcion.texto}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;