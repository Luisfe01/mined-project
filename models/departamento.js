const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Departamento = db.define('departamento', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: DataTypes.STRING
    },
    departamento: {
        type: DataTypes.STRING
    },
    abr: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = {
    Departamento
}