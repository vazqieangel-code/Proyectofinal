const express = require('express');
const router = express.Router();

const {
    registrarUsuario,
    loginUsuario,
    obtenerPerfil
} = require('../controllers/auth.controller');

const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/perfil', verificarToken, obtenerPerfil);

module.exports = router;