/**
 * Aquí vive la lógica del negocio del login:
 * Recibe email y contraseña, busca el usuario en MySQL, compara la contraseña encriptada 
 * y devuelve un token JWT si todo es correcto.
 */

// Librería para encriptar y comparar la contraseña
const bcrypt = require('bcryptjs');
// Librería para crear (firmar) tokens JWT de sesión
const jwt = require('jsonwebtoken');
// Pool para conectarse con MySQL ya configurada
const pool = require('../config/db');
// Carga las variables de .env (JWT_SECRET, JWT_EXPIRES_IN)
require('dotenv').config();

// POST /api/auth/login 
// Recibe (email, password) y devuelve {token, usuario} si son correctos
async function login(req, res) {
    try {
        // Extraemos el email y el password del cuerpo (body) de la petición
        const { email, password } = req.body;

        // 1. Validación básica para que no llegue el formulario vacío
        if (!email || !password) {
            return res.status(400).json({ 
                mensaje: 'El correo y la contraseña son obligatorios' 
            });
        }

        // 2. Buscar el usuario por email en la tabla usuarios (usando ? para evitar inyección SQL)
        // Nota: Se corrigió la coma faltante entre password y rol
        const [filas] = await pool.query(
            'SELECT id, nombre, email, password, rol, estado FROM usuarios WHERE email = ? LIMIT 1', 
            [email]
        );

        // Si no encuentro ninguna fila, el correo no existe
        if (filas.length === 0) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
        }

        // `pool.query` con SELECT siempre devuelve un array de filas; 
        // como buscamos por email (único), nos quedamos con la primera y única fila
        const usuario = filas[0];

        // 3. Si el usuario fue desactivado, no dejamos iniciar sesión aunque la contraseña sea correcta
        if (usuario.estado === 0) {
            return res.status(403).json({ 
                mensaje: 'Usuario no activo, contacte al administrador' 
            });
        }

        // 4. Comparar la contraseña ingresada con la encriptada en la base de datos
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);

        if (!passwordCorrecta) {
            return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
        }

        // 5. Generar el Token JWT
        const token = jwt.sign(
            { 
                id: usuario.id, 
                nombre: usuario.nombre, 
                email: usuario.email, 
                rol: usuario.rol 
            },
            process.env.JWT_SECRET || process.env.jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // 6. Responder con el token y los datos del usuario (sin incluir el password)
        return res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ mensaje: 'Error interno en el servidor' });
    }
}

/**
 * GET /api/auth/perfil
 * Ruta protegida de ejemplo: solo responde si el middleware de autenticación (auth.middleware.js) valida el token.
 */
async function perfil(req, res) {
    // req.usuario es el objeto que el middleware de autenticación agregó a la petición
    return res.json({ usuario: req.usuario });
}

// Exportamos las funciones para que puedan ser usadas en las rutas (auth.routes.js)
module.exports = { 
    login, 
    perfil 
};
