const Wings = require("../models/Wings");

exports.getAllWings = async (req, res) => {
  try {
    const wings = await Wings.find();
    res.json(wings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWingById = async (req, res) => {
  try {
    const wing = await Wings.findById(req.params.id);
    if (wing) {
      res.json(wing);
    } else {
      res.status(404).json({ message: "Society not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createWing = async (req, res) => {
  const wing = new Wings({
    name: req.body.name,
    address: req.body.address,
  });

  try {
    const newWing = await wing.save();
    res.status(201).json(newWing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateWing = async (req, res) => {
  try {
    const wing = await Wings.findById(req.params.id);

    if (wing) {
      wing.name = req.body.name || wing.name;
      wing.address = req.body.address || wing.address;

      const updatedWing = await wing.save();
      res.json(updatedWing);
    } else {
      res.status(404).json({ message: "Society not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteWing = async (req, res) => {
  try {
    const wing = await Wings.findById(req.params.id);

    if (wing) {
      await wing.deleteOne();
      res.json({ message: "Society deleted" });
    } else {
      res.status(404).json({ message: "Society not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
