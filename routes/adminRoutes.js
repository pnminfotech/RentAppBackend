const express = require("express");
const router = express.Router();

const {
  getLogin,
  distributeItem,
  getInventories,
  addInventory,
} = require("../controller/adminController");

router.route("/login").post(getLogin);
router.route("/add-inventory").post(addInventory);
router.route("/inventories").get(getInventories);
router.route("/distribute").post(distributeItem);

module.exports = router;
