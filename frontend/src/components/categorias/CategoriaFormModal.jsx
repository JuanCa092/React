
// useState: estado del formulario; useEffect: sincronizarlo cuando cambia el registro a editar
import { useEffect, useState } from 'react';

// Valores vacios que usamos para arrancar el formulario en modo "crear"
const FORMULARIO_VACIO = { nombre: '', descripcion: '' };

// mostrar: si el modal se ve; registroEditar: categoria a editar (o null
// si es nueva); onGuardar/onCerrar: funciones que decide CategoriasPage
function CategoriaFormModal({ mostrar, registroEditar, onGuardar, onCerrar }) {
  // Estado local con los valores actuales de los campos del formulario
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

  // Cada vez que cambia registroEditar o se abre el modal, sincronizamos
  // el formulario: carga los datos si es edicion, o lo deja vacio si es creacion.
  useEffect(() => {
    setFormulario(
      registroEditar
        ? { nombre: registroEditar.nombre, descripcion: registroEditar.descripcion }
        : FORMULARIO_VACIO
    );
  }, [registroEditar, mostrar]);

  // Si el padre no pidio mostrar el modal, no renderizamos nada
  if (!mostrar) return null;

  // Actualiza un campo especifico del formulario sin tocar los demas
  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
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
              <h5 className="modal-title">{registroEditar ? 'Editar categoria' : 'Nueva categoria'}</h5>
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
                <label className="form-label">Descripcion</label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  rows="3"
                  value={formulario.descripcion}
                  onChange={manejarCambio}
                />
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

// Exportamos el componente para usarlo en CategoriasPage.jsx
export default CategoriaFormModal;
