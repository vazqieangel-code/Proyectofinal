const express = require('express');
const router = express.Router();

const {
    obtenerColores,
    obtenerColorPorId,
    crearColor,
    actualizarColor,
    eliminarColor
} = require('../controllers/color.controller');

const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/rol.middleware');

router.get('/', verificarToken, obtenerColores);
router.get('/:id', verificarToken, obtenerColorPorId);
router.post('/', verificarToken, verificarAdmin, crearColor);
router.put('/:id', verificarToken, verificarAdmin, actualizarColor);
router.delete('/:id', verificarToken, verificarAdmin, eliminarColor);

module.exports = router;