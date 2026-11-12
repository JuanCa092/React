/* aca se montan los middlewares globales, que se ejecutan antes de que lleguen a las rutas, y se pueden usar para todas las rutas, como por ejemplo para parsear el body de la peticion, o para manejar errores, o para loguear las peticiones, etc.
semontan las rutas al final del servidor que esta escuchando las peticiones por el puerto definido que por defecto es el 4000
*/

//framework para crear el servidor
const express = require('express');
//midleware que habilita cors para que el servidor y pueda recibir peticiones
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
// importamos el router con los endpoints de autenticacion
const authRoutes = require('../routes/auth.routes');
// creamos la app de express
const app = express();
// Cors permite que el frontend y el backend puedan comunicarse sin que el navegador bloquee 
app.use(cors());

// express.json() es un middleware que parsea el body de la peticion y lo convierte en un objeto JSON, para que podamos acceder a los datos enviados desde el frontend
app.use(express.json());

// ruta de salud de la API, para verificar que el servidor esta corriendo
app.get('/api/salud', (req, res) => {
    res.json({ mensaje: 'API de inventario react funcionando correctamente' });
});

// todas las rutas con api/auth/ seran manejadas por el router de autenticacion
app.use('/api/auth', authRoutes);

// middleware para manejar errores ruta no encontrada 404
app.use((req, res, next) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// totamos el puerto del archivo .env, si no existe usamos el 4000
const PORT = process.env.PORT || 4000;

// arranca el servidor apartir del puerto definido, y muestra un mensaje en consola indicando que el servidor esta corriendo
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});