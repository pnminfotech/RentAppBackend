const express = require("express");
const router = express.Router();
const TenantController = require("../controllers/tenantController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg" && ext !== ".pdf") {
      return cb(new Error("Only images and PDF files are allowed"), false);
    }
    cb(null, true);
  },
}).fields([
  { name: "tenant_photo", maxCount: 1 },
  { name: "adhar_front", maxCount: 1 },
  { name: "adhar_back", maxCount: 1 },
  { name: "pan_photo", maxCount: 1 },
  { name: "electricity_bill", maxCount: 1 },
]);

// Existing routes
router.get("/", TenantController.getAllTenants);
router.get("/rent-received", TenantController.getAllRentReceivedTenants);
router.get("/rent-pending", TenantController.getAllRentPendingTenants);
router.get("/:id", TenantController.getTenantById);
router.get("/tenants-by-flat/:id", TenantController.getTenantByFlatId);

router.post(
  "/add-tenant-by-flat/:id",
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("MulterError:", err);
        res.status(400).json({ error: err.message });
      } else if (err) {
        console.error("Unknown error:", err);
        res.status(500).json({ error: err.message });
      } else {
        next();
      }
    });
  },
  TenantController.createTenant
);

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
