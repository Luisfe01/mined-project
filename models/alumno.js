const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Alumno = db.define('alumno', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nie: {
        type: DataTypes.STRING
    },
    nombres: {
        type: DataTypes.STRING
    },
    apellidos: {
        type: DataTypes.STRING
    },
    genero: {
        type: DataTypes.STRING
    },
    fecha_nacimiento: {
        type: DataTypes.STRING
    },
    grado_id: {
        type: DataTypes.INTEGER
    },
    seccion_id: {
        type: DataTypes.INTEGER
    },
    institucion_id: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false
});

module.exports = {
    Alumno
}