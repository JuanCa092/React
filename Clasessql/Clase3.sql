//* seguridad en base de datos
1 hash vs cifrado teoria
2  contraseñas con hash + salt sha2
3 procedimiento para registrar usuarios hacer login y cambiar clave
4 cifrado reversilble para datos sensibles AES
5 auditoras con trigger
6 vistas que ocultan datos sensibles 
7 usuarios y roles de mysql con minimo provilegio 
8 prevencion de sql inyeccion con consultas preparadas 
*/ 

/* HASH vs CIFRADO para contraseñas
- convierte un texto en una huella de longitud fija 
- no se puede revertir. para validar el login se calcula el hash de la clave escrita y se compara con el guardado
- salt texto aleatorio distinto para cada usuario que se mezcla con la clave antes del hash, asi dos usuarios con la misma clave tienen hashes diferentes y se frustra la rebundancia en las tablas

- Cifradp ( dos vias) para datos sensibles que hay que volver a leer 
- con una llave se cifra y con la misma se descifra

- nunca guarda contraseñas en segundo plano
*/

-- Demostracion del texto siempre da el mismo hash 
SELECT SHA2('Clave123*', 256) AS hash_1;
SELECT SHA2('Clave123*', 256) AS hash_2;

--demostracion utilizando salt
SELECT SHA2(CONCAT('a1b2c3', 'Clave123*'), 256) AS hash_usuario_A;
SELECT SHA2(CONCAT('a9y8x7', 'Clave123*'), 256) AS has_usuario_B; 

-- Generar un slat aleatorio de 32 caracteres hexadecimal
-- mezclamos UUID (identificador unico) + RAND() (numero al azar) + la hora con milisegundis y
-- totamos los 32 caracteres del resultado 
-- en mysql 8 existe HEX(RANDOM_BYTES(16)) mas robusto pero mariadb no lo tiene
SELECT LEFT(SHA2(CONCAT(UUID(), RAND(), NOW(6)), 256), 32) AS salt_aleatorio;

/* 2 LO QUE NUNCA SE DEBE HACER CON CONTRASEÑAS(solo para mostrar el riesgo)
SI alguien intenta robar la base de datos o un empleado curioso consulta la tabla veria las claves de todos 
*/
/*
INSERT OMTP isiarops (...) VALUES (...,Miclave123, ...); -- ¡MAL!
*/ 

/* 3. Precedimientos almacenados de autenticacion
- centralicemos la logica de seguridad en el procedimiento de la aplicacion nunca toca directamente el hash solo llama a estos procedimientos 
DELIMITER, cambia el fin de la sentencia a // para pode rusar ; dentro del procedimiento
*/ 

DROP PROCEDURE IF EXISTS sp_regitrar_usuario;
DROP PROCEDURE IF EXISTS sp_login_usuario;
DROP PROCEDURE IF EXISTS sp_cambiar_password; 

DELIMITER //

--3.1 Registrar usuario: valida la politica de contraseñas genera slat y guarda el hash 
DELIMITER //

-- 1. Procedimiento de Registro
CREATE PROCEDURE sp_registrar_usuario(
    IN p_nombre_usuario VARCHAR(50), 
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(100),
    IN p_rol VARCHAR(20),
    IN p_id_cliente INT 
)
BEGIN
    DECLARE v_salt CHAR(32);

    -- Validación de la contraseña
    IF CHAR_LENGTH(p_password) < 8
    OR CAST(p_password AS BINARY) = CAST(LOWER(p_password) AS BINARY)
    OR p_password NOT REGEXP '[0-9]' THEN 
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La contraseña debe tener minimo 8 caracteres, una mayuscula y un numero';
    END IF;

    -- Generar salt seguro 
    SET v_salt = LEFT(SHA2(CONCAT(UUID(), NOW(6), 256), 32), 32);

    -- Insertar usuario 
    INSERT INTO usuarios (id_cliente, nombre_usuario, email, password_hash, salt, rol)
    VALUES (p_id_cliente,
            p_nombre_usuario,
            p_email,
            SHA2(CONCAT(v_salt, p_password), 256), 
            v_salt, 
            p_rol);
END //

-- 2. Procedimiento de Login (Completado y corregido)
CREATE PROCEDURE sp_login(
    IN p_nombre_usuario VARCHAR(50),
    IN p_password VARCHAR(100),
    OUT p_resultado VARCHAR(100)
)
BEGIN 
    DECLARE v_id INT DEFAULT NULL;
    DECLARE v_hash CHAR(64);
    DECLARE v_salt CHAR(32);
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
END //

