// routes/flatRoutes.js

const express = require("express");
const router = express.Router();
const FlatController = require("../controllers/flatController");

router.get("/", FlatController.getAllFlats);
router.get("/on-rent", FlatController.getRentedFlats);
router.get("/vaccant", FlatController.getVaccantFlats);
router.get("/allotted", FlatController.getAllottedFlats);
router.get("/count", FlatController.getCountFlats);
router.get("/:id", FlatController.getFlatById);
router.get("/flats-by-wings/:id", FlatController.getFlatsByWingsId);
router.post("/add-flats-by-wing/:id", FlatController.createFlatByWingId);
router.put("/:id", FlatController.updateFlat);
router.delete("/:id", FlatController.deleteFlat);

// New routes for flat types
router.get("/type/:type", FlatController.getFlatTypes);

module.exports = router;
