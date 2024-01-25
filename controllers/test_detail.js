const { response } = require('express')
const { Tests_detail } = require("../models/test_detail");
const { QueryTypes } = require("sequelize");

const testDetailGet = async (req, res = response) => {
    const id = req.params.id;
    const {grado_id = 0} = req.query
    const query = {
        where: {
            test_id: id
        },
        order: [['id', 'ASC'],]       
    }

    try {
        const [total, detail] = await Promise.all([
            Tests_detail.count(query),
            Tests_detail.findAll(query)
        ])

        if (total > 0) {
            if (grado_id > 2) {
                detail.splice(0, 0, detail.splice(2, 1)[0])
                detail.splice(1, 0, detail.splice(2, 1)[0])
            }
            console.log(grado_id);
            res.json({
                total,
                detail
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
    testDetailGet
}