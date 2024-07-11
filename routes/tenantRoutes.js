// routes/tenantRoutes.js
const express = require("express");
const router = express.Router();
const TenantController = require("../controllers/tenantController");

// Existing routes
router.get("/", TenantController.getAllTenants);
router.get("/rent-received", TenantController.getAllRentReceivedTenants);
router.get("/rent-pending", TenantController.getAllRentPendingTenants);
router.get("/:id", TenantController.getTenantById);
router.get("/tenants-by-flat/:id", TenantController.getTenantByFlatId);
router.post("/", TenantController.createTenant);
router.put("/:id", TenantController.updateTenant);
router.delete("/:id", TenantController.deleteTenant);

// New routes
router.get("/rent-pending-details", TenantController.getTenantsWithRentPending);
router.get(
  "/rent-received-details",
  TenantController.getTenantsWithRentReceived
);
router.get("/active-tenants", TenantController.getActiveTenants);

module.exports = router;
