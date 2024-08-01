// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  flatType: { type: String, required: true },
  society: {  type: String, required: true },
  rentAmount: { type: Number, required: true },
  maintenanceAmount: { type: Number, required: true },

}, {
    collection: "Payment",
  });

module.exports = mongoose.model('Payment', paymentSchema);
