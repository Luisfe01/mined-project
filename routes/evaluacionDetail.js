const {Router} = require('express');
const { evaluacionDetailGet, evaluacionDetailPost } = require('../controllers/evaluacion_detail');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();

router.get('/', evaluacionDetailGet);

// router.get('/:id', evaluacionDetailGet);

// router.put('/:id', evaluacionesPut);

// [
//     check('test_id', 'El test es obligatorio').not().isEmpty(),
//     check('alumno_id', 'El alumno es obligatorio').not().isEmpty(),
//     check('docente_id', 'El docente es obligatorio').not().isEmpty(),
//     validarCampos
// ]

router.post('/', evaluacionDetailPost);

// router.delete('/', evaluacionesDelete);

module.exports = router;