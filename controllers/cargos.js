const { response } = require('express')
const { Cargo } = require("../models/cargo");
const { QueryTypes } = require("sequelize");

const cargosGet = async (req, res = response) => {

    const id = req.params.id;
    try {
        const cargos = await Cargo.sequelize.query("SELECT c.id, d.codigo, g.grado, s.seccion, c.grado_id, c.seccion_id FROM docente_cargos c INNER JOIN docentes d ON d.id = c.docente_id INNER JOIN grados g ON g.id = c.grado_id INNER JOIN secciones s ON s.id = c.seccion_id WHERE d.id = :id ORDER BY g.id ASC", {
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

const cargoDelete = async (req, res = response) => {
    const id = req.params.id;
    try {
        const cargos = await Cargo.sequelize.query("SELECT c.*, d.institucion_id FROM docente_cargos c INNER JOIN docentes d ON d.id = c.docente_id WHERE c.id = :id", {
            replacements: {id},
            type: QueryTypes.SELECT
        })

        const alumnos = await Cargo.sequelize.query("SELECT id FROM alumnos WHERE grado_id = :grado AND seccion_id = :seccion AND institucion_id = :inst", {
            replacements: {grado: cargos[0].grado_id, seccion: cargos[0].seccion_id, inst: cargos[0].institucion_id },
            type: QueryTypes.SELECT
        })

        if (alumnos.length > 0) {
            res.status(404).json({errors: [{msg:"No se pudo eliminar porque ya se han registrado alumnos en el grado"}]})
        } else {
            const del = await Cargo.destroy({
                where: {id}
            })

            if (del) {
                res.json({
                    del
                })
            } else {
                res.status(500).json({errors: [{msg:"Ocurrio un error inesperado al eliminar"}]})
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({errors: [{msg:"Ocurrio un error inesperado"}]})
    }
}

module.exports = {
    cargosGet,
    cargoDelete
}