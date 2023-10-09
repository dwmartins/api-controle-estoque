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
            logger.log('error', `Erro criar o usuário ${user_email}`);
            return false;
        }
    }
}

module.exports = new UserDAO();