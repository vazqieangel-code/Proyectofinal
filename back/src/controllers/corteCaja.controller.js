const pool = require('../config/db');

const obtenerCortes = async (req, res) => {
    try {
        const [cortes] = await pool.query(`
            SELECT
                c.id_corte,
                c.fecha_inicio,
                c.fecha_final,
                c.total_ventas,
                c.observaciones,
                u.nombre,
                u.apellido
            FROM cortecaja c
            INNER JOIN usuario u
                ON c.Usuario_id_usuario = u.id_usuario
            ORDER BY c.fecha_final DESC
        `);

        res.json(cortes);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener cortes de caja',
            error: error.message
        });
    }
};

const crearCorte = async (req, res) => {
    try {

        const {
            fecha_inicio,
            fecha_final,
            observaciones
        } = req.body;

        const Usuario_id_usuario = req.usuario.id_usuario;

        const [ventas] = await pool.query(`
            SELECT COALESCE(SUM(total),0) AS total
            FROM venta
            WHERE fecha_venta BETWEEN ? AND ?
        `, [fecha_inicio, fecha_final]);

        const totalVentas = ventas[0].total;

        const [resultado] = await pool.query(`
            INSERT INTO cortecaja (
                fecha_inicio,
                fecha_final,
                total_ventas,
                observaciones,
                Usuario_id_usuario
            )
            VALUES (?, ?, ?, ?, ?)
        `, [
            fecha_inicio,
            fecha_final,
            totalVentas,
            observaciones,
            Usuario_id_usuario
        ]);

        res.status(201).json({
            mensaje: 'Corte de caja generado correctamente',
            id_corte: resultado.insertId,
            total_ventas: totalVentas
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al generar corte de caja',
            error: error.message
        });
    }
};

module.exports = {
    obtenerCortes,
    crearCorte
};