const db = require("../../config/dbConnection");
const logger = require("../../config/logger");

class UserDAO {

    newUserDAO = async (user) => {
        try {
            this.sql = `INSERT INTO users(
                            user_nome,
                            user_sobrenome,
                            user_email,
                            user_password,
                            user_token,
                            user_ativo,
                            user_tipo,
                            user_foto,
                            user_createdAt
                            )
                        VALUES (?,?,?,?,?,?,?,?,?);`;
            const values = [
                user.user_nome,
                user.user_sobrenome,
                user.user_email,
                user.user_password,
                user.user_token,
                user.user_ativo,
                user.user_tipo,
                user.user_foto,
                new Date()
            ];

            await db.pool.query(this.sql, values);

            return true;
        } catch (error) {
            logger.log('error', `Erro criar o usuário: ${error.message}`);
            return false;
        }
    }

    updateUserDAO = async (user) => {

        this.password = '';

        const values = [
            user.user_nome,
            user.user_sobrenome,
            user.user_email,
            user.user_tipo,
            new Date(),
            user.user_id
        ];

        if(user.user_password) {
            this.password = `user_password = ?,`;
            values.unshift(user.user_password);
        }

        try {
            this.sql = `
                        UPDATE users
                        SET ${this.password}
                            user_nome = ?,
                            user_sobrenome = ?,
                            user_email = ?,
                            user_tipo = ?,
                            user_updateAt = ?
                        WHERE user_id = ?`;
            await db.pool.query(this.sql, values);
            return true;
        } catch (error) {
            logger.log('error', `Erro ao atualizar o usuário: ${error.message}'`);
            return false;
        }
    }

    getAllUsers = async () => {
        try {
            this.sql = `SELECT *
                        FROM users 
                        WHERE user_ativo = 'S'
                        AND user_delete IS NULL`;
            
            const users = await db.pool.query(this.sql);
            return users[0];
        } catch (error) {
            logger.log('error', `Erro ao buscar todos os usuários: ${error.message}'`);
            return false;
        }
    }
    
    existingEmail = async (user_email) => {
        try {
            this.sql = `SELECT user_email FROM users WHERE user_email = ?`;

            const result = await db.pool.query(this.sql, user_email);
            return result[0];
        } catch (error) {
            logger.log('error', `Erro ao verificar se o e-mail existe: ${error.message}`);
            return false;
        }
    }

    searchUserByEmail = async (user_email) => {
        try {
            this.sql = ` SELECT *
                            FROM users
                            WHERE user_ativo = 'S'
                            AND user_delete IS NULL
                            AND user_email = ?`;

            const userEmail = await db.pool.query(this.sql, user_email)

            return userEmail[0];
        } catch (error) {
            logger.log('error', `Erro ao buscar o usuário pelo e-mail: ${error.message}`);
            return {error: error};
        }
    }

    userAccess = async (user_id, user_email, user_ip, user_acesso_date) => {
        try {
            this.sql = `INSERT INTO user_acesso (aces_user_id, aces_user_email, aces_user_ip, aces_createdAt) VALUES (?, ?, ?, ?)`;
            const values = [user_id, user_email, user_ip, user_acesso_date];

            await db.pool.query(this.sql, values);
            return true;
        } catch (error) {
            logger.log('error', `Erro ao salvar o acesso do usuário: ${error.message}`);
            return false;
        }
    }
}

module.exports = new UserDAO();