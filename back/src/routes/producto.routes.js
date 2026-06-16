const express = require('express');
const router = express.Router();

const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/rol.middleware');

const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/producto.controller');

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.post(
    '/',
    verificarToken,
    verificarAdmin,
    crearProducto
);

router.put(
    '/:id',
    verificarToken,
    verificarAdmin,
    actualizarProducto
);

router.delete(
    '/:id',
    verificarToken,
    verificarAdmin,
    eliminarProducto
);

module.exports = router;