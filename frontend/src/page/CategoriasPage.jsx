

// Hook de estado local (controla que modal esta abierto)
import { useState } from 'react';
// Hook generico de CRUD simulado (lista + agregar + actualizar + alternarEstado)
import useCrudSimulado from '../hooks/useCrudSimulado';
// Datos iniciales por si localStorage todavia no tiene nada guardado
import mockCategorias from '../data/mockCategorias';
// Modal con el formulario de crear/editar categoria
import CategoriaFormModal from '../components/categorias/CategoriaFormModal';
// Modal generico de confirmacion (para activar/desactivar)
import ConfirmModal from '../components/common/ConfirmModal';
// Etiqueta visual de "Activo"/"Inactivo"
import EstadoBadge from '../components/common/EstadoBadge';

// No recibe props: es el "element" de la ruta /dashboard/categorias en App.jsx
function CategoriasPage() {
  // "categorias" viene de localStorage bajo la clave 'categorias'
  const { lista: categorias, agregar, actualizar, alternarEstado } = useCrudSimulado('categorias', mockCategorias);

  // Controla si el modal de crear/editar esta visible
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // Guarda la categoria que se esta editando; null = se esta creando una nueva
  const [registroEditar, setRegistroEditar] = useState(null);
  // Guarda el id de la categoria a la que se le va a cambiar el estado
  const [idConfirmar, setIdConfirmar] = useState(null);

  // Abre el modal en modo "crear" (sin registro previo que cargar)
  function abrirCrear() {
    setRegistroEditar(null);
    setMostrarFormulario(true);
  }

  // Abre el modal en modo "editar", precargando la categoria clickeada
  function abrirEditar(categoria) {
    setRegistroEditar(categoria);
    setMostrarFormulario(true);
  }

  // Se ejecuta cuando el formulario del modal se envia: decide si actualiza
  // un registro existente o agrega uno nuevo, y cierra el modal
  function guardarCategoria(datos) {
    if (registroEditar) {
      actualizar(registroEditar.id, datos);
    } else {
      agregar(datos);
    }
    setMostrarFormulario(false);
  }

  // Aplica el cambio de estado confirmado en el ConfirmModal y lo cierra
  function confirmarCambioEstado() {
    alternarEstado(idConfirmar);
    setIdConfirmar(null);
  }

  // Buscamos la categoria que se va a activar/desactivar solo para armar
  // un mensaje de confirmacion mas claro (con su nombre)
  const categoriaAConfirmar = categorias.find((c) => c.id === idConfirmar);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Gestion de categorias</h2>
        <button className="btn btn-primary" onClick={abrirCrear}>
          <i className="bi bi-plus-lg me-1"></i>
          Nueva categoria
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Recorremos la lista de categorias y pintamos una fila por cada una */}
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nombre}</td>
                  <td className="text-muted">{categoria.descripcion}</td>
                  <td>
                    <EstadoBadge activo={categoria.activo} />
                  </td>
                  <td className="text-end">
                    {/* Editar: abre el modal precargado con esta categoria */}
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => abrirEditar(categoria)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    {/* Activar/desactivar: solo dispara la confirmacion;
                        el color e icono reflejan el estado actual */}
                    <button
                      className={`btn btn-sm ${categoria.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => setIdConfirmar(categoria.id)}
                    >
                      <i className={`bi ${categoria.activo ? 'bi-slash-circle' : 'bi-check-circle'}`}></i>
                    </button>
                  </td>
                </tr>
              ))}

              {/* Si no hay ninguna categoria en la lista, mostramos un mensaje */}
              {categorias.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No hay categorias registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* El modal solo se pinta activo cuando mostrarFormulario es true */}
      <CategoriaFormModal
        mostrar={mostrarFormulario}
        registroEditar={registroEditar}
        onGuardar={guardarCategoria}
        onCerrar={() => setMostrarFormulario(false)}
      />

      {/* Aparece apenas se hace clic en cualquier boton de activar/desactivar */}
      <ConfirmModal
        mostrar={idConfirmar !== null}
        titulo={categoriaAConfirmar?.activo ? 'Desactivar categoria' : 'Activar categoria'}
        mensaje={`¿Seguro que quieres ${categoriaAConfirmar?.activo ? 'desactivar' : 'activar'} "${categoriaAConfirmar?.nombre}"?`}
        onConfirmar={confirmarCambioEstado}
        onCancelar={() => setIdConfirmar(null)}
      />
    </div>
  );
}

// Exportamos la pagina para usarla en la ruta /dashboard/categorias
export default CategoriasPage;
