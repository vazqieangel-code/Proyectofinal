const express = require('express');
const router = express.Router();

const {
    reporteVentas,
    productosMasVendidos,
    stockBajo
} = require('../controllers/reporte.controller');

const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarAdmin } = require('../middlewares/rol.middleware');

router.get('/ventas', verificarToken, verificarAdmin, reporteVentas);
router.get('/productos-mas-vendidos', verificarToken, verificarAdmin, productosMasVendidos);
router.get('/stock-bajo', verificarToken, verificarAdmin, stockBajo);

module.exports = router;