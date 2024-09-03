const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");


router.post("/main", loginController.handleLogin);
module.exports = router; 