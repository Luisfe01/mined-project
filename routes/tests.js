const {Router} = require('express');
const { testsGet, testGet } = require('../controllers/test');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');

const router = Router();

router.get('/', testsGet);

router.get('/:id', testGet);

// router.put('/:id', docentesPut);

// router.post('/',[
//     check('codigo', 'El correo es obligatorio').not().isEmpty(),
//     check('password', 'la contraseña es obligatoria').not().isEmpty(),
//     validarCampos
// ], docentesPost);

// router.delete('/', docentesDelete);

// router.patch('/', docentesPatch);

module.exports = router;