/**
 * Middleware de express: verifica que el token JWT enviado en la cabecera Authorization sea válido.
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificarToken(req, res, next) {
    // 1. Obtener el token de la cabecera Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    // 2. Verificar el token
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso no autorizado: Token no proporcionado' });
    }

    try {
        // Verificar y decodificar el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agregar la información del usuario al objeto req para que el controlador la use
        req.usuario = decoded;
        
        // Continuar con la solicitud
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
}

// Exportamos la función middleware
module.exports = verificarToken;