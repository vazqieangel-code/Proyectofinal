const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const pool = require('./config/db');
const categoriaRoutes = require('./routes/categoria.routes');
const productoRoutes = require('./routes/producto.routes');
const marcaRoutes = require('./routes/marca.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const ventaRoutes = require('./routes/venta.routes');
const reporteRoutes = require('./routes/reporte.routes');
const corteCajaRoutes = require('./routes/corteCaja.routes');
const tallaRoutes = require('./routes/talla.routes');
const colorRoutes = require('./routes/color.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API Tienda de Ropa funcionando'
    });
});

app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
        res.json({
            mensaje: 'Conexión a MySQL correcta',
            resultado: rows[0].resultado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al conectar con MySQL',
            error: error.message
        });
    }
});

app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/cortes', corteCajaRoutes);
app.use('/api/tallas', tallaRoutes);
app.use('/api/colores', colorRoutes);
app.use('/api/dashboard', dashboardRoutes);

module.exports = app;