const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to get payment amounts by flat type (GET request)
router.get('/:society/:flatType', paymentController.getPaymentAmounts);

// Route to add or update payment amounts (POST request)
router.post('/', paymentController.addOrUpdatePaymentAmounts);

module.exports = router;
