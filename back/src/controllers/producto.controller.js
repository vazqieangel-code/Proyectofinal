const pool = require('../config/db');

const obtenerProductos = async (req, res) => {
    try {
        const [productos] = await pool.query(`
            SELECT 
                p.id_producto,
                p.codigo_producto,
                p.nombre_producto,
                p.descripcion,
                p.precio_venta,
                p.estado,
                c.nombre_categoria,
                m.nombre_marca
            FROM producto p
            INNER JOIN categoria c ON p.Categoria_id_categoria = c.id_categoria
            INNER JOIN marca m ON p.Marca_id_marca = m.id_marca
        `);

        res.json(productos);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener productos',
            error: error.message
        });
    }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [producto] = await pool.query(`
            SELECT 
                p.id_producto,
                p.codigo_producto,
                p.nombre_producto,
                p.descripcion,
                p.precio_venta,
                p.estado,
                p.Categoria_id_categoria,
                p.Marca_id_marca,
                c.nombre_categoria,
                m.nombre_marca
            FROM producto p
            INNER JOIN categoria c ON p.Categoria_id_categoria = c.id_categoria
            INNER JOIN marca m ON p.Marca_id_marca = m.id_marca
            WHERE p.id_producto = ?
        `, [id]);

        if (producto.length === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json(producto[0]);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el producto',
            error: error.message
        });
    }
};

const crearProducto = async (req, res) => {
    try {
        const {
            codigo_producto,
            nombre_producto,
            descripcion,
            precio_venta,
            Categoria_id_categoria,
            Marca_id_marca
        } = req.body;

        if (!codigo_producto || !nombre_producto || !precio_venta || !Categoria_id_categoria || !Marca_id_marca) {
            return res.status(400).json({
                mensaje: 'Faltan datos obligatorios'
            });
        }

        const [resultado] = await pool.query(`
            INSERT INTO producto (
                codigo_producto,
                nombre_producto,
                descripcion,
                precio_venta,
                estado,
                Categoria_id_categoria,
                Marca_id_marca
            ) VALUES (?, ?, ?, ?, 1, ?, ?)
        `, [
            codigo_producto,
            nombre_producto,
            descripcion,
            precio_venta,
            Categoria_id_categoria,
            Marca_id_marca
        ]);

        res.status(201).json({
            mensaje: 'Producto creado correctamente',
            id_producto: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear producto',
            error: error.message
        });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            codigo_producto,
            nombre_producto,
            descripcion,
            precio_venta,
            estado,
            Categoria_id_categoria,
            Marca_id_marca
        } = req.body;

        const [resultado] = await pool.query(`
            UPDATE producto
            SET 
                codigo_producto = ?,
                nombre_producto = ?,
                descripcion = ?,
                precio_venta = ?,
                estado = ?,
                Categoria_id_categoria = ?,
                Marca_id_marca = ?
            WHERE id_producto = ?
        `, [
            codigo_producto,
            nombre_producto,
            descripcion,
            precio_venta,
            estado,
            Categoria_id_categoria,
            Marca_id_marca,
            id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar producto',
            error: error.message
        });
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(`
            UPDATE producto
            SET estado = 0
            WHERE id_producto = ?
        `, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto dado de baja correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar producto',
            error: error.message
        });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};