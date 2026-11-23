// useState: estado del formulario; useEffect: sincronizarlo cuando cambia el registro a editar
import { useEffect, useState } from 'react';

// Valores vacios que usamos para arrancar el formulario en modo "crear"
const FORMULARIO_VACIO = { nombre: '', email: '', rol: 'vendedor' };

// mostrar: si el modal se ve; registroEditar: usuario a editar (o null si
// es nuevo); onGuardar/onCerrar: funciones que decide UsuariosPage
function UsuarioFormModal({ mostrar, registroEditar, onGuardar, onCerrar }) {
  // Estado local del formulario (lo que el usuario va escribiendo)
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

  // Cada vez que cambia "registroEditar" (por ejemplo, el usuario le
  // dio clic a "Editar" en otra fila), sincronizamos el formulario:
  // si hay registro, cargamos sus datos; si no, dejamos el formulario vacio.
  useEffect(() => {
    setFormulario(registroEditar ? { nombre: registroEditar.nombre, email: registroEditar.email, rol: registroEditar.rol } : FORMULARIO_VACIO);
  }, [registroEditar, mostrar]);

  // Si el padre no pidio mostrar el modal, no renderizamos nada
  if (!mostrar) return null;

  // Actualiza un campo especifico del formulario sin tocar los demas.
  // "name" viene del atributo name="" de cada <input>/<select>.
  function manejarCambio(evento) {
    // name/value vienen del atributo name="" y del valor actual del input
    const { name, value } = evento.target;
    // Mezclamos el campo que cambio sobre el formulario anterior,
    // dejando los demas campos intactos
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

  // Se ejecuta al enviar el formulario (boton "Guardar" o Enter)
  function manejarEnvio(evento) {
    evento.preventDefault(); // evita que el navegador recargue la pagina
    onGuardar(formulario); // le pasamos los datos al componente padre (UsuariosPage)
  }

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <form className="modal-content" onSubmit={manejarEnvio}>
            <div className="modal-header">
              <h5 className="modal-title">{registroEditar ? 'Editar usuario' : 'Nuevo usuario'}</h5>
              <button type="button" className="btn-close" onClick={onCerrar}></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
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
                <label className="form-label">Correo electronico</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formulario.email}
                  onChange={manejarCambio}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Rol</label>
                <select className="form-select" name="rol" value={formulario.rol} onChange={manejarCambio}>
                  <option value="admin">Administrador</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="bodeguero">Bodeguero</option>
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

// Exportamos el componente para usarlo en UsuariosPage.jsx
export default UsuarioFormModal;
