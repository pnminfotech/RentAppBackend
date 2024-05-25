const express = require("express");
const router = express.Router();

const { getLogin } = require("../controller/adminController");

router.route("/login").post(getLogin);

module.exports = router;
