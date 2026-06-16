const pool = require('../config/db');

const obtenerResumenDashboard = async (req, res) => {
    try {
        const [[productos]] = await pool.query(`
            SELECT COUNT(*) AS total_productos
            FROM producto
            WHERE estado = 1
        `);

        const [[usuarios]] = await pool.query(`
            SELECT COUNT(*) AS total_usuarios
            FROM usuario
            WHERE estado = 1
        `);

        const [[ventasHoy]] = await pool.query(`
            SELECT COUNT(*) AS ventas_hoy
            FROM venta
            WHERE DATE(fecha_venta) = CURDATE()
        `);

        const [[totalHoy]] = await pool.query(`
            SELECT COALESCE(SUM(total), 0) AS total_ventas_hoy
            FROM venta
            WHERE DATE(fecha_venta) = CURDATE()
        `);

        const [[stockBajo]] = await pool.query(`
            SELECT COUNT(*) AS stock_bajo
            FROM inventario
            WHERE stock <= stock_minimo
        `);

        res.json({
            productos: productos.total_productos,
            usuarios: usuarios.total_usuarios,
            ventas_hoy: ventasHoy.ventas_hoy,
            total_ventas_hoy: totalHoy.total_ventas_hoy,
            stock_bajo: stockBajo.stock_bajo
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener resumen del dashboard',
            error: error.message
        });
    }
};

module.exports = {
    obtenerResumenDashboard
};