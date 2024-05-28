const express = require("express");
const router = express.Router();

const { getLogin, getAllItems } = require("../controller/adminController");

router.route("/login").post(getLogin);
router.route("/getAllItems").post(getAllItems);

module.exports = router;
