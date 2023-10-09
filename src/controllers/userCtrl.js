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
        const statusCode = users ? 201 : 500;
        const response = await userDAO.updateUserDAO(userData) ? {success: `Usuário atualizado com sucesso.`} : {error: `Erro ao atualizar o usuário.`};

        this.sendResponse(res, statusCode, response);
    }

    searchAllUsers = async (req, res) => {
        const users = await userDAO.getAllUsers();
        const statusCode = users ? 200 : 500;
        const response = users ? users : {error: `Erro ao buscar os usuários.`};

        this.sendResponse(res, statusCode, response);
    }

    sendResponse = (res, statusCode, msg) => {
        res.status(statusCode).json(msg);
    }
}

module.exports = new UserCtrl();

