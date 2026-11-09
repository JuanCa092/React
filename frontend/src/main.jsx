//Ayuda a detectar errores comunes en el desarollo

import { StrictMode } from 'react'

//en la funcion moderna de react 10+ para montar la aplicacion en dom
import { createRoot } from 'react-dom/client'

//Habilita el manejo de laS RUTAS BASADO EN LAS URL DEL NAVEGADOR
import {BrowserRouter} from 'react-router-dom';

//Estilos de bootstrap clases omo btn, container, table y demas
import 'bootstrap/dist/css/bootstrap.min.css';

//Iconos de bootstrap clases como bi bi-trash
import 'bootstrap-icons/font/bootstrap-icons.css';

//javascript de bootstrap neesarios para que funcionen los modales
//dropdowns y el menu de navegacion responsive
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

//Estilos propios del proyecto se cargan solos despues del bootstrap
//Describe detalles puntuales de la aplicacion
import './index.css'

//Componente rain con todas las rutas  de la aplicacion 
import App from './App.jsx'

//proveedor del contexto de sesion (ver context/AuthContext.jsx)
import {AuthProvider} from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom'

//Busca el <div id="root"> de index.html y engancha react ahi dentro
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
    
    <AuthProvider>
    <App />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
