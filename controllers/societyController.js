const Society = require("../models/Society");

exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    res.json(societies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCountSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    res.json({ totalSocieties: societies.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

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

exports.createSociety = async (req, res) => {
  const society = new Society({
    name: req.body.name,
    address: req.body.address,
  });

  try {
    const newSociety = await society.save();
    res.status(201).json(newSociety);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSociety = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);

    if (society) {
      society.name = req.body.name || society.name;
      society.address = req.body.address || society.address;

      const updatedSociety = await society.save();
      res.json(updatedSociety);
    } else {
      res.status(404).json({ message: "Society not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSociety = async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);

    if (society) {
      await society.deleteOne();
      res.json({ message: "Society deleted" });
    } else {
      res.status(404).json({ message: "Society not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
