const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Institucione = db.define('institucione', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: DataTypes.STRING
    },
    institucion: {
        type: DataTypes.STRING
    },
    sector: {
        type: DataTypes.STRING
    },
    zona: {
        type: DataTypes.STRING
    },
    codigo_dep: {
        type: DataTypes.STRING
    },
    codigo_mun: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = {
    Institucione
}