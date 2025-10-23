const express = require('express');
const cors = require('cors');
const viaticosRoutes = require('./routes/viaticosRoutes');
const empleadosRoutes = require('./routes/empleadosRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Prefijo de las rutas
app.use('/api/viaticos', viaticosRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/estado', viaticosRoutes);
// Puerto donde corre el backend
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
