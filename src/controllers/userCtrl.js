const userDAO = require("../models/userDAO");
const helper = require("../utilities/helper");

class UserCtrl {

    createUser = async (req, res) => {
        
        const userData = req.body;
    
        const emailExists = await userDAO.existingEmail(userData.user_email);

        const token = helper.newCrypto();
        userData.user_token = token;

        if(!emailExists.length && emailExists) {
            const password = await helper.encodePassword(userData.user_password);
            userData.user_password = password;
            
            if(await userDAO.newUserDAO(userData)) {
                this.sendResponse(res, 201, userData);
            } else {
                this.sendResponse(res, 500, {error: `Erro ao criar o usuário`});
            }

        } else {
            const response = {alert: `Este e-mail já está em uso.`};
            this.sendResponse(res, 200, response);
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

