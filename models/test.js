const { DataTypes } = require("sequelize");
const { db } = require('../db/connection');

const Test = db.define('test', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    test_name: {
        type: DataTypes.STRING
    },
    grado_id: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = {
    Test
}