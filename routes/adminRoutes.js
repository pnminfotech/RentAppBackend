const express = require("express");
const router = express.Router();

const { getLogin, distributeItem } = require("../controller/adminController");

router.route("/login").post(getLogin);
router.route("/getAllItems").post(distributeItem);

module.exports = router;
