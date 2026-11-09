-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-10-2026 a las 22:38:01
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda_adso_temp`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_login` (IN `p_nombre_usuario` VARCHAR(50), IN `p_password` VARCHAR(100), OUT `p_resultado` VARCHAR(100))   BEGIN 
    DECLARE v_id INT DEFAULT NULL;
    DECLARE v_hash CHAR(64);
    DECLARE v_salt CHAR(32); -- (Eliminada la duplicación)
    DECLARE v_bloqueado BOOLEAN;
    DECLARE v_intentos INT;

    -- Buscar usuario
    SELECT id, password_hash, salt, bloqueado, intentos 
    INTO v_id, v_hash, v_salt, v_bloqueado, v_intentos
    FROM usuarios 
    WHERE nombre_usuario = p_nombre_usuario;

    -- Validaciones de login
    IF v_id IS NULL THEN
        SET p_resultado = 'Usuario no encontrado';
    ELSEIF v_bloqueado THEN
        SET p_resultado = 'Usuario bloqueado';
    ELSEIF v_hash = SHA2(CONCAT(v_salt, p_password), 256) THEN
        SET p_resultado = 'Login exitoso';
    ELSE
        SET p_resultado = 'Contraseña incorrecta';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_usuario` (IN `p_nombre_usuario` VARCHAR(50), IN `p_email` VARCHAR(100), IN `p_password` VARCHAR(100), IN `p_rol` VARCHAR(20), IN `p_id_cliente` INT)   BEGIN
    DECLARE v_salt CHAR(32);

    -- Validación de la contraseña
    IF CHAR_LENGTH(p_password) < 8
    OR CAST(p_password AS BINARY) = CAST(LOWER(p_password) AS BINARY)
    OR p_password NOT REGEXP '[0-9]' THEN 
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La contraseña debe tener minimo 8 caracteres, una mayuscula y un numero';
    END IF;

    -- Generar salt seguro (corregida la coma y el nombre de variable)
    SET v_salt = LEFT(SHA2(CONCAT(UUID(), NOW(6), 256), 32), 32);

    -- Insertar usuario (corregida la coma en id_cliente)
    INSERT INTO usuarios (id_cliente, nombre_usuario, email, password_hash, salt, rol)
    VALUES (p_id_cliente,
            p_nombre_usuario,
            p_email,
            SHA2(CONCAT(v_salt, p_password), 256), 
            v_salt, 
            p_rol);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Tecnologia', 'Computadores, Perisfericos, Accesorios'),
(2, 'Hogar', 'Electrodomesticos y Articulos para el hogar'),
(3, 'Papeleria', 'Utiles escolares y Oficina'),
(4, 'Deportes', 'Implementos deportivos'),
(5, 'Juguestes', 'Categoria nueva, aun sin productos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `tipo_doc` varchar(3) NOT NULL DEFAULT 'CC',
  `num_doc` varchar(50) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `gmail` varchar(100) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `ciudad` varchar(50) NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `tipo_doc`, `num_doc`, `nombres`, `apellidos`, `gmail`, `telefono`, `ciudad`, `fecha_registro`) VALUES
(1, 'CC', '1001001001', 'Ana Maria', 'Gomez Ruiz', 'ana.gomez@correo.com', '3001112233', 'Medellin', '2026-10-15 15:46:28'),
(2, 'CC', '1002002002', 'Carlos Andres', 'Perez Diaz', 'carlos.perez@correo.com', '3012223344', 'Bogota', '2026-10-15 15:46:28'),
(3, 'CC', '1003003003', 'Luisa Fernanda', 'Martinez Rios', 'luisa.martinez@correo.com', '3023334455', 'Cali', '2026-10-15 15:46:28'),
(4, 'TI', '1004004004', 'Juan David', 'Restrepo Toro', 'juan.restrepo@correo.com', '3034445566', 'Medellin', '2026-10-15 15:46:28'),
(5, 'CC', '1005005005', 'Valentina', 'Herrera Lopez', 'valentina.herrera@correo.com', '3045556677', 'Barranquilla', '2026-10-15 15:46:28'),
(6, 'CC', '1006006006', 'Santiago', 'Ramirez Castro', 'santiago.ramirez@correo.com', '3056667788', 'Bogota', '2026-10-15 15:46:28'),
(7, 'CC', '1007007007', 'Daniela', 'Ospina Vargas', 'daniela.ospina@correo.com', '3067778899', 'Medellin', '2026-10-15 15:46:28'),
(8, 'CC', '1008008008', 'Mateo', 'Londoño Giraldo', 'mateo.londoño@correo.com', NULL, 'Pereira', '2026-10-15 15:46:28');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles`
--

