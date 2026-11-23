// useState: estado del formulario; useEffect: sincronizarlo cuando cambia el registro a editar
import { useEffect, useState } from 'react';

// Valores vacios que usamos para arrancar el formulario en modo "crear"
const FORMULARIO_VACIO = { nombre: '', subcategoriaId: '', precio: '', stock: '' };

// mostrar: si el modal se ve; registroEditar: producto a editar (o null si
// es nuevo); subcategorias: lista para el <select>; onGuardar/onCerrar:
// funciones que decide ProductosPage
function ProductoFormModal({ mostrar, registroEditar, subcategorias, onGuardar, onCerrar }) {
  // Estado local con los valores actuales de los campos del formulario
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

  // Sincroniza el formulario cada vez que cambia registroEditar, se abre
  // el modal, o cambia la lista de subcategorias disponibles.
  useEffect(() => {
    if (registroEditar) {
      // Modo edicion: precarga los datos del producto clickeado
      setFormulario({
        nombre: registroEditar.nombre,
        subcategoriaId: registroEditar.subcategoriaId,
        precio: registroEditar.precio,
        stock: registroEditar.stock,
      });
    } else {
      // Modo creacion: preseleccionamos la primera subcategoria activa
      // para que el <select> nunca quede vacio
      const primeraActiva = subcategorias.find((s) => s.activo);
      setFormulario({ ...FORMULARIO_VACIO, subcategoriaId: primeraActiva ? primeraActiva.id : '' });
    }
  }, [registroEditar, mostrar, subcategorias]);

  // Si el padre no pidio mostrar el modal, no renderizamos nada
  if (!mostrar) return null;

  function manejarCambio(evento) {
    // name/value vienen del atributo name="" y del valor actual del campo
    const { name, value } = evento.target;

    // precio, stock y subcategoriaId deben guardarse como numero,
    // no como texto, para poder sumarlos/compararlos despues.
    const esCampoNumerico = ['precio', 'stock', 'subcategoriaId'].includes(name);
    setFormulario((anterior) => ({ ...anterior, [name]: esCampoNumerico ? Number(value) : value }));
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
              <h5 className="modal-title">{registroEditar ? 'Editar producto' : 'Nuevo producto'}</h5>
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
                <label className="form-label">Subcategoria</label>
                <select
                  className="form-select"
                  name="subcategoriaId"
                  value={formulario.subcategoriaId}
                  onChange={manejarCambio}
                  required
                >
                  {subcategorias.map((subcategoria) => (
                    <option key={subcategoria.id} value={subcategoria.id} disabled={!subcategoria.activo}>
                      {subcategoria.nombre} {!subcategoria.activo ? '(inactiva)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Precio (COP)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    name="precio"
                    value={formulario.precio}
                    onChange={manejarCambio}
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    name="stock"
                    value={formulario.stock}
                    onChange={manejarCambio}
                    required
                  />
                </div>
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

// Exportamos el componente para usarlo en ProductosPage.jsx
export default ProductoFormModal;
