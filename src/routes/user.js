const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userCtrl");

router.post('/novo-usuario', userCtrl.createUser);
router.put('/atualiza-usuario', userCtrl.updateUser);

module.exports = router;