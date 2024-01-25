const { Router } = require('express');
const { municipiosGet } = require('../controllers/municipios');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();

// router.get('/', departamentosGet);

router.get('/:id', [
    check('id', 'Ingrese un id valido').isInt(),
    validarCampos
], municipiosGet);

module.exports = router;