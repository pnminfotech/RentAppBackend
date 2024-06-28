const express = require("express");
const router = express.Router();
const WingController = require("../controllers/wingController");

router.get("/", WingController.getAllWings);
router.get("/:id", WingController.getWingById);
router.get("/wings-by-society/:id", WingController.getWingBySocietyId);
router.post("/", WingController.createWing);
router.put("/:id", WingController.updateWing);
router.delete("/:id", WingController.deleteWing);

module.exports = router;
