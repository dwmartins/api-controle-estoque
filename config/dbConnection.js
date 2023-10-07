const config = require("./config");
const mysql2 = require("mysql2/promise");
const logger = require("./logger");

class DBConnection {
    constructor() {
        this.pool = mysql2.createPool(config.db);

        this.checkConnection();
    }

    checkConnection = async () => {
        try {
            await this.pool.query('SELECT 1+1');
            console.log("Conexão com o banco de dados estabelecida com sucesso.");

            const configTables = require("./configTables");
            configTables.createAll();
        } catch (error) {
            this.getErrorConnection(error.code);
        }
    }

    getErrorConnection = (error) => {
        switch (error) {
            case 'ER_BAD_DB_ERROR':
                logger.log('error', `Banco de dados '${config.db.database}' não encontrado.`);
                break;

            case 'ER_ACCESS_DENIED_ERROR':
                logger.log('error', `Credencias incorretas para conectar ao banco de dados.`);
                break;

            case 'ER_CONN_REFUSED':
                logger.log('error', `Servidor MySQL não esta em execução ou a portar não esta disponível.`);
                break;

            case 'ER_UNKNOWN_ERROR':
                logger.log('error',  `Houve um erro inesperado no servidor MySQL.`);
                break;
            default:
                logger.log('error',  `Houve um erro inesperado no servidor MySQL.`);
                break;
        }
    }
}

module.exports = new DBConnection();