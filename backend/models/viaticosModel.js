const db = require('../config/database');

class ViaticosModel {
    static async crearViaticoCompleto(datos) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Verificar o crear empleado
            let [empleado] = await connection.execute(
                'SELECT id_empleado FROM empleados WHERE cui = ?',
                [datos.cui]
            );

            if (empleado.length === 0) {
                const [result] = await connection.execute(
                    'INSERT INTO empleados (cui, nombre) VALUES (?, ?)',
                    [datos.cui, datos.nombreTrabajador]
                );
                empleado = [{ id_empleado: result.insertId }];
            }

            // 2. Generar número de caso
            const numeroCaso = `CASO-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 4)}`;


            // 3. Insertar viático principal
            const [viatico] = await connection.execute(
                `INSERT INTO viaticos 
                (id_empleado, numero_caso, cantidad_letra, cantidad_numero, nombre_jefe) 
                VALUES (?, ?, ?, ?, ?)`,
                [
                    empleado[0].id_empleado,
                    numeroCaso,
                    datos.cantidadLetra,
                    datos.cantidadNumero,
                    datos.nombreJefe
                ]
            );

            // 4. Insertar detalles de gastos
            for (const gasto of datos.gastos) {
                await connection.execute(
                    `INSERT INTO detalles_viatico 
                    (id_viatico, fecha, resultado, producto, motivo, destino,
                     desayuno, almuerzo, cena, hospedaje, parqueo, transporte, total_detalle) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        viatico.insertId,
                        gasto.fecha,
                        gasto.resultado,
                        gasto.producto,
                        gasto.motivo,
                        gasto.destino,
                        gasto.desayuno,
                        gasto.almuerzo,
                        gasto.cena,
                        gasto.hospedaje,
                        gasto.parqueo,
                        gasto.transporte,
                        gasto.total
                    ]
                );
            }

            await connection.commit();
            return { numeroCaso, idViatico: viatico.insertId };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async obtenerViaticosPorCui(cui) {
        const [rows] = await db.execute(
            `SELECT v.*, e.nombre as nombre_empleado 
             FROM viaticos v 
             JOIN empleados e ON v.id_empleado = e.id_empleado 
             WHERE e.cui = ? 
             ORDER BY v.fecha_creacion DESC`,
            [cui]
        );
        return rows;
    }

    static async obtenerDetallesViatico(idViatico) {
        const [rows] = await db.execute(
            `SELECT * FROM detalles_viatico WHERE id_viatico = ?`,
            [idViatico]
        );
        return rows;
    }

    // Dashboard
static async obtenerViaticosDashboard(estado) {
    // Query base
    let query = `
        SELECT v.id_viatico, v.numero_caso, v.estado, v.fecha_creacion, e.nombre AS trabajador
        FROM viaticos v
        JOIN empleados e ON v.id_empleado = e.id_empleado
    `;
    const params = [];

    // Filtro por estado si se recibe
    if (estado) {
        query += ' WHERE v.estado = ?';
        params.push(estado);
    }

    query += ' ORDER BY v.fecha_creacion DESC';

    const [viaticos] = await db.execute(query, params);

    // Traer detalles de gastos para cada viático
    for (const v of viaticos) {
        const [detalles] = await db.execute(
            `SELECT desayuno, almuerzo, cena, hospedaje, parqueo, transporte
             FROM detalles_viatico
             WHERE id_viatico = ?`,
            [v.id_viatico]
        );
        v.detalles = detalles;
    }

    return viaticos;
}

}

module.exports = ViaticosModel;