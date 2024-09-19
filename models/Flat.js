const mongoose = require("mongoose");

const flatsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    flat_type: { type: String },
    rent_Amount: {type: String},
    wing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wings",
      required: true,
    },
    flat_status: { type: String, required: true },
  
  },
  {
    collection: "Flats",
  }
);

module.exports = mongoose.model("Flat", flatsSchema);
