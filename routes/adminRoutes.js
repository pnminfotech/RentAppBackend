const express = require("express");
const  router = express.Router();

const {
  getLogin,
  // distributeItem,
  // getInventories,
  // addInventory,
  // deleteInventory,
  requestPasswordReset,
  resetPassword,
  getSocieties,
  getFlats,
  getFlatsOnRent,
  getEmptyFlats,
  getRentReceived,
  getRentPending,
} = require("../controller/adminController");

router.route("/login").post(getLogin);
router.route("/get-societies").get(getSocieties);
router.route("/get-flats").get(getFlats);
router.route("/get-flatsOnRent").get(getFlatsOnRent);
router.route("/get-empty-flats").get(getEmptyFlats);
router.route("/get-monthly-rent-received").get(getRentReceived);
router.route("/get-monthly-rent-pending").get(getRentPending);
// router.route("/add-inventory").post(addInventory);
// router.route("/delete-inventory/:id").post(deleteInventory);
// router.route("/inventories").get(getInventories);
// router.route("/distribute").post(distributeItem);
router.route("/forget-password").post(requestPasswordReset);
router.route("/reset-password/:token").put(resetPassword);

module.exports = router;
