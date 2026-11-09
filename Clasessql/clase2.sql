   3. CONSULTAS BÁSICAS (1a "R" de CRUD: Read)
---------------------------------------------------------------- */

-- 3.1 Columnas específicas con ALIAS (AS) para nombrarlas mejor
SELECT nombre AS producto, precio AS precio_venta, stock AS unidades
FROM productos;

-- 3.2 WHERE con operadores de comparación y lógicos (AND / OR / NOT)
SELECT nombre, precio, stock
FROM productos
WHERE precio > 100000 AND stock >= 20;

-- 3.3 BETWEEN (rango, incluye los extremos)
SELECT nombre, precio FROM productos
WHERE precio BETWEEN 20000 AND 200000;

-- 3.4 IN (lista de valores)
SELECT nombres, apellidos, ciudad FROM clientes
WHERE ciudad IN ('Medellín', 'Bogotá');

-- 3.5 LIKE: % = cualquier cantidad de caracteres, _ = exactamente un carácter
SELECT nombres, apellidos, gmail FROM clientes
WHERE apellidos LIKE 'R%'; -- apellidos que empiezan por R

-- 3.6 IS NULL / IS NOT NULL (NULL no se compara con =!)
SELECT nombres, apellidos FROM clientes
WHERE telefono IS NULL;

-- 3.7 ORDER BY (ASC ascendente por defecto, DESC descendente) y LIMIT
SELECT nombre, precio FROM productos
ORDER BY precio DESC
LIMIT 3; -- los 3 productos más caros

-- 3.8 DISTINCT: valores sin repetir
SELECT DISTINCT ciudad FROM clientes ORDER BY ciudad;

-- 3.9 Columnas calculadas y funciones de texto
SELECT CONCAT(nombres, ' ', apellidos) AS cliente_completo,
       UPPER(ciudad) AS ciudad_mayuscula,
       CHAR_LENGTH(gmail) AS largo_gmail
FROM clientes;

-- 3.10 CASE: lógica condicional dentro de la consulta
SELECT nombre, stock,
       CASE
           WHEN stock < 20 THEN 'Stock bajo'
           WHEN stock < 100 THEN 'Stock medio'
           ELSE 'Stock alto'
       END AS nivel_stock
FROM productos;

 4. JOINS - CONSULTAR VARIAS TABLAS RELACIONADAS
----------------------------------------------------------------
INNER JOIN -> solo las filas que tienen pareja en ambas tablas
LEFT JOIN  -> todas las de la izquierda + las parejas (o NULL)
RIGHT JOIN -> todas las de la derecha + las parejas (o NULL)
FULL JOIN  -> todas las de ambas (MySQL no lo tiene: se emula con UNION)
Se usan alias cortos (p, c...) para no repetir el nombre de la tabla.
---------------------------------------------------------------- */

-- 4.1 INNER JOIN: productos con el nombre de su categoría
SELECT p.nombre AS producto, c.nombre AS categoria, p.precio
FROM productos p
INNER JOIN categorias c ON c.id_categoria = p.id_categoria
ORDER BY c.nombre, p.nombre;

-- 4.2 INNER JOIN: pedidos con el nombre del cliente
SELECT pe.id_pedido, pe.fecha_pedido, pe.estado, pe.total,
       CONCAT(cl.nombres, ' ', cl.apellidos) AS cliente
FROM pedidos pe
INNER JOIN clientes cl ON cl.id_cliente = pe.id_cliente
ORDER BY pe.fecha_pedido;

-- 4.3 JOIN de 4 tablas: la "factura" detallada de cada pedido
SELECT pe.id_pedido,
       CONCAT(cl.nombres, ' ', cl.apellidos) AS cliente,
       pr.nombre AS producto,
       d.cantidad,
       d.precio_unitario,
       d.cantidad * d.precio_unitario AS subtotal
FROM pedidos pe
INNER JOIN clientes cl ON cl.id_cliente = pe.id_cliente
INNER JOIN detalles d ON d.id_pedido = pe.id_pedido
INNER JOIN productos pr ON pr.id_producto = d.id_producto
ORDER BY pe.id_pedido, pr.nombre;

