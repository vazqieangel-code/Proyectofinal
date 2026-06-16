const pool = require('../config/db');

const reporteVentas = async (req, res) => {
    try {
        const [ventas] = await pool.query(`
            SELECT 
                v.id_venta,
                v.fecha_venta,
                v.total,
                v.estado,
                u.nombre AS vendedor,
                mp.nombre_metodo
            FROM venta v
            INNER JOIN usuario u ON v.Usuario_id_usuario = u.id_usuario
            INNER JOIN metodopago mp ON v.MetodoPago_id_metodo_pago = mp.id_metodo_pago
            ORDER BY v.fecha_venta DESC
        `);

        res.json(ventas);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al generar reporte de ventas',
            error: error.message
        });
    }
};

const productosMasVendidos = async (req, res) => {
    try {
        const [productos] = await pool.query(`
            SELECT 
                p.id_producto,
                p.nombre_producto,
                SUM(dv.cantidad) AS total_vendido,
                SUM(dv.subtotal) AS total_generado
            FROM detalleventa dv
            INNER JOIN inventario i ON dv.Inventario_id_inventario = i.id_inventario
            INNER JOIN producto p ON i.Producto_id_producto = p.id_producto
            GROUP BY p.id_producto, p.nombre_producto
            ORDER BY total_vendido DESC
        `);

        res.json(productos);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener productos más vendidos',
            error: error.message
        });
    }
};

const stockBajo = async (req, res) => {
    try {
        const [productos] = await pool.query(`
            SELECT 
                i.id_inventario,
                p.nombre_producto,
                p.codigo_producto,
                t.nombre_talla,
                c.nombre_color,
                i.stock,
                i.stock_minimo
            FROM inventario i
            INNER JOIN producto p ON i.Producto_id_producto = p.id_producto
            INNER JOIN talla t ON i.Talla_id_talla = t.id_talla
            INNER JOIN color c ON i.Color_id_color = c.id_color
            WHERE i.stock <= i.stock_minimo
        `);

        res.json(productos);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener productos con stock bajo',
            error: error.message
        });
    }
};

module.exports = {
    reporteVentas,
    productosMasVendidos,
    stockBajo
};