/**
 * esqueleto  visual que comparten todas las paginas del ppanel 
 * (inicio, usuarios, categorias, subcategorias, productos):
 * sidebar a la izquieda + topbar arriba + el contenido de la pagina
 * 
 * 
 * /*/

import { Outlet } from "react-router-dom";
//menu lateral de navegacion
import Sidebar from '../../components/common/Sidebar.jsx';
//barra superior con usuario y boton de salir 
import Topbar from '../../components/common/Topbar.jsx';

//no recibe props: se usa como elemnt 
function DashBoardLayout() {
    return (
        <div className="d-flex">
            <Sidebar/>
            {/* flex-grow-1 hace que esta columna agrupe todo el espacio restante despues del ancho fijo en sidebar */}
            <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
                <Topbar />
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashBoardLayout;