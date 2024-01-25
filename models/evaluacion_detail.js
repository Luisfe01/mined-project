const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Evaluacion_detail = db.define('evaluacion_detail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    evaluacion_id: {
        type: DataTypes.INTEGER
    },
    test_detail_id: {
        type: DataTypes.INTEGER
    },
    respuesta: {
        type: DataTypes.INTEGER
    },
    observaciones: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = {
    Evaluacion_detail
}