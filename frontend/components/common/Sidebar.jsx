import React from "react";

// Opciones del menú
const opcionesMenu = [
  { texto: "Inicio", ruta: "/dashboard", icono: "bi-house-door", fin: true },
  { texto: "Usuarios", ruta: "/dashboard/Usuarios", icono: "bi-people" },
  { texto: "Categorías", ruta: "/dashboard/Categorias", icono: "bi-tags" },
  { texto: "Subcategorías", ruta: "/dashboard/Subcategorias", icono: "bi-diagram-3" },
  { texto: "Productos", ruta: "/dashboard/productos", icono: "bi-box-seam" }
];

function Sidebar() {
  return (
    <aside
      className="bg-dark text-white d-flex flex-column p-3"
      style={{ width: 240, minHeight: "100vh" }}
    >
      {/* Encabezado */}
      <div className="d-flex align-items-center gap-2 mb-4 px-2">
        <i className="bi bi-boxes fs-4"></i>
        <span className="fs-5 fw-semibold">Inventario React</span>
      </div>

      {/* Menú */}
      <nav>
        <ul className="nav nav-pills flex-column">
          {opcionesMenu.map((opcion, index) => (
            <li className="nav-item" key={index}>
              <a
                href={opcion.ruta}
                className={`nav-link text-white d-flex align-items-center gap-2 ${
                  opcion.fin ? "mt-auto" : ""
                }`}
              >
                <i className={`bi ${opcion.icono}`}></i>
                {opcion.texto}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
