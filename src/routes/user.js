const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userCtrl");

router.post('user/novo-usuario', userCtrl.createUser);

module.exports = router;