/**
- barra superior del dashboard muestra el nombre del usuario
- loguendo (viene del authcontext) y un boton para
- cerrar sesion 
 */
//hook para navegar progamaticamente (sin que el usuario haga clik en un link)
import { useNavigate } from 'react-router-dom';
//hook paras leer el usuario logueado y la funcion logout
import { useAuth } from '../../src/context/authContext';
//no recibe props toma todo lo que necesita el authcontext
function Topbar(){
    //usuario datos que quien inicion sesion; logout borra la sesion
    const {usuario, logout } = useAuth();
    //funcion para cambiar de url desde javascript
    const navigate = useNavigate();
//el cerrar sesion limpiamos el contexto/localstorage y
//mandamos al usuario de vuelta a la pantalla login
function manejarLogout() {
    logout();
    navigate('/login', { replace: true });
}

return (
    <nav className='navbar navbar-lighr bg-white border-bottom px-4 py-3'>
    <span className='navbar-brand mb-0 h1 fs-6 text-muted'>panel de administracion</span>
    
    <div className='d-flex align-items-center gap-3'>
    <div className='text-end d-none d-sm-block'>
        <div className='fw-semibold'>{usuario?.nombre}</div>
    <small className='text-muted text-capitalize'>{usuario?.rol}

    </small>
        </div>
        <button className='btn btn-outline-danger btn-sm d-flex
        align-items-center gap-1' onClick={manejarLogout}>
        <i className='bi bi-box-arrow-right'></i>
        salir
        </button>
    </div>
    
    </nav>
    );
}

export default Topbar;