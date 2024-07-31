// Method to handle GET requests
const Payment = require('../models/Payment'); // Adjust the path as necessary

exports.getPaymentAmounts = async (req, res) => {
    try {
      const { society,flatType } = req.params;
  
      if (!society ||!flatType) {
        return res.status(400).json({ message: 'Flat type is required' });
      }
  
      const payment = await Payment.findOne({ society,flatType });
  
      if (!payment) {
        return res.status(404).json({ message: 'Payment details not found for this flat type' });
      }
  
      const { rentAmount, maintenanceAmount, lightBillAmount } = payment;
      res.status(200).json({
        flatType: payment.flatType,
        society:payment.society,
        rentAmount,
        maintenanceAmount,
        lightBillAmount
      });
    } catch (error) {
      console.error('Error fetching payment amounts:', error);
      res.status(500).json({ message: 'Error fetching payment amounts', error });
    }
  };
  
  // Method to handle POST requests (for adding or updating payments)
  exports.addOrUpdatePaymentAmounts = async (req, res) => {
    try {
      const {society, flatType, rentAmount, maintenanceAmount, lightBillAmount } = req.body;
  
      if (!society || !flatType || !rentAmount || !maintenanceAmount || !lightBillAmount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Find existing record or create a new one
      const payment = await Payment.findOneAndUpdate(
        { society,flatType },

        { rentAmount, maintenanceAmount, lightBillAmount },
        { new: true, upsert: true }  // Create if not exists, update if exists
      );
  
      res.status(200).json(payment);
    } catch (error) {
      console.error('Error adding or updating payment amounts:', error); // Log detailed error
      res.status(500).json({ message: 'Error adding or updating payment amounts', error });
    }
  };
  