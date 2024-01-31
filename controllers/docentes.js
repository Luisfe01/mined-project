const { response } = require('express')
const {Docente} = require("../models/docente");
const bcryptjs = require('bcryptjs');
const { QueryTypes } = require("sequelize");

const docentesGet = async (req, res = response) => {
    const {institucion = 0} = req.query
    
    const query = {
        where: {
            institucion_id: institucion
        }
    }

    const [total, docentes] = await Promise.all([
        Docente.count(query),
        Docente.findAll(query)
    ])

    res.json({
        total,
        docentes
    })
}

/** TODO;
 * controller get docente :id
 */
const docenteGet = async (req, res = response) => {
    const id = req.params.id;

    const docente = await Docente.findByPk(id)
    if (docente == null) {
        res.status(404).json({ msg: "No se encontró el docente"})
    } else {
        res.json({ docente })
    }
}

const docentesPost = async (req, res) => {
    const {body} = req;
    try {
        

        const docente = Docente.build(body);
        
        docente.password = body.correo
        await docente.save();

        res.json({
            docente
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{msg:"Ocurrio un error inesperado"}]
        })
    }
}

const docenteCargosPost = async (req, res) => {
    const {body} = req;
    try {

        const val = await Docente.sequelize.query("SELECT * FROM docente_cargos WHERE docente_id = :docente_id AND grado_id = :grado_id AND seccion_id = :seccion_id", {
            replacements: body,
            type: QueryTypes.SELECT
        })

        if (val.length > 0) {
            return res.status(400).json({
                errors: [{msg:"Ya existe el registro"}]
            })
        }
        
        const cargo = await Docente.sequelize.query("INSERT INTO docente_cargos(docente_id, grado_id, seccion_id) VALUES (:docente_id, :grado_id, :seccion_id)", {
            replacements: body,
            type: QueryTypes.INSERT
        })

        res.json({
            cargo
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{msg:"Ocurrio un error inesperado"}]
        })
    }
}

const docentesPut = async (req, res = response) => {

    const id = req.params.id;

    const {_id, password, ...resto} = req.body

    //Validar contra DB
    if (password) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const docente = await Docente.findByIdAndUpdate(id, resto)

    res.json({
        docente
    })
}

const docentesPatch = (req, res = response) => {
    res.json({
        msg: "patch API - Controlador"
    })
}

const docentesDelete = async (req, res = response) => {
    const {id} = req.params

    const docente = await Docente.findByIdAndUpdate(id, {estado: false})

    res.json({
        docente
    })
}


module.exports = {
    docentesGet,
    docenteGet,
    docentesPost,
    docentesPut,
    docentesPatch,
    docentesDelete,
    docenteCargosPost
}