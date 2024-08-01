const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST: Update Rent Amount
router.post('/rent', paymentController.updateRent);

// POST: Update Maintenance Amount
router.post('/maintenance', paymentController.updateMaintenance);

// GET: Get Rent or Maintenance Amount
router.get('/:type/:society/:flatType', paymentController.getPaymentDetails);

module.exports = router;
