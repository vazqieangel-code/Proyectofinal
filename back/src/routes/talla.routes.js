const express = require('express');
const router = express.Router();

const {
    obtenerTallas,
    obtenerTallaPorId,
    crearTalla,
    actualizarTalla,
    eliminarTalla
} = require('../controllers/talla.controller');

const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/rol.middleware');

router.get('/', verificarToken, obtenerTallas);
router.get('/:id', verificarToken, obtenerTallaPorId);
router.post('/', verificarToken, verificarAdmin, crearTalla);
router.put('/:id', verificarToken, verificarAdmin, actualizarTalla);
router.delete('/:id', verificarToken, verificarAdmin, eliminarTalla);

module.exports = router;