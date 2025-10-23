const express = require('express');
const router = express.Router();
const viaticosController = require('../controllers/viaticosController');

//POST
router.post('/', viaticosController.crearViatico);

router.get('/dashboard', viaticosController.obtenerViaticosDashboard);
//GET
router.get('/caso/:numeroCaso', viaticosController.obtenerViaticoPorNumeroCaso);
//PUT - actualiza estado del viatico
router.put('/estado/:numeroCaso', viaticosController.actualizarEstado);

module.exports = router;
