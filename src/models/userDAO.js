const db = require("../../config/dbConnection");
const logger = require("../../config/logger");

class UserDAO {

    newUser = async (user) => {
        try {
            this.sql = `INSERT INTO(
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

        } catch (error) {
            logger.log('error', `Erro criar o usuário ${user.user_nome}`);
        }
    }

    existingEmail = async (user_email) => {
        try {
            this.sql = `SELECT user_email FROM users WHERE user_email = ?`;

            const result = await db.pool.query(this.sql, user_email);
            return result[0];
        } catch (error) {
            logger.log('error', `Erro criar o usuário ${user_email}`);
        }
    }
}

module.exports = new UserDAO();