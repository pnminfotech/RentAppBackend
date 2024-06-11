const express = require("express");
const router = express.Router();

const {
  getLogin,
  distributeItem,
  getInventories,
  addInventory,
  deleteInventory,
  requestPasswordReset,
  resetPassword,
} = require("../controller/adminController");

router.route("/login").post(getLogin);
router.route("/add-inventory").post(addInventory);
router.route("/delete-inventory/:id").post(deleteInventory);
router.route("/inventories").get(getInventories);
router.route("/distribute").post(distributeItem);
router.route("/forget-password").post(requestPasswordReset);
router.route("/reset-password/:token").put(resetPassword);

module.exports = router;
