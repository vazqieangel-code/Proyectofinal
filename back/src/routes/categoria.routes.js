const express = require('express');
const router = express.Router();

const {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categoria.controller');

const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/rol.middleware');

router.get('/', verificarToken, obtenerCategorias);
router.get('/:id', verificarToken, obtenerCategoriaPorId);
router.post('/', verificarToken, verificarAdmin, crearCategoria);
router.put('/:id', verificarToken, verificarAdmin, actualizarCategoria);
router.delete('/:id', verificarToken, verificarAdmin, eliminarCategoria);

module.exports = router;