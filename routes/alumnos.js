const {Router} = require('express');
const { alumnosGet, alumnoGet, alumnosPost, alumnosPut, alumnosEvaluadosGet } = require('../controllers/alumnos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');

const router = Router();

router.get('/', [validarJWT, validarCampos], alumnosGet);

router.get('/evaluados', [validarJWT, validarCampos], alumnosEvaluadosGet);

router.get('/:id', alumnoGet);

router.put('/', [validarJWT, validarCampos], alumnosPut);

router.post('/',[
    validarJWT,
    check('nie', 'El nie es obligatorio').not().isEmpty(),
    check('nombres', 'Los nombres son obligatorios').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    validarCampos
], alumnosPost);

// router.delete('/', docentesDelete);

// router.patch('/', docentesPatch);

module.exports = router;