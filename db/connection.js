const { Sequelize } = require('sequelize');

const db = new Sequelize('form_mined', process.env.DBUSER,  process.env.DBPWD, {
    host: 'localhost',
    dialect: 'mysql'
});
 
module.exports = {
    db
}