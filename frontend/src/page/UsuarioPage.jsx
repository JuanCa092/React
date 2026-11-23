import { useState } from 'react';
import useCrudSimulado from '../hooks/useCrudSimulado';
import mockUsuarios from '../data/mockUsuarios';
import UsuarioFormModal from '../components/usuarios/UsuarioFormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import EstadoBadge from '../components/common/EstadoBadge';

function UsuariosPage() {
  const { lista: usuarios, agregar, actualizar, alternarEstado } = useCrudSimulado('usuarios', mockUsuarios);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [registroEditar, setRegistroEditar] = useState(null);
  const [idConfirmar, setIdConfirmar] = useState(null);

  function abrirCrear() {
    setRegistroEditar(null);
    setMostrarFormulario(true);
  }

  function abrirEditar(usuario) {
    setRegistroEditar(usuario);
    setMostrarFormulario(true);
  }

  function guardarUsuario(datos) {
    if (registroEditar) {
      actualizar(registroEditar.id, datos);
    } else {
      agregar(datos);
    }
    setMostrarFormulario(false);
  }

  function confirmarCambioEstado() {
    alternarEstado(idConfirmar);
    setIdConfirmar(null);
  }

  const usuarioAConfirmar = usuarios.find((usuario) => usuario.id === idConfirmar);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Gestion de usuarios</h2>
        <button className="btn btn-primary" onClick={abrirCrear}>
          <i className="bi bi-plus-lg me-1"></i>
          Nuevo usuario
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre}</td>
                  <td className="text-muted">{usuario.email}</td>
                  <td className="text-capitalize">{usuario.rol}</td>
                  <td><EstadoBadge activo={usuario.activo} /></td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => abrirEditar(usuario)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className={`btn btn-sm ${usuario.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => setIdConfirmar(usuario.id)}
                    >
                      <i className={`bi ${usuario.activo ? 'bi-slash-circle' : 'bi-check-circle'}`}></i>
                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UsuarioFormModal
        mostrar={mostrarFormulario}
        registroEditar={registroEditar}
        onGuardar={guardarUsuario}
        onCerrar={() => setMostrarFormulario(false)}
      />

      <ConfirmModal
        mostrar={idConfirmar !== null}
        titulo={usuarioAConfirmar?.activo ? 'Desactivar usuario' : 'Activar usuario'}
        mensaje={`¿Seguro que quieres ${usuarioAConfirmar?.activo ? 'desactivar' : 'activar'} "${usuarioAConfirmar?.nombre}"?`}
        onConfirmar={confirmarCambioEstado}
        onCancelar={() => setIdConfirmar(null)}
      />
    </div>
  );
}

export default UsuariosPage;