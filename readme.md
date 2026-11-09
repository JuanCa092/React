Proyecto en react sistema de inventario 
Elaborado con react+ Bootstrap y mysql 

El sistema de inventario contara con inicio de sesion con base de datos en mysql con contraseña encriptada y JWT

El dashboard contara con gestion CRUD  de **usuarios, categorias, subcategorias, productos** usando datos simulados en JavaScript 

## Stack Usado
Frontend = react 19 + vite + Bootstrap 5 + react Router 
Backend (Solo para login) = node.js + express + JWT 
Base de datos = Mysql (XAAMP) + inventario_react 
Encriptacion de contraseña = bcrypt (bcrps.js)
Gestiones = Usuarios, categorias, subcategorias, productos/ datos simulados en js (UseStage + localStorage)
Automatizacion npm scripts + concurrently 

Pre Requisitos
# 1
instalar node.js verificar desde CMD con node -v 

# 2 
Tener XAAMP instalado con Mysql ejecutado en puerto 3306

# 3
Tener un editor de codigo (visual studio code)

# Conocimientos previos

**Componentes**
La pantalla se divide en piezas pequeñas y reutilizables
(un boton, una tabla, un formulario, un menu) cada componente es una funcion de javascript
que tiene que mostrar
**JSX** 
es una sintaxis que permite escribir algo parecido a html dentro de javascript, por eso los archivos terminan con extension .jsx 

``jsx
function saludo () {
     return <h1 className= "text-primary" Hola, React></h1>
}

...

.**Estado (stage)** cada compoenente puede guardar datos que cambian, por ejemplo, lo que el usuario en un input, cuando el estado cambia React vuelve a dibuajr automaticamente 
solo lo necesario sin recargar la pagina 

**SPA** la aplicacion se carga una sola vez en el navegador y luego cambia de pagina sin recargar para esto usamos 'react-router-dom' 

React solo se encarga de la interfaz grafica, para el resto utilizamos: 

**vite**  para crear y cerrar el proyecto 
**bootstrap** para los estilos
**axios** para hablar entre frontend y backend
**react-router-dom** para las rutas 

# pasos para crear el proyecto 
- 1 verifique que tengas node.js (node - v)cmd
- 2 desde la raiz de proyecto crea el proyecto con react yvite
 `npm create vite@latest frontend -- --template react`
- 3 Entre a la carpeta frontend con `cd frontend` y  instale npm `npm install`
- 4 instale las librerias: `npm install bootstrap bootstrap-icons react-router-dom axios ` "

- 5 empaquetador optimiza y junta todo el css en un solo archivo al hacer npm run build
6 instalar las dependencias del backend y frontend al tiempo `npm run install:all`
7 ingresa a la carpeta backend npm init -y
8 instalar dependencias
8.1 'npm install express mysql2 bcryptjs jsonwebtoken cors dotenv
8.2 crea .env dentro del backend 
8.3 crea /src/config/db/js
8.4 crea src/middlewares/verificarToken.js
8.5 cea src/controllers/auth.controller.js en la logica de inicio de sesion
8.6 Crea src/routes/auth.routes.js
8.7 Crea en backend seed.js crea el usuario administrador 
