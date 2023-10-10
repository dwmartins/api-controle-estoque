const userDAO = require("../models/userDAO");
const helper = require("../utilities/helper");
const jwt = require('jsonwebtoken');

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

    userLogin = async (req, res) => {
        const {user_email, user_password} = req.body;

        const user = await userDAO.searchUserByEmail(user_email);

        if(user.error) {
            this.sendResponse(res, 500, {error: `Erro ao realizar o login.`});
            return;
        }

        if(user.length) {
            const password_hash = await helper.comparePasswordHash(user_password, user[0].user_password);

            if(password_hash && !password_hash.error) {
                // aqui cria o token com um tempo de expiração de 1 hora;
                const expiresIn = '1h';
                const payload  = { email: user[0].user_email };
                const token = jwt.sign(payload, user[0].user_token, { expiresIn });

                delete user[0].user_token;
                delete user[0].user_password;

                const user_ip = req.ip.replace('::ffff:', '');
                await userDAO.userAccess(user[0].user_id, user_email, user_ip, new Date())

                const data = {success: true, user_token: token, userData: user};
                this.sendResponse(res, 200, data);
                return;
            } else if(!password_hash && !password_hash.error){
                this.sendResponse(res, 200, {alert: `Usuário ou senha inválidos.`});
                return;
            } else {
                this.sendResponse(res, 500, {error: `Erro ao realizar o login.`});
                return;
            }

        } else {
            this.sendResponse(res, 200, {alert: `Usuário ou senha inválidos.`});
        }
    }

    sendResponse = (res, statusCode, msg) => {
        res.status(statusCode).json(msg);
    }
}

module.exports = new UserCtrl();