CREATE TABLE `detalles` (
  `id_detalle` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles`
--

INSERT INTO `detalles` (`id_detalle`, `id_pedido`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(1, 1, 1, 1, 2500000.00),
(2, 1, 2, 2, 45000.00),
(3, 2, 4, 2, 650000.00),
(4, 2, 3, 1, 45000.00),
(5, 3, 8, 1, 8500.00),
(6, 3, 9, 2, 45000.00),
(7, 4, 5, 1, 220000.00),
(8, 4, 7, 2, 45000.00),
(10, 6, 6, 1, 310000.00),
(11, 6, 2, 2, 45000.00),
(12, 7, 2, 1, 45000.00),
(13, 7, 1, 1, 250000.00),
(14, 7, 4, 1, 650000.00),
(15, 8, 10, 1, 15000.00),
(16, 8, 8, 20, 8500.00),
(17, 9, 3, 1, 180000.00),
(18, 9, 7, 1, 60000.00),
(19, 10, 11, 2, 2500000.00),
(20, 10, 9, 3, 22000.00),
(22, 16, 2, 1, 4500.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direccion_envio`
--

CREATE TABLE `direccion_envio` (
  `id_direccion` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `direccion` varchar(50) NOT NULL,
  `barrio` varchar(50) DEFAULT NULL,
  `ciudad` varchar(50) NOT NULL,
  `es_principal` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `fecha_pedido` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` varchar(20) NOT NULL DEFAULT 'Pendiente',
  `total` decimal(12,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_cliente`, `fecha_pedido`, `estado`, `total`) VALUES
(1, 1, '2026-08-01 10:15:00', 'Pagado', 2590000.00),
(2, 2, '2026-08-03 14:30:00', 'Enviado', 1345000.00),
(3, 1, '2026-08-10 09:00:00', 'Enviado', 98500.00),
(4, 3, '2026-08-15 16:45:00', 'Pagado', 310000.00),
(6, 5, '2026-09-02 08:10:00', 'Pendiente', 400000.00),
(7, 6, '2026-09-05 19:00:00', 'Pagado', 945000.00),
(8, 2, '2026-09-12 12:00:00', 'Pagado', 185000.00),
(9, 7, '2026-09-20 17:30:00', 'Enviado', 240000.00),
(10, 3, '2026-09-28 10:05:00', 'Pendiente', 5066000.00),
(15, 8, '2026-10-21 15:02:49', 'Pendiente', 0.00),
(16, 8, '2026-10-21 15:02:56', 'Pendiente', 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio` decimal(12,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `id_categoria`, `id_proveedor`, `nombre`, `precio`, `stock`, `activo`, `fecha_registro`) VALUES
(1, 1, 1, 'Portatil Lenovo Ideapad', 2500000.00, 15, 1, '2026-10-14 15:37:29'),
(2, 1, 1, 'Mause Inalambrico', 45000.00, 120, 1, '2026-10-14 15:37:29'),
(3, 1, 1, 'Teclado Mecanico', 180000.00, 40, 1, '2026-10-14 15:37:29'),
(4, 1, 1, 'Monitor 24 Pulgadas', 650000.00, 25, 1, '2026-10-14 15:37:29'),
(5, 2, 2, 'Licuadora Oster', 220000.00, 30, 1, '2026-10-14 15:37:29'),
(6, 2, 2, 'Juego de Ollas', 310000.00, 18, 1, '2026-10-14 15:37:29'),
(7, 2, 2, 'Lampara Led', 60000.00, 75, 1, '2026-10-14 15:37:29'),
(8, 3, 3, 'Cuaderno 100 Hojas', 12444.85, 500, 1, '2026-10-14 15:37:29'),
(9, 3, 3, 'Resma de Papel Carta', 32210.20, 200, 1, '2026-10-14 15:37:29'),
(10, 3, 3, 'kit de Marcadores', 21961.50, 150, 1, '2026-10-14 15:37:29'),
(11, 4, NULL, 'Balon de Futbol', 89250.00, 60, 1, '2026-10-14 15:37:29'),
(12, 4, NULL, 'Bicicleta Estatica', 1260000.00, 5, 1, '2026-10-14 15:37:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nit` int(11) NOT NULL,
  `razon_social` varchar(255) NOT NULL,
  `telefono` int(11) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `ciudad` varchar(50) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nit`, `razon_social`, `telefono`, `email`, `ciudad`, `activo`) VALUES
(1, 900123456, 'Electronica S.A.S', 2147483647, 'contacto@electronica.com', 'Bogotá', 1),
(2, 900654321, 'HogarAndConfort Ltda.', 2147483647, 'ventas@hogarconfort.com', 'Medellín', 1),
(3, 900987654, 'Papelería Nacional S.A.', 2147483647, 'servicio@papelerianacional.com', 'Cali', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `nombre_usuario` varchar(50) DEFAULT NULL,
  `gmail` varchar(100) DEFAULT NULL,
  `password_hash` char(64) NOT NULL,
  `salt` char(32) NOT NULL,
  `rol` varchar(20) NOT NULL DEFAULT 'Cliente',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `intentos_fallidos` int(11) NOT NULL DEFAULT 0,
  `bloqueado` tinyint(1) NOT NULL DEFAULT 0,
  `ultimo_acceso` datetime DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `uq_categorias_nombre` (`nombre`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `uq_clientes_num_doc` (`num_doc`),
  ADD UNIQUE KEY `uq_clientes_gmail` (`gmail`),
  ADD KEY `idx_clientes_apellidos` (`apellidos`,`nombres`),
  ADD KEY `idx_clientes_ciudad` (`ciudad`);

--
-- Indices de la tabla `detalles`
--
ALTER TABLE `detalles`
  ADD PRIMARY KEY (`id_detalle`),
  ADD UNIQUE KEY `uq_detalle_pedido_producto` (`id_pedido`,`id_producto`),
  ADD KEY `fk_detalle_productos` (`id_producto`);

--
-- Indices de la tabla `direccion_envio`
--
ALTER TABLE `direccion_envio`
  ADD PRIMARY KEY (`id_direccion`),
  ADD KEY `fk_direccion_cliente` (`id_cliente`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `fk_pedidos_clientes` (`id_cliente`),
  ADD KEY `idx_pedidos_fecha` (`fecha_pedido`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `fk_productos_categorias` (`id_categoria`),
  ADD KEY `idx_productos_nombre` (`nombre`),
  ADD KEY `fk_productos_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD UNIQUE KEY `uq_nit` (`nit`),
  ADD UNIQUE KEY `uq_email` (`email`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uq_usuarios_nombre` (`nombre_usuario`),
  ADD UNIQUE KEY `uq_usuarios_gmail` (`gmail`),
  ADD KEY `fk_usuarios_clientes` (`id_cliente`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `detalles`
--
ALTER TABLE `detalles`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `direccion_envio`
--
ALTER TABLE `direccion_envio`
  MODIFY `id_direccion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles`
--
ALTER TABLE `detalles`
  ADD CONSTRAINT `fk_detalle_pedidos` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_detalle_productos` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `direccion_envio`
--
ALTER TABLE `direccion_envio`
  ADD CONSTRAINT `fk_direccion_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_pedidos_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_categorias` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_productos_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE SET NULL;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
