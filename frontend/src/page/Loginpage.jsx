/**
 * Pantalla login funcional
 * 
 * Pantalla publica de inicio de sesion es la unica parte del sistema que habla con base de datos
 * mysql atraves del backend de express si las credenciales son correctas
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function LoginPage() {
    // CORRECCIÓN: useAuth debe invocarse como función con paréntesis ()
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [enviado, setEnviado] = useState(false);

    async function manejarEnvio(evento) {
        evento.preventDefault();
        setError('');
        setEnviado(true);
        
        try {
            // login() está definido en authContext al llamar al backend guarda el token del usuario y actualiza el estado global
            await login(email, password);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            const mensajeBackend = err?.response?.data?.mensaje;
            setError(mensajeBackend || "No se pudo conectar con el servidor.");
        } finally {
            setEnviado(false);
        }
    }

    return (
        <div className="login-wrapper d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg border-0" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="card-body p-4 p-md-5">
                    <i className="bi bi-boxes text-primary" style={{ fontSize: "2.5rem" }}></i>
                    <h1 className="h4 mt-2 mb-0">Inventario React</h1>
                    <p className="text-muted">Ingrese con la cuenta registrada</p>

                    {error && (
                        <div className="alert alert-danger py-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={manejarEnvio}>
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@inventario.com"
                                required
                                disabled={enviado}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={enviado}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100" disabled={enviado}>
                            {enviado ? "Verificando..." : "Iniciar Sesión"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;