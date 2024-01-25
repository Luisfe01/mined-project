const { response } = require('express')
const { Institucione } = require("../models/institucione")

const institucionesGet = async (req, res = response) => {

    try {
        const {codigo_dep = '', codigo_mun = ''} = req.query

        const query = {
            where: {
                codigo_mun: codigo_dep+codigo_mun
            }
        }
        const instituciones = await Institucione.findAll(query)

        if (instituciones.length > 0) {
            res.json({
                instituciones
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

module.exports = {
    institucionesGet
}