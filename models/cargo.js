const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Cargo = db.define('docente_cargo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
}, {
    timestamps: false
});

module.exports = {
    Cargo
}