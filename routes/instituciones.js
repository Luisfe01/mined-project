const { Router } = require('express');
const { institucionesGet } = require('../controllers/instituciones');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();

router.get('/', institucionesGet);

module.exports = router;