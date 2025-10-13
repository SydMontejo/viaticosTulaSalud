const express = require('express');
const router = express.Router();
const viaticosController = require('../controllers/viaticosController');

//POST
router.post('/', viaticosController.crearViatico);

router.get('/dashboard', viaticosController.obtenerViaticosDashboard);
//GET
router.get('/:cui', viaticosController.obtenerViaticosPorCui);

module.exports = router;
