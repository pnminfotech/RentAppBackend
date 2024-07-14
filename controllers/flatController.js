const Flats = require("../models/Flat");

exports.getAllFlats = async (req, res) => {
  try {
    const flats = await Flats.find();
    res.json(flats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCountFlats = async (req, res) => {
  try {
    const flats = await Flats.find();
    res.json({ totalFlats: flats.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getRentedFlats = async (req, res) => {
  try {
    const flatsOnRent = await Flats.find({ flat_status: "occupied" });
    res.json(flatsOnRent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getVaccantFlats = async (req, res) => {
  try {
    const vaccantFlats = await Flats.find({ flat_status: "vaccant" });
    res.json(vaccantFlats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getAllottedFlats = async (req, res) => {
  try {
    const allottedFlats = await Flats.find({ flat_status: "allotted" });
    res.json(allottedFlats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
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

exports.getFlatsByWingsId = async (req, res) => {
  console.log("Hii");
  try {
    const flats_by_wing_id = await Flats.find({ wing_id: req.params.id });
    console.log(flats_by_wing_id);
    if (flats_by_wing_id) {
      res.json(flats_by_wing_id);
    } else {
      res.status(404).json({ message: "Flat not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFlatByWingId = async (req, res) => {
  const flat = new Flats({
    name: req.body.name,
    wing_id: req.params.id,
    flat_type: req.body.flat_type,
    flat_status: "vaccant",
  });
  try {
    const isexists = await Flats.findOne({
      name: req.body.name,
      wing_id: req.params.id,
    });
    if (isexists) {
      return res.status(404).json({ message: "Flat name is already exists" });
    }
    console.log(flat);
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
      flat.flat_type = req.body.flat_type || flat.flat_type;

      const updatedFlat = await flat.save();
      res.json(updatedFlat);
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

exports.getFlatsByType = async (req, res) => {
  try {
    const flats = await Flats.find({ flat_type: req.params.type });
    res.json(flats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
