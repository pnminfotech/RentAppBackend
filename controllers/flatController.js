const Flats = require("../models/Flat");

exports.getAllFlats = async (req, res) => {
  try {
    const flats = await Flats.find();
    res.json(flats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFlatById = async (req, res) => {
  try {
    const flat = await Flats.findById(req.params.id);
    if (flat) {
      res.json(flat);
    } else {
      res.status(404).json({ message: "Flat not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFlat = async (req, res) => {
  const flat = new Flats({
    name: req.body.name,
    wing_id: req.body.wing_id,
  });
  try {
    const isexists = await Flats.findOne( {name:req.body.name,wing_id:req.body.wing_id});
    if (isexists) {
      return res.status(404).json({ message: "Flat name is allready exists " });
    }
   
    const newFlat = await flat.save();
    res.status(201).json(newFlat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateFlat = async (req, res) => {
  try {
    const flat = await Flats.findById(req.params.id);

    if (flat) {
      flat.name = req.body.name || flat.name;

      const updatedFlat = await flat.save();
      res.json(updatedFlat

      );
    } else {
      res.status(404).json({ message: "Flat not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteFlat = async (req, res) => {
  try {
    const flat = await Flats.findById(req.params.id);

    if (flat) {
      await flat.deleteOne();
      res.json({ message: "Flat deleted" });
    } else {
      res.status(404).json({ message: "Flat not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