-- 4.4 LEFT JOIN: TODOS los clientes, tengan o no pedidos
SELECT cl.nombres, cl.apellidos, pe.id_pedido, pe.total
FROM clientes cl
LEFT JOIN pedidos pe ON pe.id_cliente = cl.id_cliente
ORDER BY cl.id_cliente;

-- 4.5 LEFT JOIN + IS NULL: clientes que NUNCA han comprado
SELECT cl.nombres, cl.apellidos, cl.ciudad
FROM clientes cl
LEFT JOIN pedidos pe ON pe.id_cliente = cl.id_cliente
WHERE pe.id_pedido IS NULL;


-- 4.6 LEFT JOIN + IS NULL: productos que nunca se han vendido
SELECT pr.nombre, pr.stock
FROM productos pr
LEFT JOIN detalles d ON d.id_producto = pr.id_producto
WHERE d.id_detalle IS NULL;
-- Resultado esperado: Bicicleta estática

-- 4.7 RIGHT JOIN: todas las categorías aunque no tengan productos
SELECT c.nombre AS categoria, p.nombre AS producto
FROM productos p
RIGHT JOIN categorias c ON c.id_categoria = p.id_categoria
ORDER BY c.nombre;
-- Juguetes aparece con producto NULL

-- 4.8 FULL OUTER JOIN emulado (LEFT JOIN UNION RIGHT JOIN)
SELECT c.nombre AS categoria, p.nombre AS producto
FROM categorias c
LEFT JOIN productos p ON p.id_categoria = c.id_categoria
UNION
SELECT c.nombre, p.nombre
FROM categorias c
RIGHT JOIN productos p ON p.id_categoria = c.id_categoria;

/* ----------------------------------------------------------------
   5. FUNCIONES DE AGREGACIÓN, GROUP BY y HAVING
----------------------------------------------------------------
COUNT, SUM, AVG, MIN, MAX resumen muchas filas en un solo valor.
GROUP BY -> agrupa las filas para calcular el resumen por grupo.
HAVING   -> filtra GRUPOS (WHERE filtra filas ANTES de agrupar).
Regla: toda columna del SELECT que no esté en una función de agregación
debe ir en el GROUP BY.
---------------------------------------------------------------- */

-- 5.1 Resumen general de productos
SELECT COUNT(*) AS total_productos,
       SUM(stock) AS unidades_en_bodega,
       ROUND(AVG(precio), 2) AS precio_promedio,
       MIN(precio) AS precio_minimo,
       MAX(precio) AS precio_maximo
FROM productos;

-- 5.2 Cantidad de productos y valor del inventario por categoría
SELECT c.nombre AS categoria,
       COUNT(p.id_producto) AS cantidad_productos,
       SUM(p.precio * p.stock) AS valor_inventario
FROM categorias c
LEFT JOIN productos p ON p.id_categoria = c.id_categoria
GROUP BY c.nombre
ORDER BY valor_inventario DESC;

-- 5.3 Total comprado por cliente (sin pedidos cancelados)
SELECT CONCAT(cl.nombres, ' ', cl.apellidos) AS cliente,
       COUNT(pe.id_pedido) AS numero_pedidos,
       SUM(pe.total) AS total_comprado
FROM clientes cl
INNER JOIN pedidos pe ON pe.id_cliente = cl.id_cliente
WHERE pe.estado <> 'CANCELADO' -- WHERE: filtra filas antes de agrupar
GROUP BY cl.id_cliente, cl.nombres, cl.apellidos
ORDER BY total_comprado DESC;

-- 5.4 HAVING: clientes que han comprado más de 1.000.000
SELECT CONCAT(cl.nombres, ' ', cl.apellidos) AS cliente,
       SUM(pe.total) AS total_comprado
FROM clientes cl
INNER JOIN pedidos pe ON pe.id_cliente = cl.id_cliente
WHERE pe.estado <> 'CANCELADO'
GROUP BY cl.id_cliente, cl.nombres, cl.apellidos
HAVING SUM(pe.total) > 1000000; -- HAVING: filtra los grupos

-- 5.5 Ventas por mes
SELECT DATE_FORMAT(fecha_pedido, '%Y-%m') AS mes,
       COUNT(*) AS pedidos,
       SUM(total) AS ventas
