const pool = require('../config/db');

const obtenerVentas = async (req, res) => {
    try {
        const [ventas] = await pool.query(`
            SELECT 
                v.id_venta,
                v.fecha_venta,
                v.total,
                v.estado,
                u.nombre AS nombre_usuario,
                u.apellido AS apellido_usuario,
                mp.nombre_metodo
            FROM venta v
            INNER JOIN usuario u ON v.Usuario_id_usuario = u.id_usuario
            INNER JOIN metodopago mp ON v.MetodoPago_id_metodo_pago = mp.id_metodo_pago
            ORDER BY v.fecha_venta DESC
        `);

        res.json(ventas);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener ventas',
            error: error.message
        });
    }
};

const crearVenta = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const {
            MetodoPago_id_metodo_pago,
            productos
        } = req.body;

        const Usuario_id_usuario = req.usuario.id_usuario;

        if (!MetodoPago_id_metodo_pago || !productos || productos.length === 0) {
            return res.status(400).json({
                mensaje: 'Faltan datos para registrar la venta'
            });
        }

        await connection.beginTransaction();

        let totalVenta = 0;

        for (const item of productos) {
            const [inventario] = await connection.query(`
                SELECT stock 
                FROM inventario
                WHERE id_inventario = ?
            `, [item.Inventario_id_inventario]);

            if (inventario.length === 0) {
                throw new Error('Producto de inventario no encontrado');
            }

            if (inventario[0].stock < item.cantidad) {
                throw new Error('Stock insuficiente para uno de los productos');
            }

            totalVenta += item.cantidad * item.precio_unitario;
        }

        const [ventaResultado] = await connection.query(`
            INSERT INTO venta (
                fecha_venta,
                total,
                estado,
                MetodoPago_id_metodo_pago,
                CorteCaja_id_corte,
                Usuario_id_usuario
            ) VALUES (NOW(), ?, 'COMPLETADA', ?, NULL, ?)
        `, [
            totalVenta,
            MetodoPago_id_metodo_pago,
            Usuario_id_usuario
        ]);

        const idVenta = ventaResultado.insertId;

        for (const item of productos) {
            const subtotal = item.cantidad * item.precio_unitario;

            await connection.query(`
                INSERT INTO detalleventa (
                    cantidad,
                    precio_unitario,
                    subtotal,
                    Inventario_id_inventario,
                    Venta_id_venta
                ) VALUES (?, ?, ?, ?, ?)
            `, [
                item.cantidad,
                item.precio_unitario,
                subtotal,
                item.Inventario_id_inventario,
                idVenta
            ]);

            await connection.query(`
                UPDATE inventario
                SET 
                    stock = stock - ?,
                    fecha_actualizacion = NOW()
                WHERE id_inventario = ?
            `, [
                item.cantidad,
                item.Inventario_id_inventario
            ]);

            const [stockActual] = await connection.query(`
                SELECT stock 
                FROM inventario
                WHERE id_inventario = ?
            `, [item.Inventario_id_inventario]);

            await connection.query(`
                INSERT INTO movimientoinventario (
                    tipo_movimiento,
                    cantidad,
                    fecha_movimiento,
                    motivo,
                    Inventario_id_inventario,
                    Usuario_id_usuario
                ) VALUES ('VENTA', ?, NOW(), ?, ?, ?)
            `, [
                item.cantidad,
                `Venta registrada con ID ${idVenta}. Stock restante: ${stockActual[0].stock}`,
                item.Inventario_id_inventario,
                Usuario_id_usuario
            ]);
        }

        await connection.commit();

        res.status(201).json({
            mensaje: 'Venta registrada correctamente',
            id_venta: idVenta,
            total: totalVenta
        });

    } catch (error) {
        await connection.rollback();

        res.status(500).json({
            mensaje: 'Error al registrar venta',
            error: error.message
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    obtenerVentas,
    crearVenta
};