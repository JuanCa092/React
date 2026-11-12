/**
 * componente guardan de ruta se usa para envolver las rutas d dashboard en app.jsx si el usuario no esta iniciando sesion lo redirige
 * automaticamente a /login en vez de mostrar el contenido 
 */

//navigate redirige a otra ruta; Oulet rendriza la ruta hija activa
import {Navigate, Oulet } from 'react-router-dom';
//hook para leer el estado de sesion (Usuariom Cargando ...)
import { useAuth } from './context/authContext.jsx';