FROM pedidos
WHERE estado <> 'CANCELADO'
GROUP BY DATE_FORMAT(fecha_pedido, '%Y-%m')
ORDER BY mes;

-- 5.6 Unidades vendidas por producto
SELECT pr.nombre, SUM(d.cantidad) AS unidades_vendidas
FROM detalle_pedido d
INNER JOIN productos pr ON pr.id_producto = d.id_producto
INNER JOIN pedidos pe ON pe.id_pedido = d.id_pedido
WHERE pe.estado <> 'CANCELADO'
GROUP BY pr.id_producto, pr.nombre
ORDER BY unidades_vendidas DESC;

-- 5.7 Pedidos por estado
SELECT estado, COUNT(*) AS cantidad, SUM(total) AS valor
FROM pedidos
GROUP BY estado;

select nombre, precio
from productos
where precio > (select avg(precio) from productos);

Select nombres, apellidos 
from clientes
where id_cliente IN (SELECT id_cliente FROM pedidos);

select c.nombre
from categorias c
where not exists  (select 1 from productos p where p.id_categoria = c.id_categoria);


select cl.nombres, cl.apellidos,
(select COUNT(*) from pedidos pe where pe.id_cliente = cl.id_cliente) AS cantidad_pedidos
from clientes cl;

select round(AVG(t.total_cliente), 2) promedio_compra_por_cliente
from pedidos
where estado <> 'Cancelado'
GROUP by id_cliente AS t;

select p.nombre, p.precio, p.id_categoria
from productos p
where p.precio > (select AVG(p2.precio)
from productos p2
where p2.id_categoria = p.id_categoria);

select id_pedido, id_cliente, total
from pedidos
where total = (select max(total) from pedidos);

insert into clientes (tipo_doc,num_doc,nombres,apellidos,gmail,telefono,ciudad)
values ('CC','1009009009', 'Sofia', 'Cardona Mejia', 'sofia.cardona@correo.com', '31099990000', 'Manizales');

SELECT * from clientes where num_doc = '1009009009';

update clientes
set telefono = '3201234567',
ciudad = 'Armenia'
WHERE num_docu = '1009009009';
select * from clientes where num_doc = '1009009009';

delete from clientes where num_doc = '1009009009';

start transaction;
insert into pedidos (id_cliente, estado) VALUES (8, 'Pendiente');
set @nuevo_pedido_id = LAST_INSERT_ID(); 

insert into detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
values (@nuevo_pedido_id, 12, 1, 120000);

update productos set stock = stock -1 where 
id_producto = 12;

select * from pedidos where id_pedido = @nuevo_pedido; 

rollback

SELECT * from pedidos where id_pedido = @nuevo_pedido;
SELECT stock from productos where id_producto = 12;

start transaction;
update productos
set precio = round(precio * 1.05, 0)
where id_categoria = (select id_categoria
from categorias where nombre = 'Deportes');
COMMIT;

select nombre, precio from productos where id_categoria =4;

--Delete en cascada al borrar un pedido, se borran sus detalles 

INSERT INTO pedidos (id_cliente, estado)
VALUES (8, 'Pendiente');
SET @pedido_tem = LAST_INSERT_ID();
INSERT INTO detalles (id_pedido,
id_producto,cantidad, precio_unitario)
Values (@pedido_tem, 2, 1, 4500);

Select count(*) AS detalles_antes FROM detalles
where id_pedido = @pedido_tem; --1
DELETE FROM pedidos WHERE id_pedido = 
@pedido_tem;
SELECT count(*) AS detalles_despues FROM 
detalles where id_pedido = @pedido_tem; --0

--EJERCICIOS

-- 1 INSERTE 3 PROVEEDORES

INSERT INTO proveedores (nit, razon_social, telefono, email, ciudad, activo) 
VALUES 
(900123456, 'Electronica S.A.S', '3001112233', 'contacto@electronica.com', 'Bogotá', 1),
(900654321, 'HogarAndConfort Ltda.', '3102223344', 'ventas@hogarconfort.com', 'Medellín', 1),
(900987654, 'Papelería Nacional S.A.', '3203334455', 'servicio@papelerianacional.com', 'Cali', 1)

-- . Asignación mediante UPDATE basándonos en las categorías correspondientes 