DELIMITER ;

 declare continue handler for not found set v_id = null 

 SELECT id_usuario, password_hash, salt, bloqueado, intentos_fallidos
 INTO v_id v_hash, v_salt, v_bloqueado, v_intentos
 FROM usuarios
 WHERE nombre_usuario = p_nombre_usuario AND activo = TRUE; 

 if v_id is null then
 set p_resultado = 'usuario o contraseña incorrectos '
 ELSEIF v_bloqueado THEN 
 SET p_resultado = 'Usuario bloqueado. contacte al administrador ';

 ELSEIF v_hash = SHA2(CONCAT(v_salt, p_password), 256)
 THEN
 UPDATE usuarios 
 SET intentos_fallidos = 0, ultimo_acceso = now()
 where id_usuario = v_id;
 set p_resultado = 'Acceso concedido';

 ELSE 
 UPDATE usuarios
 SET intentos_fallidos = v_intentos +1
 bloqueado = (v_intentos +1 >? 3)
 WHERE id_usuario = v_id;
 set p_resultado = 'usuario o contraseña incorrectos',
 END IF 


CREATE PROCEDURE sp_cambiar_password(
    in p_nombre_usuario VARCHAR(50),
    IN p_password_actual VARCHAR(100),
    IN p_password_nueva varchar(100),
    OUT p_resultado VARCHAR(100)
)
BEGIN
DECLARE v_salt_mievo CHAR(32);

IF NOT EXISTS (SELECT 1 FROM usuarios
WHERE nombre_usuario = p_nombre_usuario
AND password_hash = SHA2(CONCAT(salt, p_password_actual), 256)) THEN
SET p_resultado = 'La contraseña actual no es correcta ';
ELSEIF CHAR_LENGTH(p_password_nueva) < 8
OR CAST(p_password_nueva AS BINARY ) = CAST(LOWER
(p_password_nueva) AS BINARY)
OR p_pssword_nueva NOT REGEXP '[0-9]' THEN
SET p_resultado = 'La nueva contrasñea no cumple con la politica';
ELSE
SET v_salt_nuevo = left (SHA2(CONCAT(UUDI(), RAND(), NOW(6)), 256 ) 32);
UPDATE USUARIOS
SET salt = v_salt_nuevo,
password_hash = SHA2(CONCAT(v_salt_nuevo,
p_password_nueva), 256)
WHERE nombre_usuario = p_nombre_usuario;
SET p_resultado = 'Contraseña actualizada';
END IF;
END //
DELEMITER;  

/*auditoria de trigger que tegistra eventos de seguridada insert update o delete sobre la tabla guardamos quien y cuando cambio una clave o se bloqueo el usuario
nunca se daña la contraseña en la auditoria 
*/
CREATE TABLE IF NO EXISTS auditoria_usuarios (
    id_auditoria int AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    accion VARCHAR(30) NOT NULL,
    detalle VARCHAR(255) NULL,
    usuario_db VARCHAR(100) NOT NULL,
    fecha datetime not null default current_timestamp
) ENGINE = InnoDB;

DROP TRIGGER IF EXISTS 
trg_usuarios_auditoria

DELIMITER //
CREATE TRIGGER trg_usuarios_auditoria
AFTER UPDATE ON usuarios
FOR each ROW 
BEGIN
IF NEW.password_hash <> OLD.password_hash
THEN 
INSERT INTO auditoria_usuarios (id_usuario, accion, detalle, usuario_bd)
VALUES (NEW.idusuario, 'CAMBIO_PASSWORD', 'se cambio la contraseña', CURRENT_USER());
END IF;

IF NEW.bloqueado = TRUE and OLD.bloqueado = false THEN 
INSERT INTO auditoria_usuarios (id_usuario, accion, detalle, usuario_bd)
VALUES (NEW.id_usuario, 'BLOQUEO', 'Bloqueado por 3 intentos fallidos', CURRENT_USER());
END IF;
END// 
DELIMITER;

CALL sp_registrar_usuario('admin', 'admi@tienda.com', 'Admin*2026Seguro','ADMIN', NULL);
CALL sp_registrar_usuario('vendedor', 'ventas@tienda.com', 'Ventas#2026','VENDEDOR', NULL);
CALL sp_registrar_usuario('ana.gomez', 'ana.gomez@tienda.com', 'AnaGomez2026','CLIENTE', 1);
CALL sp_registrar_usuario('carlos.perez', 'carlos.perez@tienda.com', 'CarlosPerez2026!','CLIENTE', 2);
CALL sp_registrar_usuario('debil', 'debil@tienda.com', '12345','CLIENTE', NULL); --debe rechazarlo por contraseña debil

salt, password_hash
from usuarios;

call sp_login('ana.gomez', 'AnaGomez2026', @resultado);
SELECT @resultado AS login_correcto;


call sp_login('Carlos.perez', 'Clave_mala', @r1);

call sp_login('Carlos.perez', 'Clave_mala', @r2);

call sp_login('Carlos.perez', 'Clave_mala', @r3);


call sp_login('ana.gomez', 'Carlos2026!', @r4);

SELECT @r1, @r2, @r3, @r4;

SELECT nombre_usuario, intentos_fallidos, bloqueado, from usuarios;

CALL sp_cambiar_password('ana.gomez', 'AnaGomez2026', 'NuevaClave2026', @r);
SELECT @r as cambio;

SELECT  * FROM  auditorias_usuario

UPDATE usuarios SET bloqueado = FALSE, intentos_fallidos = 0
WHERE nombre_usuario = 'carlos.perez';