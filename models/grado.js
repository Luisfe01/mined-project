const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Grado = db.define('grado', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    grado: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false
});

module.exports = {
    Grado
}