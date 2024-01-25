const { response } = require('express')
const { Cargo } = require("../models/cargo");
const { QueryTypes } = require("sequelize");

const cargosGet = async (req, res = response) => {

    const id = req.params.id;
    try {
        const cargos = await Cargo.sequelize.query("SELECT d.codigo, g.grado, s.seccion, c.grado_id, c.seccion_id FROM docente_cargos c INNER JOIN docentes d ON d.id = c.docente_id INNER JOIN grados g ON g.id = c.grado_id INNER JOIN secciones s ON s.id = c.seccion_id WHERE d.id = :id ORDER BY g.id ASC", {
            replacements: {id},
            type: QueryTypes.SELECT
        })

        if (cargos.length > 0) {
            res.json({
                cargos
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
    cargosGet
}