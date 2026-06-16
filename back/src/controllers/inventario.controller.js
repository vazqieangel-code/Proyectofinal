const pool = require('../config/db');

const obtenerInventario = async (req, res) => {
    try {
        const [inventario] = await pool.query(`
            SELECT 
                i.id_inventario,
                i.stock,
                i.stock_minimo,
                i.fecha_actualizacion,
                p.id_producto,
                p.codigo_producto,
                p.nombre_producto,
                p.precio_venta,
                t.nombre_talla,
                c.nombre_color
            FROM inventario i
            INNER JOIN producto p ON i.Producto_id_producto = p.id_producto
            INNER JOIN talla t ON i.Talla_id_talla = t.id_talla
            INNER JOIN color c ON i.Color_id_color = c.id_color
        `);

        res.json(inventario);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener inventario',
            error: error.message
        });
    }
};

const crearInventario = async (req, res) => {
    try {
        const {
            stock,
            stock_minimo,
            Producto_id_producto,
            Talla_id_talla,
            Color_id_color
        } = req.body;

        if (
            stock === undefined ||
            stock_minimo === undefined ||
            !Producto_id_producto ||
            !Talla_id_talla ||
            !Color_id_color
        ) {
            return res.status(400).json({
                mensaje: 'Faltan datos obligatorios'
            });
        }

        const [resultado] = await pool.query(`
            INSERT INTO inventario (
                stock,
                stock_minimo,
                fecha_actualizacion,
                Producto_id_producto,
                Talla_id_talla,
                Color_id_color
            ) VALUES (?, ?, NOW(), ?, ?, ?)
        `, [
            stock,
            stock_minimo,
            Producto_id_producto,
            Talla_id_talla,
            Color_id_color
        ]);

        res.status(201).json({
            mensaje: 'Inventario registrado correctamente',
            id_inventario: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear inventario',
            error: error.message
        });
    }
};

const actualizarInventario = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock, stock_minimo } = req.body;

        if (stock === undefined || stock_minimo === undefined) {
            return res.status(400).json({
                mensaje: 'Stock y stock mínimo son obligatorios'
            });
        }

        const [resultado] = await pool.query(`
            UPDATE inventario
            SET 
                stock = ?,
                stock_minimo = ?,
                fecha_actualizacion = NOW()
            WHERE id_inventario = ?
        `, [stock, stock_minimo, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Inventario no encontrado'
            });
        }

        res.json({
            mensaje: 'Inventario actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar inventario',
            error: error.message
        });
    }
};

const obtenerInventarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [inventario] = await pool.query(`
            SELECT 
                i.id_inventario,
                i.stock,
                i.stock_minimo,
                i.fecha_actualizacion,
                p.id_producto,
                p.codigo_producto,
                p.nombre_producto,
                p.precio_venta,
                t.nombre_talla,
                c.nombre_color
            FROM inventario i
            INNER JOIN producto p ON i.Producto_id_producto = p.id_producto
            INNER JOIN talla t ON i.Talla_id_talla = t.id_talla
            INNER JOIN color c ON i.Color_id_color = c.id_color
            WHERE i.id_inventario = ?
        `, [id]);

        if (inventario.length === 0) {
            return res.status(404).json({
                mensaje: 'Inventario no encontrado'
            });
        }

        res.json(inventario[0]);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener inventario',
            error: error.message
        });
    }
};

module.exports = {
    obtenerInventario,
    obtenerInventarioPorId,
    crearInventario,
    actualizarInventario
};