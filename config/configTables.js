const NewTableUsers = require("../src/tables/users");

class TablesUser {
    createTableUsers = async () => {
        NewTableUsers.createAll();
    }
    
    createAll = async () => {
        console.log(`Iniciando configuração do banco de dados...`);
        await this.createTableUsers();
        console.log(`Configuração do banco de dados finalizada...`);
    }
}



module.exports = new TablesUser;