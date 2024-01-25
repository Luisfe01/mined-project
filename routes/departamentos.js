const { Router } = require('express');
const { departamentosGet } = require('../controllers/departamentos');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();

router.get('/', departamentosGet);

// router.get('/:id', [
//     check('id', 'Ingrese un id valido').isInt(),
//     validarCampos
// ], departamentosGet);

module.exports = router;