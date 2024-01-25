const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Tests_detail = db.define('tests_detail', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    test_id: {
        type: DataTypes.INTEGER
    },
    question: {
        type: DataTypes.STRING
    },
    nivel: {
        type: DataTypes.STRING
    },
    orden: {
        type: DataTypes.INTEGER
    },
    respuestas: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = {
    Tests_detail
}