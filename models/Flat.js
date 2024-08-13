const mongoose = require("mongoose");

const flatsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    flat_type: { type: String },
    wing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wings",
      required: true,
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true, // Assuming society is a required field
    },
    flat_status: { type: String, required: true },
    rentAmount: { type: Number, required: true },
  },
  {
    collection: "Flats",
  }
);

module.exports = mongoose.model("Flat", flatsSchema);
