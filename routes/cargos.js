const { Router } = require('express');
const { cargosGet, cargoDelete } = require('../controllers/cargos');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();

// router.get('/', cargosGet);

router.get('/:id', [
    check('id', 'Ingrese un id valido').isInt(),
    validarCampos
], cargosGet);

// router.post('/', [
//     check('codigo', 'El correo es obligatorio').not().isEmpty(),
//     check('password', 'La contraseña es obligatoria').not().isEmpty(),
//     validarCampos
// ], docentePost);

router.delete('/:id', cargoDelete);

// router.patch('/', docentesPatch);

module.exports = router;