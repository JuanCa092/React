/**
 * componente guardan de ruta se usa para envolver las rutas d dashboard en app.jsx si el usuario no esta iniciando sesion lo redirige
 * automaticamente a /login en vez de mostrar el contenido 
 */

import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center px-3">
            <h1 className="display-4 fw-bold text-primary">404</h1>
            <p>La pagina que buscas no existe.</p>
            <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
    );
}

export default NotFoundPage;