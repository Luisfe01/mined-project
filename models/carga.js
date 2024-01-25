const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Carga = db.define('carga', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    test_id: {
        type: DataTypes.INTEGER
    },
    docente_id: {
        type: DataTypes.INTEGER
    },
    grado_id: {
        type: DataTypes.INTEGER
    },
    seccion_id: {
        type: DataTypes.INTEGER
    },
    resultado: {
        type: DataTypes.STRING
    },
    cantidad: {
        type: DataTypes.INTEGER
    }
});

module.exports = {
    Carga
}