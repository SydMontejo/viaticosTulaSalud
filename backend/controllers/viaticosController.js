const ViaticosModel = require('../models/viaticosModel');

class ViaticosController {
    // Crear nuevo viático
    static async crearViatico(req, res) {
        try {
            const { 
                cui, 
                nombreTrabajador, 
                nombreJefe, 
                cantidadLetra, 
                cantidadNumero, 
                gastos 
            } = req.body;

            const resultado = await ViaticosModel.crearViaticoCompleto({
                cui,
                nombreTrabajador,
                nombreJefe,
                cantidadLetra,
                cantidadNumero,
                gastos
            });

            res.json({
                success: true,
                numeroCaso: resultado.numeroCaso,
                message: 'Viático creado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Obtener viáticos por CUI
    static async obtenerViaticosPorCui(req, res) {
        try {
            const { cui } = req.params;
            const viaticos = await ViaticosModel.obtenerViaticosPorCui(cui);
            res.json({ success: true, data: viaticos });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Obtener detalles de un viático
    static async obtenerDetallesViatico(req, res) {
        try {
            const { idViatico } = req.params;
            const detalles = await ViaticosModel.obtenerDetallesViatico(idViatico);
            res.json({ success: true, data: detalles });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Dashboard de viáticos
static async obtenerViaticosDashboard(req, res) {
    try {
        const { estado } = req.query; // pendiente, aprobado, rechazado
        const viaticos = await ViaticosModel.obtenerViaticosDashboard(estado);
        res.json({ success: true, data: viaticos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

}

module.exports = ViaticosController;