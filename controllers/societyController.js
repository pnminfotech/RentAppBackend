const Society = require("../models/Society");

// Get all societies
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    res.json(societies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get society by ID
exports.getSocietyById = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    if (society) {
      res.json(society);
    } else {
      res.status(404).json({ message: "Society not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new society
exports.createSociety = async (req, res) => {
  const society = new Society({
    name: req.body.name,
    address: req.body.address,
    // Add more fields as needed
  });

  try {
    const newSociety = await society.save();
    res.status(201).json(newSociety);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an existing society
exports.updateSociety = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);

    if (society) {
      society.name = req.body.name || society.name;
      society.address = req.body.address || society.address;
      // Update more fields as needed

      const updatedSociety = await society.save();
      res.json(updatedSociety);
    } else {
      res.status(404).json({ message: "Society not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a society
exports.deleteSociety = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);

    if (society) {
      await society.remove();
      res.json({ message: "Society deleted" });
    } else {
      res.status(404).json({ message: "Society not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
