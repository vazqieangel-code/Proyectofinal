const express = require('express');
const router = express.Router();

const {
    obtenerVentas,
    crearVenta
} = require('../controllers/venta.controller');

const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', verificarToken, obtenerVentas);
router.post('/', verificarToken, crearVenta);

module.exports = router;