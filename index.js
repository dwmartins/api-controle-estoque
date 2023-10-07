require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.SERVER_PORT;
const logger = require("./config/logger");
require("./config/dbConnection");

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/index.html');
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

app.listen(port, () => {
    console.log(`Servidor em execução na porta: ${port}`);
});