/**
 * Pantalla login funcional
 * 
 * Pantalla publica de inicio de sesion es la unica parte del sistema que habla con base de datos
 * mysql atraves del backend de express si las credenciales son correctas
 */

import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function LoginPage () {
    const {login} = useAuth;
    const navigate = useNavigate();
    const [email, setEmail] = useState ('');
    const [password, setPassword] = useState ('');

    const [error, setError] =useState ('');
    const [enviado, setEnviado]= useState(false);
    async function manejarEnvio(evento) {
        evento.preventDefault();
        setError('');
        setEnviado(true);
        
        try {
            //login() esta definido en authContexto al llamar al backend guarda el token del usuario y actualiza el estado global
            await login(email, password);
            navigate('/dashboard', {replace:true});
        } catch (err) {
            
        }
    }

}