const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const obtenerUsuarios = async (req, res) => {
    try {
        const [usuarios] = await pool.query(`
            SELECT 
                u.id_usuario,
                u.nombre,
                u.apellido,
                u.usuario,
                u.telefono,
                u.estado,
                u.Rol_id_rol,
                r.nombre_rol
            FROM usuario u
            INNER JOIN rol r ON u.Rol_id_rol = r.id_rol
        `);

        res.json(usuarios);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [usuarios] = await pool.query(`
            SELECT 
                u.id_usuario,
                u.nombre,
                u.apellido,
                u.usuario,
                u.telefono,
                u.estado,
                u.Rol_id_rol,
                r.nombre_rol
            FROM usuario u
            INNER JOIN rol r ON u.Rol_id_rol = r.id_rol
            WHERE u.id_usuario = ?
        `, [id]);

        if (usuarios.length === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json(usuarios[0]);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener usuario',
            error: error.message
        });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, usuario, contraseña, telefono, Rol_id_rol } = req.body;

        if (!nombre || !apellido || !usuario || !contraseña || !Rol_id_rol) {
            return res.status(400).json({
                mensaje: 'Faltan datos obligatorios'
            });
        }

        const [existe] = await pool.query(
            'SELECT id_usuario FROM usuario WHERE usuario = ?',
            [usuario]
        );

        if (existe.length > 0) {
            return res.status(409).json({
                mensaje: 'El usuario ya existe'
            });
        }

        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

        const [resultado] = await pool.query(`
            INSERT INTO usuario (
                nombre,
                apellido,
                usuario,
                contraseña,
                telefono,
                estado,
                Rol_id_rol
            ) VALUES (?, ?, ?, ?, ?, 1, ?)
        `, [
            nombre,
            apellido,
            usuario,
            contraseñaEncriptada,
            telefono,
            Rol_id_rol
        ]);

        res.status(201).json({
            mensaje: 'Usuario creado correctamente',
            id_usuario: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear usuario',
            error: error.message
        });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, usuario, telefono, estado, Rol_id_rol } = req.body;

        if (!nombre || !apellido || !usuario || estado === undefined || !Rol_id_rol) {
            return res.status(400).json({
                mensaje: 'Faltan datos obligatorios'
            });
        }

        const [resultado] = await pool.query(`
            UPDATE usuario
            SET 
                nombre = ?,
                apellido = ?,
                usuario = ?,
                telefono = ?,
                estado = ?,
                Rol_id_rol = ?
            WHERE id_usuario = ?
        `, [
            nombre,
            apellido,
            usuario,
            telefono,
            estado,
            Rol_id_rol,
            id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json({
            mensaje: 'Usuario actualizado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(`
            UPDATE usuario
            SET estado = 0
            WHERE id_usuario = ?
        `, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json({
            mensaje: 'Usuario desactivado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al desactivar usuario',
            error: error.message
        });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};