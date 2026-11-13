/**
 * esqueleto visual que compartan todas las paginas del panel
 * (Inicio, Usuarios, categorias, subcategorias, productos):
 * sidebar a la izquierda +Topbar arriba + el contenido de la 
 * pagina actual en el medio
 */

//Oulet que marca el punto de donde se pinta la ruta hija activa
import {Outle} from 'react-router-dom';
//menu lateral
import Sideebar from '../../components/common/Sidebar.jsx';
//barra superior con usuario y boton de salir
import Topbar from '../../components/common/Topbar.jsx';

function DashboardLayout() {
    return (
    <div Classname="d-flex">
        <Sideebar/>
        {/**flex-grow-1 hace que esta columna ocupe todo el espacio restante */}
        <div className="flex-grow-1 d-flex 
        flex-column" style={{ minHeight: '100hv', backgroundColor: '#f4f6f9'}}>

        </div>
    </div>
    )
}