const pool = require('../config/db');

const obtenerTallas = async (req, res) => {
    try {
        const [tallas] = await pool.query(`
            SELECT id_talla, nombre_talla
            FROM talla
        `);

        res.json(tallas);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener tallas',
            error: error.message
        });
    }
};

const obtenerTallaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [tallas] = await pool.query(`
            SELECT id_talla, nombre_talla
            FROM talla
            WHERE id_talla = ?
        `, [id]);

        if (tallas.length === 0) {
            return res.status(404).json({
                mensaje: 'Talla no encontrada'
            });
        }

        res.json(tallas[0]);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener talla',
            error: error.message
        });
    }
};

const crearTalla = async (req, res) => {
    try {
        const { nombre_talla } = req.body;

        if (!nombre_talla) {
            return res.status(400).json({
                mensaje: 'El nombre de la talla es obligatorio'
            });
        }

        const [resultado] = await pool.query(`
            INSERT INTO talla (nombre_talla)
            VALUES (?)
        `, [nombre_talla]);

        res.status(201).json({
            mensaje: 'Talla creada correctamente',
            id_talla: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear talla',
            error: error.message
        });
    }
};

const actualizarTalla = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_talla } = req.body;

        if (!nombre_talla) {
            return res.status(400).json({
                mensaje: 'El nombre de la talla es obligatorio'
            });
        }

        const [resultado] = await pool.query(`
            UPDATE talla
            SET nombre_talla = ?
            WHERE id_talla = ?
        `, [nombre_talla, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Talla no encontrada'
            });
        }

        res.json({
            mensaje: 'Talla actualizada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar talla',
            error: error.message
        });
    }
};

const eliminarTalla = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(`
            DELETE FROM talla
            WHERE id_talla = ?
        `, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Talla no encontrada'
            });
        }

        res.json({
            mensaje: 'Talla eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar talla',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTallas,
    obtenerTallaPorId,
    crearTalla,
    actualizarTalla,
    eliminarTalla
};