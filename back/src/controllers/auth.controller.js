const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const registrarUsuario = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            usuario,
            contraseña,
            telefono,
            Rol_id_rol
        } = req.body;

        if (!nombre || !apellido || !usuario || !contraseña || !Rol_id_rol) {
            return res.status(400).json({
                mensaje: 'Faltan datos obligatorios'
            });
        }

        const [usuarioExistente] = await pool.query(
            'SELECT id_usuario FROM usuario WHERE usuario = ?',
            [usuario]
        );

        if (usuarioExistente.length > 0) {
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
            mensaje: 'Usuario registrado correctamente',
            id_usuario: resultado.insertId
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar usuario',
            error: error.message
        });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;

        if (!usuario || !contraseña) {
            return res.status(400).json({
                mensaje: 'Usuario y contraseña son obligatorios'
            });
        }

        const [usuarios] = await pool.query(`
            SELECT 
                u.id_usuario,
                u.nombre,
                u.apellido,
                u.usuario,
                u.contraseña,
                u.estado,
                u.Rol_id_rol,
                r.nombre_rol
            FROM usuario u
            INNER JOIN rol r ON u.Rol_id_rol = r.id_rol
            WHERE u.usuario = ?
        `, [usuario]);

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const usuarioEncontrado = usuarios[0];

        if (usuarioEncontrado.estado === 0) {
            return res.status(403).json({
                mensaje: 'Usuario desactivado'
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            contraseña,
            usuarioEncontrado.contraseña
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            {
                id_usuario: usuarioEncontrado.id_usuario,
                usuario: usuarioEncontrado.usuario,
                Rol_id_rol: usuarioEncontrado.Rol_id_rol,
                nombre_rol: usuarioEncontrado.nombre_rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        res.json({
            mensaje: 'Login correcto',
            token,
            usuario: {
                id_usuario: usuarioEncontrado.id_usuario,
                nombre: usuarioEncontrado.nombre,
                apellido: usuarioEncontrado.apellido,
                usuario: usuarioEncontrado.usuario,
                rol: usuarioEncontrado.nombre_rol
            }
        });
    } catch (error) {
        console.error('ERROR LOGIN:', error);

        res.status(500).json({
            mensaje: 'Error al iniciar sesión',
            error: error.message,
            codigo: error.code
        });
    }
};

const obtenerPerfil = async (req, res) => {
    res.json({
        mensaje: 'Perfil obtenido correctamente',
        usuario: req.usuario
    });
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    obtenerPerfil
};