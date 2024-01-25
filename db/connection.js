const { Sequelize } = require('sequelize');

const db = new Sequelize('form_mined', process.env.DBUSER,  process.env.DBPWD, {
    host: process.env.DBHOST,
    dialect: 'mysql'
});
 
module.exports = {
    db
}