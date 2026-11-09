import { children, createContext, useContext, useEffect, useState } from "react";

//Funcion que llama al backend para validar email/password
import { iniciarSesion } from "../api/authService";

//1) creamos el contexto (una especie de caja compartida)
const AuthContext = createContext(null);

//2) Componente proveedor: envuelve la app y le da tus
//hijos acceso al valor de autenticacion actual
export function AuthProvider({ children }) {
    //usuario: datos publicos del usuario logueado (o null si no hay sesion)
    const [usuario, setUsuario] = useState(null);

    //cargando: true mientras revisamos si ya habia una sesion guardada
    //en el localStorage (por ejemplo al recargar la pagina con F5)
    const [cargando, setCargando] = useState(true);

    //useEffect con arreglo vacio [] -> se ejecuta UNA sola vez,
    //Justo cuando la app arranca
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        const tokenGuardado = localStorage.getItem('token');
    
    // si el localStorage hay usuario y token de una sesion anterior,
    //restauramos esa sesion sin obligar a vover a hacer login
        if (usuarioGuardado && tokenGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
        setCargando(false);
    }, []);

    //funcion de login, la llama LoginPage cuando el usuario envia  el formulario

    async function login(email, password) {
        //Puede lanzar un error (por ejemplo credenciales invalidas)
        const {token, usuario: UsuarioRecibido } = await
        iniciarSesion(email, password);

        //Guardamos la sesion en el localStorage para que sobreviva a un F5 
        localStorage.setItem('token', token);
        localStorage.setItem('usuario',JSON.stringify (UsuarioRecibido));

        //Funcion de logout borra la sesion del localStorage como el estado 
        function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            setUsuario(null);
        }
        const value = {
            usuario,
            cargando,
            estadoAutenticado: !!usuario,
            login,
            logout
        }
    }

    return <AuthContext.Provider value= {value}></AuthContext.Provider>;
}
/**
 * Hook personalizado para consumir el contexto mas facil
 */
export function useAuth() {
    //lee el valor actual del contexto (Usuario, cargando, login, logout)
    const contexto = useContext
    (AuthContext);
    if (!contexto) {
        throw new Error('useAuth debe usarse dentro de un <authProvider>');
    }
}
