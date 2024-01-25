const { response, json } = require("express");
const bcryptjs = require('bcryptjs')

const { Docente } = require('../models/docente');
const { generarJWT } = require("../helpers/generar-JWT");

const login = async (req, res = response) => {

    const {codigo, password} = req.body

    try {
        //Verificar si el Docente existe
        const docente = await Docente.findOne({
            where: {
                password,
                codigo
            }
        });
        if (!docente) {
            return res.status(400).json({
                errors: [{msg: 'Usuario / Password no son correctos - usuario'}]
            })
        }
        
        // Verificar si el usuario esta activo
        if (!docente.estado) {
            return res.status(400).json({
                errors: [{msg: 'Usuario / Password no son correctos - estado'}]
            })
        }

        //Generar el JWT
        const token = await generarJWT(docente.id)

        res.json({
            docente,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errors: [{msg: 'Hable con el administrador'}]
        })
    }
}

const renovarToken = async (req, res = response) => {
    const {docente} = req
    
    //Generar el JWT
    const token = await generarJWT(docente.id)

    res.json({
        docente,
        token
    })
}
module.exports = {
    login,
    renovarToken
}