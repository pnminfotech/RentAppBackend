const express = require("express");
const router = express.Router();
const FlatController = require("../controllers/flatController");

router.get("/", FlatController.getAllFlats);
router.get("/:id", FlatController.getFlatById);
router.post("/", FlatController.createFlat);
router.put("/:id", FlatController.updateFlat);
router.delete("/:id", FlatController.deleteFlat);

module.exports = router;
