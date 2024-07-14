const mongoose = require("mongoose");

const flatsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    flat_type: { type: String },
    wing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wings",
      required: true,
    }, // Add reference to Society
    flat_status: { type: String, required: true },
  },
  {
    collection: "Flats", // Update the collection name to "Flat"
  }
);

module.exports = mongoose.model("Flat", flatsSchema);
