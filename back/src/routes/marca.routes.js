const express = require('express');
const router = express.Router();

const {
    obtenerMarcas,
    obtenerMarcaPorId,
    crearMarca,
    actualizarMarca,
    eliminarMarca
} = require('../controllers/marca.controller');

const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/rol.middleware');

router.get('/', verificarToken, obtenerMarcas);
router.get('/:id', verificarToken, obtenerMarcaPorId);
router.post('/', verificarToken, verificarAdmin, crearMarca);
router.put('/:id', verificarToken, verificarAdmin, actualizarMarca);
router.delete('/:id', verificarToken, verificarAdmin, eliminarMarca);

module.exports = router;