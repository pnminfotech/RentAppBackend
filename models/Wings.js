const mongoose = require("mongoose");

const wingsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    collection: "Society",
  }
);

module.exports = mongoose.model("Wings", wingsSchema);
