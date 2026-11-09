CREATE DATABASE inventario_react;

USE inventario_react;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50),
    estado TINYINT(1) NOT NULL DEFAULT 1,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (id, nombre email, password, rol, estado, creado_en)
VALUES ('Administrador', 'admin@inventario.com', '$h&djtkKu78.2.k9l388gCIGIK59ii88/A5957vjhk', admin, 1, '2026-10-28-16-40-30');