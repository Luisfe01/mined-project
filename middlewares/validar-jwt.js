const { response } = require("express")
const jwt = require("jsonwebtoken")

const {Docente} = require('../models/docente');

const validarJWT = async (req, res = response, next) => {
    const token = req.header('x-token')
    if (!token) {
        return res.status(400).json({
            msg: 'No hay token en la peticion'
        })
    }
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        //leer el usuario que corresponde al uid
        const docente = await Docente.findByPk(uid)
        
        if (!docente) {
            return res.status(401).json({
                msg: 'Token no valido - docente no existe en DB'
            })
        }
        //Verificar si el uid tiene estado true
        if (!docente.estado) {
            return res.status(401).json({
                msg: 'Token no valido'
            })
        }
        req.docente = docente

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}