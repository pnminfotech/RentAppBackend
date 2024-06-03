const express = require("express");
const router = express.Router();

const {
  getLogin,
  distributeItem,
  getInventories,
} = require("../controller/adminController");

router.route("/login").post(getLogin);
router.route("/inventories").get(getInventories);
router.route("/distribute").post(distributeItem);

module.exports = router;
