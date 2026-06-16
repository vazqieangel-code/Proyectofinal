const express = require('express');
const router = express.Router();

const {
    obtenerCortes,
    crearCorte
} = require('../controllers/corteCaja.controller');

const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/rol.middleware');

router.get(
    '/',
    verificarToken,
    verificarAdmin,
    obtenerCortes
);

router.post(
    '/',
    verificarToken,
    verificarAdmin,
    crearCorte
);

module.exports = router;