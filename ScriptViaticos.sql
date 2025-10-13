create database tula;
use tula;
-- Tabla principal de empleados
CREATE TABLE empleados (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    cui VARCHAR(13) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal de viáticos (casos)
CREATE TABLE viaticos (
    id_viatico INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    numero_caso VARCHAR(20) UNIQUE NOT NULL,
    estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
    cantidad_letra TEXT NOT NULL,
    cantidad_numero DECIMAL(10,2) NOT NULL,
    nombre_jefe VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP NULL,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

-- Tabla de detalles de gastos (múltiples filas por viático)
CREATE TABLE detalles_viatico (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_viatico INT NOT NULL,
    fecha DATE NOT NULL,
    resultado VARCHAR(500) NOT NULL,
    producto VARCHAR(100) NOT NULL,
    motivo VARCHAR(500) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    desayuno DECIMAL(8,2) DEFAULT 0,
    almuerzo DECIMAL(8,2) DEFAULT 0,
    cena DECIMAL(8,2) DEFAULT 0,
    hospedaje DECIMAL(8,2) DEFAULT 0,
    parqueo DECIMAL(8,2) DEFAULT 0,
    transporte DECIMAL(8,2) DEFAULT 0,
    total_detalle DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (id_viatico) REFERENCES viaticos(id_viatico) ON DELETE CASCADE
);

select * from empleados;
INSERT INTO empleados (cui, nombre) 
VALUES ('1608766561307', 'Sydmontejo');
select * from viaticos;
select * from detalles_viatico;
UPDATE viaticos SET estado = 'aprobado' WHERE id_viatico=1;
