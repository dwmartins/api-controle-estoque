const userDAO = require("../models/userDAO");
const helper = require("../utilities/helper");
const logger = require("../../config/logger");

class UserCtrl {

    createUser = async (req, res) => {
        try {
            const userData = req.body;
        
            const emailExists = await userDAO.existingEmail(userData.user_email);
            const token = helper.newCrypto();
            userData.user_token = token;

            if(!emailExists.length) {
                const password = await helper.encodePassword(userData.user_password);
                userData.user_password = password;
                
                await userDAO.newUserDAO(userData);
                this.sendResponse(res, 201, userData);
            } else {
                const response = {alert: `Este e-mail já está em uso.`};
                this.sendResponse(res, 200, response);
            }
            
        } catch (error) {
            logger.log('error', `Erro ao criar o usuário: ${error.message}`);
            this.sendResponse(res, 500, error);
        }
    }

    updateUser = async (req, res) => {
        const userData = req.body;

        if(await userDAO.updateUserDAO(userData)) {
            this.sendResponse(res, 201, {success: `Usuário atualizado com sucesso.`});
        } else {
            this.sendResponse(res, 500, {error: `Erro ao atualizar o usuário.`});
        }
    }

    sendResponse = (res, statusCode, msg) => {
        res.status(statusCode).json(msg);
    }
}

module.exports = new UserCtrl();

