const pool = require('../config/db');

const obtenerColores = async (req, res) => {
    try {
        const [colores] = await pool.query(`
            SELECT id_color, nombre_color
            FROM color
        `);

        res.json(colores);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener colores',
            error: error.message
        });
    }
};

const obtenerColorPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [colores] = await pool.query(`
            SELECT id_color, nombre_color
            FROM color
            WHERE id_color = ?
        `, [id]);

        if (colores.length === 0) {
            return res.status(404).json({
                mensaje: 'Color no encontrado'
            });
        }

        res.json(colores[0]);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener color',
            error: error.message
        });
    }
};

const crearColor = async (req, res) => {
    try {
        const { nombre_color } = req.body;

        if (!nombre_color) {
            return res.status(400).json({
                mensaje: 'El nombre del color es obligatorio'
            });
        }

        const [resultado] = await pool.query(`
            INSERT INTO color (nombre_color)
            VALUES (?)
        `, [nombre_color]);

        res.status(201).json({
            mensaje: 'Color creado correctamente',
            id_color: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear color',
            error: error.message
        });
    }
};

const actualizarColor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_color } = req.body;

        if (!nombre_color) {
            return res.status(400).json({
                mensaje: 'El nombre del color es obligatorio'
            });
        }

        const [resultado] = await pool.query(`
            UPDATE color
            SET nombre_color = ?
            WHERE id_color = ?
        `, [nombre_color, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Color no encontrado'
            });
        }

        res.json({
            mensaje: 'Color actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar color',
            error: error.message
        });
    }
};

const eliminarColor = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(`
            DELETE FROM color
            WHERE id_color = ?
        `, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Color no encontrado'
            });
        }

        res.json({
            mensaje: 'Color eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar color',
            error: error.message
        });
    }
};

module.exports = {
    obtenerColores,
    obtenerColorPorId,
    crearColor,
    actualizarColor,
    eliminarColor
};