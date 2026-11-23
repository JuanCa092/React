
// useState: estado del formulario; useEffect: sincronizarlo cuando cambia el registro a editar
import { useEffect, useState } from 'react';

// Valores vacios que usamos para arrancar el formulario en modo "crear"
const FORMULARIO_VACIO = { nombre: '', categoriaId: '' };

// mostrar: si el modal se ve; registroEditar: subcategoria a editar (o null
// si es nueva); categorias: lista para el <select>; onGuardar/onCerrar:
// funciones que decide SubcategoriasPage
function SubcategoriaFormModal({ mostrar, registroEditar, categorias, onGuardar, onCerrar }) {
  // Estado local con los valores actuales de los campos del formulario
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

  // Sincroniza el formulario cada vez que cambia registroEditar, se abre
  // el modal, o cambia la lista de categorias disponibles.
  useEffect(() => {
    if (registroEditar) {
      // Modo edicion: precarga los datos de la subcategoria clickeada
      setFormulario({ nombre: registroEditar.nombre, categoriaId: registroEditar.categoriaId });
    } else {
      // Al crear una nueva, preseleccionamos la primera categoria activa
      // disponible para que el <select> nunca quede vacio.
      const primeraActiva = categorias.find((c) => c.activo);
      setFormulario({ nombre: '', categoriaId: primeraActiva ? primeraActiva.id : '' });
    }
  }, [registroEditar, mostrar, categorias]);

  // Si el padre no pidio mostrar el modal, no renderizamos nada
  if (!mostrar) return null;

  function manejarCambio(evento) {
    // name/value vienen del atributo name="" y del valor actual del campo
    const { name, value } = evento.target;
    // categoriaId debe guardarse como numero (para que coincida con
    // el "id" numerico de mockCategorias), por eso convertimos con Number()
    setFormulario((anterior) => ({ ...anterior, [name]: name === 'categoriaId' ? Number(value) : value }));
  }

  // Se ejecuta al enviar el formulario (boton "Guardar" o Enter)
  function manejarEnvio(evento) {
    evento.preventDefault(); // evita que el navegador recargue la pagina
    onGuardar(formulario); // le pasamos los datos al componente padre
  }

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <form className="modal-content" onSubmit={manejarEnvio}>
            <div className="modal-header">
              <h5 className="modal-title">{registroEditar ? 'Editar subcategoria' : 'Nueva subcategoria'}</h5>
              <button type="button" className="btn-close" onClick={onCerrar}></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Categoria</label>
                <select
                  className="form-select"
                  name="categoriaId"
                  value={formulario.categoriaId}
                  onChange={manejarCambio}
                  required
                >
                  {/* Recorremos las categorias recibidas por props y
                      generamos una <option> por cada una */}
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id} disabled={!categoria.activo}>
                      {categoria.nombre} {!categoria.activo ? '(inactiva)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// Exportamos el componente para usarlo en SubcategoriasPage.jsx
export default SubcategoriaFormModal;
