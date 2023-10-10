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
                    user_foto BLOB,
                    user_createdAt DATETIME,
                    user_updateAt DATETIME,
                    user_delete DATETIME,
                    user_delete_by INT,
                    user_delete_date DATETIME)`;

            await db.pool.query(this.sql);
        } catch (error) {
            logger.log('error', `Erro ao criar a tabela de usuários: ${error.message}`)
        }
    }

    tableUserAcesso = async () => {
        try {
            await db.pool.query(`
                CREATE TABLE IF NOT EXISTS user_acesso (
                    aces_id INT AUTO_INCREMENT PRIMARY KEY,
                    aces_user_id INT NOT NULL,
                    aces_user_email VARCHAR(100) NOT NULL,
                    aces_user_ip VARCHAR(255) NOT NULL,
                    aces_createdAt DATETIME,
                    FOREIGN KEY (aces_user_id) REFERENCES users(user_id)
                );`
            );
        } catch (error) {
            logger.log('error', `Erro ao criar a tabela de ( user_acesso ): ${error.message}`)
        }
    }

    createAll = async () => {
        await this.tableUsers();
        await this.tableUserAcesso();
    }
}

module.exports = new NewTableUsers();