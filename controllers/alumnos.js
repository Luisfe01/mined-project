const { response } = require('express')
const { Alumno } = require("../models/alumno");
const { Evaluacione } = require("../models/evaluacione");
const { QueryTypes, Op } = require("sequelize");

const alumnosGet = async (req, res = response) => {

    const {institucion = 0, grado = 0, seccion = ""} = req.query
    
    const query = {
        where: {
            institucion_id: institucion,
            grado_id: grado,
            seccion_id: seccion
        }
    }

    try {
        const [total, alumnos] = await Promise.all([
            Alumno.count(query),
            Alumno.findAll(query)
        ])

        if (total > 0) {
            res.json({
                total,
                alumnos
            })
        } else {
            res.status(404).json({
                errors: [{msg: "No se encontraron datos"}]
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({errors: [{msg:"Ocurrio un error inesperado"}]})
    }

}

const alumnosEvaluadosGet = async (req, res = response) => {

    const {institucion = 0, grado = 0, seccion = "", docente = 0, test = 0} = req.query
    

    
    try {

        const ids = await Evaluacione.findAll({
            where: {
                docente_id: docente,
                test_id: test,
                estado: 'F'
            },
            attributes: ['alumno_id'], 
        })

        const map1 = ids.map( (evaluacione) => evaluacione.dataValues.alumno_id)

        const query = {
            where: {
                institucion_id: institucion,
                grado_id: grado,
                seccion_id: seccion,
                id: {[Op.notIn]:map1}
            }
        }

        const [total, alumnos] = await Promise.all([
            Alumno.count(query),
            Alumno.findAll(query)
        ])

        if (total > 0) {
            res.json({
                total,
                alumnos
            })
        } else {
            res.status(404).json({
                errors: [{msg: "No se encontraron datos"}]
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({errors: [{msg:"Ocurrio un error inesperado"}]})
    }

}

const alumnoGet = async (req, res = response) => {

    const id = req.params.id;
    

    try {
        const alumno = await Alumno.findByPk(id) 

        if (alumno == null) {
            res.status(404).json({
                errors: [{msg: "No se encontraron datos"}]
            })
        } else {
            res.json({
                alumno
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({errors: [{msg:"Ocurrio un error inesperado"}]})
    }

}

const alumnosPost = async (req, res) => {
    const {body} = req;
    try {

        const alumno = Alumno.build(body);
        await alumno.save();

        res.json({
            alumno
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{msg:"Ocurrio un error inesperado"}]
        })
    }
}

const alumnosPut = async (req, res) => {
    const {_id, ...body} = req.body;
    
    try {

        const alumno = await Alumno.update(body, {where: {id: _id}});

        res.json({
            alumno
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{msg:"Ocurrio un error inesperado"}]
        })
    }
}
module.exports = {
    alumnosGet,
    alumnosEvaluadosGet,
    alumnoGet,
    alumnosPost,
    alumnosPut
}