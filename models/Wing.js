const mongoose = require("mongoose");

const wingsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    society_id: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true }, // Add reference to Society
  },
  {
    collection: "Wings", // Update the collection name to "Wings"
  }
);

module.exports = mongoose.model("Wings", wingsSchema);
