const { response } = require('express')
const {Evaluacion_detail} = require("../models/evaluacion_detail");

const evaluacionDetailGet = async (req, res = response) => {
    const {evaluacion = 0} = req.query
    
    const query = {
        where: {
            evaluacion_id: evaluacion
        }
    }

    const [total, evaluacion_detail] = await Promise.all([
        Evaluacion_detail.count(query),
        Evaluacion_detail.findAll(query)
    ])

    res.json({
        total,
        evaluacion_detail
    })
}

const evaluacionDetailPost = async (req, res) => {
    const {body} = req;
    try {
        const detail = Evaluacion_detail.build(body);
        await detail.save();

        res.json({
            detail
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({errors: [{msg:"error al ingresar los resultados"}]});
    }
}

module.exports = {
    evaluacionDetailGet,
    evaluacionDetailPost
}