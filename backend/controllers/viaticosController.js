const ViaticosModel = require("../models/viaticosModel");
//const pool = require("../config/database");

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
        gastos,
      } = req.body;

      const resultado = await ViaticosModel.crearViaticoCompleto({
        cui,
        nombreTrabajador,
        nombreJefe,
        cantidadLetra,
        cantidadNumero,
        gastos,
      });

      res.json({
        success: true,
        numeroCaso: resultado.numeroCaso,
        message: "Viático creado exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
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

  // Obtener viático por número de caso
  static async obtenerViaticoPorNumeroCaso(req, res) {
    const { numeroCaso } = req.params;
    try {
      const [viatico] = await ViaticosModel.obtenerViaticoPorNumeroCaso(
        numeroCaso
      );

      if (!viatico || viatico.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Viático no encontrado" });
      }

      res.json({ success: true, data: viatico });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Actualizar estado y jefe que autoriza
  static async actualizarEstado(req, res) {
    try {
      const { numeroCaso } = req.params;
      const { nuevoEstado, nombreJefe } = req.body;

      if (!nuevoEstado || !nombreJefe) {
        return res
          .status(400)
          .json({ success: false, message: "Datos incompletos." });
      }

      const result = await ViaticosModel.actualizarEstado(
        numeroCaso,
        nuevoEstado,
        nombreJefe
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Viático no encontrado." });
      }

      res.json({ success: true, message: "Estado actualizado correctamente." });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar estado." });
    }
  }
}

module.exports = ViaticosController;
