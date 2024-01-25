const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Seccion = db.define('seccione', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    grado: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = {
    Seccion
}