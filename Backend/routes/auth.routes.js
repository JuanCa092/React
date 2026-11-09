/**
 *  Define las urls endpoints relacionadas con la autenticación de usuarios.
 *  Las conecta con su funcion controladora correspondiente en auth.controller.js.
 */ 

// Framework del servidor
const express = require('express');
const router = express.Router();

const { login, perfil } = require('../src/controllers/auth.controller');
// Middleware para verificar el token JWT
const verificarToken = require('../src/middlewares/verificarToken');

// post /api/auth/login
router.post('/login', login);

// get /api/auth/perfil
router.get('/perfil', verificarToken, perfil);

module.exports = router;

