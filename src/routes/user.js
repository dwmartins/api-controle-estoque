const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userCtrl");

router.post('/novo-usuario', userCtrl.createUser);
router.put('/atualiza-usuario', userCtrl.updateUser);
router.get('/usuarios', userCtrl.searchAllUsers);
router.post('/login', userCtrl.userLogin);

module.exports = router;