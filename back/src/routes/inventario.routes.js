const express = require('express');
const router = express.Router();

const {
    obtenerInventario,
    obtenerInventarioPorId,
    crearInventario,
    actualizarInventario
} = require('../controllers/inventario.controller');

const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/rol.middleware');

router.get('/', verificarToken, obtenerInventario);
router.get('/:id', verificarToken, obtenerInventarioPorId);
router.post('/', verificarToken, verificarAdmin, crearInventario);
router.put('/:id', verificarToken, verificarAdmin, actualizarInventario);

module.exports = router;