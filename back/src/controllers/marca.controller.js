const pool = require('../config/db');

const obtenerMarcas = async (req, res) => {
    try {
        const [marcas] = await pool.query(`
            SELECT 
                id_marca,
                nombre_marca,
                descripcion
            FROM marca
        `);

        res.json(marcas);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener marcas',
            error: error.message
        });
    }
};

const obtenerMarcaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [marca] = await pool.query(`
            SELECT 
                id_marca,
                nombre_marca,
                descripcion
            FROM marca
            WHERE id_marca = ?
        `, [id]);

        if (marca.length === 0) {
            return res.status(404).json({
                mensaje: 'Marca no encontrada'
            });
        }

        res.json(marca[0]);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener marca',
            error: error.message
        });
    }
};

const crearMarca = async (req, res) => {
    try {
        const { nombre_marca, descripcion } = req.body;

        if (!nombre_marca) {
            return res.status(400).json({
                mensaje: 'El nombre de la marca es obligatorio'
            });
        }

        const [resultado] = await pool.query(`
            INSERT INTO marca (
                nombre_marca,
                descripcion
            ) VALUES (?, ?)
        `, [nombre_marca, descripcion]);

        res.status(201).json({
            mensaje: 'Marca creada correctamente',
            id_marca: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear marca',
            error: error.message
        });
    }
};

const actualizarMarca = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_marca, descripcion } = req.body;

        if (!nombre_marca) {
            return res.status(400).json({
                mensaje: 'El nombre de la marca es obligatorio'
            });
        }

        const [resultado] = await pool.query(`
            UPDATE marca
            SET 
                nombre_marca = ?,
                descripcion = ?
            WHERE id_marca = ?
        `, [nombre_marca, descripcion, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Marca no encontrada'
            });
        }

        res.json({
            mensaje: 'Marca actualizada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar marca',
            error: error.message
        });
    }
};

const eliminarMarca = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(`
            DELETE FROM marca
            WHERE id_marca = ?
        `, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Marca no encontrada'
            });
        }

        res.json({
            mensaje: 'Marca eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar marca',
            error: error.message
        });
    }
};

module.exports = {
    obtenerMarcas,
    obtenerMarcaPorId,
    crearMarca,
    actualizarMarca,
    eliminarMarca
};