const pool = require('../config/db');

const obtenerCategorias = async (req, res) => {
    try {
        const [categorias] = await pool.query(`
            SELECT 
                id_categoria,
                nombre_categoria,
                descripcion
            FROM categoria
        `);

        res.json(categorias);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener categorías',
            error: error.message
        });
    }
};

const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [categoria] = await pool.query(`
            SELECT 
                id_categoria,
                nombre_categoria,
                descripcion
            FROM categoria
            WHERE id_categoria = ?
        `, [id]);

        if (categoria.length === 0) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.json(categoria[0]);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener categoría',
            error: error.message
        });
    }
};

const crearCategoria = async (req, res) => {
    try {
        const { nombre_categoria, descripcion } = req.body;

        if (!nombre_categoria) {
            return res.status(400).json({
                mensaje: 'El nombre de la categoría es obligatorio'
            });
        }

        const [resultado] = await pool.query(`
            INSERT INTO categoria (
                nombre_categoria,
                descripcion
            ) VALUES (?, ?)
        `, [nombre_categoria, descripcion]);

        res.status(201).json({
            mensaje: 'Categoría creada correctamente',
            id_categoria: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear categoría',
            error: error.message
        });
    }
};

const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_categoria, descripcion } = req.body;

        if (!nombre_categoria) {
            return res.status(400).json({
                mensaje: 'El nombre de la categoría es obligatorio'
            });
        }

        const [resultado] = await pool.query(`
            UPDATE categoria
            SET 
                nombre_categoria = ?,
                descripcion = ?
            WHERE id_categoria = ?
        `, [nombre_categoria, descripcion, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.json({
            mensaje: 'Categoría actualizada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar categoría',
            error: error.message
        });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(`
            DELETE FROM categoria
            WHERE id_categoria = ?
        `, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        res.json({
            mensaje: 'Categoría eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar categoría',
            error: error.message
        });
    }
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};