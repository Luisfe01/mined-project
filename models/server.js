const express = require('express')
const cors = require('cors')
const {db} = require('../db/connection');

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.docentePath = '/api/docentes'
        this.loginPath = '/api/login'
        this.cargosPath = '/api/cargos'
        this.alumnosPath = '/api/alumnos'
        this.testsPath = '/api/tests'
        this.evaluacionesPath = '/api/evaluaciones'
        this.evaluacionDetailPath = '/api/evaluaciondetalle'
        this.testDetailPath = '/api/testdetalle'
        this.departamentosPath = '/api/departamentos'
        this.municipiosPath = '/api/municipios'
        this.institucionesPath = '/api/instituciones'
        this.cargasPath = '/api/cargas'
        // Middlewares
        this.middlewares()
        // Rutas de mi aplicacion
        this.routes()
        this.dbConnection()
    }

    middlewares() {

        //CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.alumnosPath, require('../routes/alumnos'));
        this.app.use(this.docentePath, require('../routes/docentes'));
        this.app.use(this.departamentosPath, require('../routes/departamentos'));
        this.app.use(this.municipiosPath, require('../routes/municipios'));
        this.app.use(this.institucionesPath, require('../routes/instituciones'));
        this.app.use(this.cargosPath, require('../routes/cargos'));
        this.app.use(this.testsPath, require('../routes/tests'));
        this.app.use(this.evaluacionesPath, require('../routes/evaluaciones'));
        this.app.use(this.evaluacionDetailPath, require('../routes/evaluacionDetail'));
        this.app.use(this.testDetailPath, require('../routes/testDetail'));
        this.app.use(this.loginPath, require('../routes/loginUser'));
        this.app.use(this.cargasPath, require('../routes/cargas'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo', this.port)
        })
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Database online');
            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Server;