const express = require("express");
const router = express.Router();
const TenantController = require("../controllers/tenantController");

router.get("/", TenantController.getAllTenants);
router.get("/:id", TenantController.getTenantById);
router.post("/", TenantController.createTenant);
router.put("/:id", TenantController.updateTenant);
router.delete("/:id", TenantController.deleteTenant);

module.exports = router;
