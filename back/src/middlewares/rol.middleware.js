const verificarAdmin = (req, res, next) => {

    if (req.usuario.nombre_rol !== 'Administrador') {
        return res.status(403).json({
            mensaje: 'Acceso denegado'
        });
    }

    next();
};

module.exports = {
    verificarAdmin
};