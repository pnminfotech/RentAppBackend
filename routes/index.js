const express = require("express");
const router = express.Router();

// Import route modules
const societyRoutes = require("./societyRoutes");
const wingRoutes = require("./wingsRoutes")
const adminRoutes = require("./adminRoutes");

// Define routes
router.use("/societies", societyRoutes);
router.use("/wings", wingRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
