const {Router} = require('express');
const { docentesGet, docenteGet, docentesPut, docentesPost, docentesDelete, docentesPatch, docenteCargosPost } = require('../controllers/docentes');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();

router.get('/', docentesGet);

router.get('/:id', docenteGet);

router.put('/:id', docentesPut);

router.post('/',[
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('correo', 'El formato de correo no es valido').isEmail(),
    check('institucion_id', 'La institucion es obligatorio').not().isEmpty(),
    validarCampos
], docentesPost);

router.post('/cargo',[
    check('docente_id', 'El id es obligatorio').not().isEmpty(),
    check('grado_id', 'El grado es obligatorio').not().isEmpty(),
    check('seccion_id', 'La seccion es obligatoria').not().isEmpty(),
    validarCampos
], docenteCargosPost);

router.delete('/', docentesDelete);

router.patch('/', docentesPatch);

module.exports = router;