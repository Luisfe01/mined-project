const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Municipio = db.define('municipio', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_departamento: {
        type: DataTypes.INTEGER
    },
    municipio: {
        type: DataTypes.STRING
    },
    codigo: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = {
    Municipio
}