const db = require("../../config/dbConnection");
const logger = require("../../config/logger");

class NewTableUsers {
    tableUsers = async () => {
        try {
            this.sql = `
                CREATE TABLE IF NOT EXISTS users (
                    user_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_nome VARCHAR(50) NOT NULL,
                    user_sobrenome VARCHAR(50) NOT NULL,
                    user_email VARCHAR(100) NOT NULL UNIQUE,
                    user_password VARCHAR(255) NOT NULL,
                    user_token VARCHAR(255) NOT NULL,
                    user_ativo CHAR(1),
                    user_tipo VARCHAR(50),
                    user_foto VARCHAR(255),
                    user_createdAt DATETIME,
                    user_disable DATETIME,
                    user_disable_by INT,
                    user_updateAt DATETIME);`

            await db.pool.query(this.sql);
        } catch (error) {
            logger.log('error', `Erro ao criar a tabela de usuários: ${error}`)
        }
    }

    createAll = async () => {
        await this.tableUsers();
    }
}

module.exports = new NewTableUsers();