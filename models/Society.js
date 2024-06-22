const mongoose = require("mongoose");

const societySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
  },
  {
    collection: "Society",
  }
);

module.exports = mongoose.model("Society", societySchema);
