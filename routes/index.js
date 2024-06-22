const express = require("express");
const router = express.Router();

// Import route modules
const societyRoutes = require("./societyRoutes");
const adminRoutes = require("./adminRoutes");

// Define routes
router.use("/societies", societyRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
