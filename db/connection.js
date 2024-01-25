const { Sequelize } = require('sequelize');

const db = new Sequelize({
    username: process.env.DBUSER,
    password: process.env.DBPWD,
    database: process.env.DBNAME,
    port: process.env.DBPORT,
    host: process.env.DBHOST,
    dialect: 'mysql'
});
 
module.exports = {
    db
}