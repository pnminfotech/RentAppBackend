const express = require("express");
const router = express.Router();
const TenantController = require("../controllers/tenantController");

router.get("/", TenantController.getAllTenants);
router.get("/rent-received", TenantController.getAllRentReceivedTenants);
router.get("/rent-pending", TenantController.getAllRentPendingTenants);
router.get("/:id", TenantController.getTenantById);
router.get("/tenants-by-flat/:id", TenantController.getTenantByFlatId);
router.post("/", TenantController.createTenant);
router.put("/:id", TenantController.updateTenant);
router.delete("/:id", TenantController.deleteTenant);

module.exports = router;