UPDATE productos 
SET id_proveedor = 1 
WHERE id_categoria = 1;

UPDATE productos 
SET id_proveedor = 2 
WHERE id_categoria = 2;

UPDATE productos 
SET id_proveedor = 3 
WHERE id_categoria = 3;

SELECT FROM proveedores

-- 2 Listar productos con categoria  y su proveedor 

SELECT 
    p.nombre AS producto,
    c.nombre AS categoria,
    pr.razon_social AS proveedor
FROM productos p
INNER JOIN categorias c ON p.id_categoria = c.id_categoria
LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor;

--3 Total vendido por ciduad de cliente 

SELECT 
    c.ciudad,
    
    SUM(p.total) AS total_vendido
FROM pedidos p
INNER JOIN clientes c ON p.id_cliente = c.id_cliente
WHERE p.estado != 'Cancelado'
GROUP BY c.ciudad
ORDER BY total_vendido DESC;

-- 4 Productos con mas unidades vendidas

SELECT 
    pr.id_producto,
    pr.nombre AS producto,
    SUM(d.cantidad) AS total_unidades_vendidas
FROM detalles d
INNER JOIN productos pr ON d.id_producto = pr.id_producto
INNER JOIN pedidos pe ON d.id_pedido = pe.id_pedido
WHERE pe.estado != 'Cancelado' 
GROUP BY pr.id_producto, pr.nombre
ORDER BY total_unidades_vendidas DESC
LIMIT 1;

-- 5 Clientes con mas compras que el promedio

SELECT 
    c.id_cliente,
    CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
    SUM(p.total) AS total_comprado
FROM clientes c
INNER JOIN pedidos p ON c.id_cliente = p.id_cliente
WHERE p.estado != 'Cancelado'
GROUP BY c.id_cliente, c.nombres, c.apellidos
HAVING SUM(p.total) > (
    -- Subconsulta que calcula el promedio comprado por cliente
    SELECT AVG(total_por_cliente)
    FROM (
        SELECT SUM(total) AS total_por_cliente
        FROM pedidos
        WHERE estado != 'Cancelado'
        GROUP BY id_cliente
    ) AS subconsulta
);

-- 6 Categorias que no tiene productos vendidos

SELECT 
    c.id_categoria,
    c.nombre AS categoria,
    'No vendido / No registra ventas' AS estado_venta
FROM categorias c
WHERE NOT EXISTS (
    SELECT 1 
    FROM productos p
    INNER JOIN detalles d ON p.id_producto = d.id_producto
    INNER JOIN pedidos pe ON d.id_pedido = pe.id_pedido
    WHERE p.id_categoria = c.id_categoria
      AND pe.estado != 'Cancelado'
);



-- 7 Transacciones

-- 1. Iniciamos la transacción para aislar los cambios
START TRANSACTION;

-- 2. Incrementamos el precio un 10% (Temporalmente)
UPDATE productos 
SET precio = precio * 1.10
WHERE id_categoria = 3;

-- [PRIMER RESULTADO]: Muestra los precios modificados (con el 10% extra)
SELECT 'CON CAMBIO (Antes del Rollback)' AS estado, id_producto, nombre, precio 
FROM productos 
WHERE id_categoria = 3;


-- 3. Cancelamos la transacción y revertimos el UPDATE
ROLLBACK;


-- [SEGUNDO RESULTADO]: Muestra que los precios regresaron a su estado original
SELECT 'REVERTIDO (Después del Rollback)' AS estado, id_producto, nombre, precio 
FROM productos 
WHERE id_categoria = 3;



-- 1. Consultar los pedidos que están a punto de ser eliminados
SELECT id_pedido, estado 
FROM pedidos 
WHERE estado = 'Cancelado';

-- 2. Eliminar los pedidos cancelados
DELETE FROM pedidos 
WHERE estado = 'Cancelado';

-- 3. Verificar y confirmar que los detalles ya NO existen
SELECT 
    'ELIMINADO' AS estado_registro, 
    'Los detalles de los pedidos cancelados han sido eliminados con éxito' AS mensaje
WHERE NOT EXISTS (
    SELECT 1 
    FROM detalles 
    WHERE id_pedido NOT IN (SELECT id_pedido FROM pedidos)
);
