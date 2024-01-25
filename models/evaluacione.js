const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Evaluacione = db.define('evaluacione', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    test_id: {
        type: DataTypes.INTEGER
    },
    alumno_id: {
        type: DataTypes.INTEGER
    },
    docente_id: {
        type: DataTypes.INTEGER
    },
    resultado: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.CHAR
    }
});

module.exports = {
    Evaluacione
}