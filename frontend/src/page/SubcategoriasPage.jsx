
// Hook de estado local (controla que modal esta abierto)
import { useState } from 'react';
// Hook generico de CRUD simulado (lista + agregar + actualizar + alternarEstado)
import useCrudSimulado from '../hooks/useCrudSimulado';
// Datos iniciales por si localStorage todavia no tiene nada guardado
import mockCategorias from '../data/mockCategorias';
import mockSubcategorias from '../data/mockSubcategorias';
// Modal con el formulario de crear/editar subcategoria
import SubcategoriaFormModal from '../components/subcategorias/SubcategoriaFormModal';
// Modal generico de confirmacion (para activar/desactivar)
import ConfirmModal from '../components/common/ConfirmModal';
// Etiqueta visual de "Activo"/"Inactivo"
import EstadoBadge from '../components/common/EstadoBadge';

// No recibe props: es el "element" de la ruta /dashboard/subcategorias en App.jsx
function SubcategoriasPage() {
  // Ojo: usamos la MISMA clave 'categorias' que usa CategoriasPage,
  // asi ambas pantallas leen y escriben sobre el mismo dato guardado
  // en localStorage (no son dos copias independientes).
  const { lista: categorias } = useCrudSimulado('categorias', mockCategorias);
  // "subcategorias" viene de localStorage bajo la clave 'subcategorias'
  const {
    lista: subcategorias,
    agregar,
    actualizar,
    alternarEstado,
  } = useCrudSimulado('subcategorias', mockSubcategorias);

  // Controla si el modal de crear/editar esta visible
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // Guarda la subcategoria que se esta editando; null = se esta creando una nueva
  const [registroEditar, setRegistroEditar] = useState(null);
  // Guarda el id de la subcategoria a la que se le va a cambiar el estado
  const [idConfirmar, setIdConfirmar] = useState(null);

  // Dado un categoriaId, busca el nombre de esa categoria para pintarlo
  // en la tabla (simula lo que en SQL seria un JOIN).
  function nombreCategoria(categoriaId) {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nombre : 'Sin categoria';
  }

  // Abre el modal en modo "crear" (sin registro previo que cargar)
  function abrirCrear() {
    setRegistroEditar(null);
    setMostrarFormulario(true);
  }

  // Abre el modal en modo "editar", precargando la subcategoria clickeada
  function abrirEditar(subcategoria) {
    setRegistroEditar(subcategoria);
    setMostrarFormulario(true);
  }

  // Se ejecuta cuando el formulario del modal se envia: decide si actualiza
  // un registro existente o agrega uno nuevo, y cierra el modal
  function guardarSubcategoria(datos) {
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

  // Buscamos la subcategoria que se va a activar/desactivar para armar
  // un mensaje de confirmacion mas claro (con su nombre)
  const subcategoriaAConfirmar = subcategorias.find((s) => s.id === idConfirmar);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Gestion de subcategorias</h2>
        <button className="btn btn-primary" onClick={abrirCrear}>
          <i className="bi bi-plus-lg me-1"></i>
          Nueva subcategoria
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Categoria</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Recorremos la lista de subcategorias y pintamos una fila por cada una */}
              {subcategorias.map((subcategoria) => (
                <tr key={subcategoria.id}>
                  <td>{subcategoria.nombre}</td>
                  <td className="text-muted">{nombreCategoria(subcategoria.categoriaId)}</td>
                  <td>
                    <EstadoBadge activo={subcategoria.activo} />
                  </td>
                  <td className="text-end">
                    {/* Editar: abre el modal precargado con esta subcategoria */}
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => abrirEditar(subcategoria)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    {/* Activar/desactivar: solo dispara la confirmacion */}
                    <button
                      className={`btn btn-sm ${subcategoria.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => setIdConfirmar(subcategoria.id)}
                    >
                      <i className={`bi ${subcategoria.activo ? 'bi-slash-circle' : 'bi-check-circle'}`}></i>
                    </button>
                  </td>
                </tr>
              ))}

              {/* Si no hay ninguna subcategoria en la lista, mostramos un mensaje */}
              {subcategorias.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No hay subcategorias registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* El modal solo se pinta activo cuando mostrarFormulario es true;
          "categorias" alimenta el <select> del formulario */}
      <SubcategoriaFormModal
        mostrar={mostrarFormulario}
        registroEditar={registroEditar}
        categorias={categorias}
        onGuardar={guardarSubcategoria}
        onCerrar={() => setMostrarFormulario(false)}
      />

      {/* Aparece apenas se hace clic en cualquier boton de activar/desactivar */}
      <ConfirmModal
        mostrar={idConfirmar !== null}
        titulo={subcategoriaAConfirmar?.activo ? 'Desactivar subcategoria' : 'Activar subcategoria'}
        mensaje={`¿Seguro que quieres ${subcategoriaAConfirmar?.activo ? 'desactivar' : 'activar'} "${subcategoriaAConfirmar?.nombre}"?`}
        onConfirmar={confirmarCambioEstado}
        onCancelar={() => setIdConfirmar(null)}
      />
    </div>
  );
}

// Exportamos la pagina para usarla en la ruta /dashboard/subcategorias
export default SubcategoriasPage;
