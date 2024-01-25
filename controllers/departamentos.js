const { response } = require('express')
const { Departamento } = require("../models/departamento")

const departamentosGet = async (req, res = response) => {

    try {
        const departamentos = await Departamento.findAll()

        if (departamentos.length > 0) {
            res.json({
                departamentos
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
    departamentosGet
}