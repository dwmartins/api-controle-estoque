require('dotenv').config();
const express = require("express");
const cors = require("cors");
const logger = require("../config/logger");
const path = require('path');
require("../config/dbConnection");

const userRoute = require("../src/routes/user");

createServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    
    // Routes
    app.use('/user', userRoute);

    app.get('/', (req, res) => {
        res.status(200).sendFile(path.resolve('index.html'));
    })

    app.use((req, res, next) => {
        const error = new Error('Rota não encontrada!');
        error.status = 404;
        next(error);
    });
    
    app.use((error, req, res, next) => {
        const statusCode = error.status || 500;
        const errorMessage = error.message || `Erro interno do servidor`;
    
        console.log(`Erro ${statusCode}: ${errorMessage}`);
    
        logger.log('error', `Erro ${statusCode}: ${errorMessage} `);
        res.status(statusCode).json({
            error: errorMessage
        })
    });

    return app;
};

module.exports = createServer();