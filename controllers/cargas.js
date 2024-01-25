const { response } = require('express')
const { Carga } = require("../models/carga");
const { QueryTypes } = require("sequelize");

const cargaGet = async (req, res = response) => {

    const { test_id = 1, grado_id = 6, seccion_id = 1, docente_id } = req.query
    try {
        const query = {
            where: {
                docente_id,
                grado_id,
                seccion_id,
                test_id
            }
        }

        const [total, evaluaciones] = await Promise.all([
            Carga.count(query),
            Carga.findAll(query)
        ])

        if (total > 0) {
            res.json({
                evaluaciones
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

const cargaPost = async (req, res) => {
    const {body} = req;
    try {
        
        const verify = await Carga.findAll({where: {grado_id: body.grado_id, seccion_id: body.seccion_id, resultado: body.resultado, docente_id: body.docente_id }})

        if (verify.length > 0) {
            return res.status(400).json({
                errors: [{msg: 'Ya ha registrado este resultado, seleccione otro'}]
            })
        }

        const carga = Carga.build(body);
        
        await carga.save();

        res.json({
            carga
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{msg:"Ocurrio un error inesperado"}]
        })
    }
}

const cargaPut = async (req, res) => {
    const id = req.params.id;

    try {

        const carga = await Carga.update(req.body, {where: {id}});

        res.json({
            carga
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{msg:"Ocurrio un error inesperado"}]
        })
    }
}
module.exports = {
    cargaGet,
    cargaPost,
    cargaPut
}