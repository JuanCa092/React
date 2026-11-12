//Configurar y exportar un pool de onexiones hacia mysql
// Un pool es un grupo de conexiones que se reutilizan en cada consulta en lugar de abrir y errar una conexion nueva cada vez
// eso hae qe la aplicacion responda mas rapido

//Mysql/promise nos permite usar async await en las consultas en lugar de hacer callbacks

const mysql = require('mysql2/promise');

// Cargamos las variables definidas en el archivo .env
// (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

//createPool crea un conjunto de conexiones reutiliables 
const pool = mysql.createPool({
    host: process.env.DB_HOST, //Servidor de mysql
    port: process.env.DB_PORT, //Puerto de mysql
    user: process.env.DB_USER, //Usuario de mysql
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, //Nombre de la base de datos
    waitForConnections: true, //si no hay conexiones libres
    connectionLimit: 10, //Maximo de conexiones simultaneas
    queueLimit: 0, //Sin limite de conexiones en espera 
});

//Exportamos el pool para poder hacer pool.query desde cualquier controlador 
module.exports = pool;