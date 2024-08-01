const Payment = require('../models/Payment');

// Update Rent Amount
exports.updateRent = async (req, res) => {
  const { society, flatType, ramount } = req.body;

  try {
    const payment = await Payment.findOneAndUpdate(
      { society, flatType },
      { rentAmount: ramount },
      { new: true, upsert: true }
    );
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating rent amount' });
  }
};

// Update Maintenance Amount
exports.updateMaintenance = async (req, res) => {
  const { society, flatType, mamount } = req.body;

  try {
    const payment = await Payment.findOneAndUpdate(
      { society, flatType },
      { maintenanceAmount: mamount },
      { new: true, upsert: true }
    );
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating maintenance amount' });
  }
};

// Get Rent or Maintenance Amount
// Get Rent or Maintenance Amount
exports.getPaymentDetails = async (req, res) => {
  const { type, society, flatType } = req.params;

  try {
    const payment = await Payment.findOne({ society, flatType });
    if (!payment) {
      return res.status(404).json({ error: 'No payment details found' });
    }

    let amount;
    if (type === 'rent') {
      amount = payment.rentAmount;
    } else if (type === 'maintenance') {
      amount = payment.maintenanceAmount;
    } else {
      return res.status(400).json({ error: 'Invalid type parameter' });
    }

    res.status(200).json({ amount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment details' });
  }
};

