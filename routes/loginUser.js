const {Router} = require('express');
const { login, renovarToken } = require('../controllers/authUser');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');

const router = Router();

router.post('/',[
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

router.get('/', validarJWT, renovarToken)

module.exports = router;