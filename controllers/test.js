const { response } = require('express')
const { Test } = require("../models/test");
const { QueryTypes, Sequelize } = require("sequelize");

const testsGet = async (req, res = response) => {

    const {grado = 0} = req.query
    const Op = Sequelize.Op
    const query = {
        where: {
            grado_id:  {
                [Op.like]:`%${grado}%`
            }
        }
    }

    try {
        const [total, tests] = await Promise.all([
            Test.count(query),
            Test.findAll(query)
        ])

        if (total > 0) {
            res.json({
                total,
                tests
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

const testGet = async (req, res = response) => {

    const id = req.params.id;
    

    try {
        const test = await Test.sequelize.query("SELECT t.test_name, td.id, td.question FROM tests t INNER JOIN tests_detail td ON t.id = td.test_id WHERE t.id = :id", {
            replacements: { id },
            type: QueryTypes.SELECT
        })

        if (test.length <= 0) {
            res.status(404).json({
                errors: [{msg: "No se encontraron datos"}]
            })
        } else {
            res.json({
                test
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({errors: [{msg:"Ocurrio un error inesperado"}]})
    }

}

module.exports = {
    testsGet,
    testGet
}