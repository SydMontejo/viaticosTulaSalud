const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT cui, nombre FROM empleados WHERE activo=1 ORDER BY nombre');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
