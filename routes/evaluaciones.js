const {Router} = require('express');
const { evaluacionesGet, evaluacionGet, evaluacionesPut, evaluacionesPost, evaluacionesDelete, evaluacionesResultGet, pdf } = require('../controllers/evaluaciones');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();

router.get('/', evaluacionesGet);
router.get('/resultados', evaluacionesResultGet);
router.get('/resultados/pdf', pdf);

router.get('/:id', evaluacionGet);

router.put('/:id', evaluacionesPut);

// [
//     check('test_id', 'El test es obligatorio').not().isEmpty(),
//     check('alumno_id', 'El alumno es obligatorio').not().isEmpty(),
//     check('docente_id', 'El docente es obligatorio').not().isEmpty(),
//     validarCampos
// ]
router.post('/', evaluacionesPost);

router.delete('/', evaluacionesDelete);

module.exports = router;