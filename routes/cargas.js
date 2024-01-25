const { Router } = require('express');
const { cargaGet, cargaPost, cargaPut } = require('../controllers/cargas');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');

const router = Router();

router.get('/', [
    validarJWT,
    validarCampos
], cargaGet)

router.post('/',[
    validarJWT,
    check('docente_id', 'Faltan datos importantes').not().isEmpty(),
    check('grado_id', 'Seleccione un grado').not().isEmpty(),
    check('seccion_id', 'Seleccione un grado').not().isEmpty(),
    check('test_id', 'Seleccione una evaluacion').not().isEmpty(),
    check('resultado', 'Seleccione una respuesta').not().isEmpty(),
    check('cantidad', 'Ingrese una cantidad').not().isEmpty(),
    validarCampos
], cargaPost)

router.put('/:id',[
    validarJWT,
    check('cantidad', 'Ingrese una cantidad').not().isEmpty(),
    validarCampos
], cargaPut)

module.exports = router;