const { response } = require('express')
const { Municipio } = require("../models/municipio")

const municipiosGet = async (req, res = response) => {
    try {
        const id = req.params.id;
        const query = {
            where: {
                id_departamento: id
            }
        }
        const municipios = await Municipio.findAll(query)

        if (municipios.length > 0) {
            res.json({
                municipios
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
    municipiosGet
}