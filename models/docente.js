const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Docente = db.define('docente', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    nombres: {
        type: DataTypes.STRING
    },
    apellidos: {
        type: DataTypes.STRING
    },
    institucion_id: {
        type: DataTypes.INTEGER
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: false
});

module.exports = {
    Docente
}