const Tenant = require("../models/Tenant");
const multer = require("multer");


// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory where files will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name for simplicity
  },
});

const upload = multer({ storage: storage });

exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllRentReceivedTenants = async (req, res) => {
  try {
    const tenantRentReceived = await Tenant.find({ rent_status: "paid" });
    res.json({ noOfFlatsRentReceived: tenantRentReceived.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getAllRentPendingTenants = async (req, res) => {
  try {
    const tenantRentPending = await Tenant.find({ rent_status: "pending" });
    res.json({ noOfFlatsRentPending: tenantRentPending.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTenantByFlatId = async (req, res) => {
  try {
    const tenant_by_flat_id = await Tenant.find({ flat_id: req.params.id });
    if (tenant_by_flat_id) {
      res.json(tenant_by_flat_id);
    } else {
      res.status(404).json({ message: "Flat not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTenant = async (req, res) => {
  const {
    name,
    ph_no,
    emailId,
    age,
    maintaince,
    final_rent,
    deposit,
    current_meter_reading,
    rent_form_date,
    permanant_address,
    previous_address,
    nature_of_work,
    working_address,
    work_ph_no,
    family_members,
    male_members,
    female_members,
    childs,
    family_member_names,
    reference_person1,
    reference_person2,
    reference_person1_age,
    reference_person2_age,
    agent_name,
    flat_id,
    rent_status,
  } = req.body;

  // Process uploaded files
  const tenantPhoto = req.file ? req.file.path : null;
  const adharFrontPhoto = req.file ? req.file.path : null;const Tenant = require("../models/Tenant");
  const multer = require("multer");

  // Set up multer storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Directory where files will be uploaded
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use original file name for simplicity
    },
  });

  const upload = multer({ storage: storage });

  exports.getAllTenants = async (req, res) => {
    try {
      const tenants = await Tenant.find();
      res.json(tenants);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.getAllRentReceivedTenants = async (req, res) => {
    try {
      const tenantRentReceived = await Tenant.find({ rent_status: "paid" });
      res.json({ noOfFlatsRentReceived: tenantRentReceived.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  };

  exports.getAllRentPendingTenants = async (req, res) => {
    try {
      const tenantRentPending = await Tenant.find({ rent_status: "pending" });
      res.json({ noOfFlatsRentPending: tenantRentPending.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  };

  exports.getTenantById = async (req, res) => {
    try {
      const tenant = await Tenant.findById(req.params.id);
      if (tenant) {
        res.json(tenant);
      } else {
        res.status(404).json({ message: "Tenant not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.getTenantByFlatId = async (req, res) => {
    try {
      const tenant_by_flat_id = await Tenant.find({ flat_id: req.params.id });
      if (tenant_by_flat_id) {
        res.json(tenant_by_flat_id);
      } else {
        res.status(404).json({ message: "Flat not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  exports.createTenant = async (req, res) => {
    const {
      name,
      ph_no,
      emailId,
      age,
      maintaince,
      final_rent,
      deposit,
      current_meter_reading,
      rent_form_date,
      permanant_address,
      previous_address,
      nature_of_work,
      working_address,
      work_ph_no,
      family_members,
      male_members,
      female_members,
      childs,
      family_member_names,
      reference_person1,
      reference_person2,
      reference_person1_age,
      reference_person2_age,
      agent_name,
      flat_id,
      rent_status,
    } = req.body;

    // Process uploaded files
    const tenantPhoto = req.file ? req.file.path : null;
    const adharFrontPhoto = req.file ? req.file.path : null;
    const adharBackPhoto = req.file ? req.file.path : null;
    const pancardPhoto = req.file ? req.file.path : null;

    const tenant = new Tenant({
      name,
      ph_no,
      emailId,
      age,
      maintaince,
      final_rent,
      deposit,
      current_meter_reading,
      rent_form_date,
      permanant_address,
      previous_address,
      nature_of_work,
      working_address,
      work_ph_no,
      family_members,
      male_members,
      female_members,
      childs,
      family_member_names,
      reference_person1,
      reference_person2,
      reference_person1_age,
      reference_person2_age,
      agent_name,
      flat_id,
      rent_status,
      tenant_photo: tenantPhoto,
      adhar_front_photo: adharFrontPhoto,
      adhar_back_photo: adharBackPhoto,
      pancard_photo: pancardPhoto,
      // Assign other image paths or references accordingly
    });

    try {
      const newTenant = await tenant.save();
      res.status(201).json(newTenant);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  exports.updateTenant = async (req, res) => {
    try {
      const tenant = await Tenant.findById(req.params.id);

      if (tenant) {
        tenant.name = req.body.name || tenant.name;
        tenant.ph_no = req.body.ph_no || tenant.ph_no;
        tenant.emailId = req.body.emailId || tenant.emailId;
        tenant.age = req.body.age || tenant.age;
        tenant.maintaince = req.body.maintaince || tenant.maintaince;
        tenant.final_rent = req.body.final_rent || tenant.final_rent;
        tenant.deposit = req.body.deposit || tenant.deposit;
        tenant.current_meter_reading =
          req.body.current_meter_reading || tenant.current_meter_reading;
        tenant.rent_form_date =
          req.body.rent_form_date || tenant.rent_form_date;
        tenant.permanant_address =
          req.body.permanant_address || tenant.permanant_address;
        tenant.previous_address =
          req.body.previous_address || tenant.previous_address;
        tenant.nature_of_work =
          req.body.nature_of_work || tenant.nature_of_work;
        tenant.working_address =
          req.body.working_address || tenant.working_address;
        tenant.work_ph_no = req.body.work_ph_no || tenant.work_ph_no;
        tenant.family_members =
          req.body.family_members || tenant.family_members;
        tenant.male_members = req.body.male_members || tenant.male_members;
        tenant.female_members =
          req.body.female_members || tenant.female_members;
        tenant.childs = req.body.childs || tenant.childs;
        tenant.family_member_names =
          req.body.family_member_names || tenant.family_member_names;
        tenant.reference_person1 =
          req.body.reference_person1 || tenant.reference_person1;
        tenant.reference_person2 =
          req.body.reference_person2 || tenant.reference_person2;
        tenant.reference_person1_age =
          req.body.reference_person1_age || tenant.reference_person1_age;
        tenant.reference_person2_age =
          req.body.reference_person2_age || tenant.reference_person2_age;
        tenant.agent_name = req.body.agent_name || tenant.agent_name;
        tenant.flat_id = req.body.flat_id || tenant.flat_id;
        tenant.rent_status = req.body.rent_status || tenant.rent_status;

        const updatedTenant = await tenant.save();
        res.json(updatedTenant);
      } else {
        res.status(404).json({ message: "Tenant not found" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  exports.deleteTenant = async (req, res) => {
    try {
      const tenant = await Tenant.findById(req.params.id);

      if (tenant) {
        await tenant.deleteOne();
        res.json({ message: "Tenant deleted" });
      } else {
        res.status(404).json({ message: "Tenant not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  const adharBackPhoto = req.file ? req.file.path : null;
  const pancardPhoto = req.file ? req.file.path : null;
  // Example, adjust as per your file structure
  // Similar for other images (adhar_back_photo, tenant_photo, pan_card_photo)

  const tenant = new Tenant({
    name,
    ph_no,
    emailId,
    age,
    maintaince,
    final_rent,
    deposit,
    current_meter_reading,
    rent_form_date,
    permanant_address,
    previous_address,
    nature_of_work,
    working_address,
    work_ph_no,
    family_members,
    male_members,
    female_members,
    childs,
    family_member_names,
    reference_person1,
    reference_person2,
    reference_person1_age,
    reference_person2_age,
    agent_name,
    flat_id,
    rent_status,
    tenant_photo: tenantPhoto,
    adhar_front_photo: adharFrontPhoto,
    adhar_back_photo: adharBackPhoto,
    pancard_photo: pancardPhoto,
    // Assign other image paths or references accordingly
  });

  try {
    const newTenant = await tenant.save();
    res.status(201).json(newTenant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      tenant.name = req.body.name || tenant.name;
      tenant.ph_no = req.body.ph_no || tenant.ph_no;
      tenant.emailId = req.body.emailId || tenant.emailId;
      tenant.age = req.body.age || tenant.age;
      tenant.maintaince = req.body.maintaince || tenant.maintaince;
      tenant.final_rent = req.body.final_rent || tenant.final_rent;
      tenant.deposit = req.body.deposit || tenant.deposit;
      tenant.current_meter_reading =
        req.body.current_meter_reading || tenant.current_meter_reading;
      tenant.rent_form_date = req.body.rent_form_date || tenant.rent_form_date;
      tenant.permanant_address =
        req.body.permanant_address || tenant.permanant_address;
      tenant.previous_address =
        req.body.previous_address || tenant.previous_address;
      tenant.nature_of_work = req.body.nature_of_work || tenant.nature_of_work;
      tenant.working_address =
        req.body.working_address || tenant.working_address;
      tenant.work_ph_no = req.body.work_ph_no || tenant.work_ph_no;
      tenant.family_members = req.body.family_members || tenant.family_members;
      tenant.male_members = req.body.male_members || tenant.male_members;
      tenant.female_members = req.body.female_members || tenant.female_members;
      tenant.childs = req.body.childs || tenant.childs;
      tenant.family_member_names =
        req.body.family_member_names || tenant.family_member_names;
      tenant.reference_person1 =
        req.body.reference_person1 || tenant.reference_person1;
      tenant.reference_person2 =
        req.body.reference_person2 || tenant.reference_person2;
      tenant.reference_person1_age =
        req.body.reference_person1_age || tenant.reference_person1_age;
      tenant.reference_person2_age =
        req.body.reference_person2_age || tenant.reference_person2_age;
      tenant.agent_name = req.body.agent_name || tenant.agent_name;
      tenant.flat_id = req.body.flat_id || tenant.flat_id;
      tenant.rent_status - req.body.rent_status || tenant.rent_status;

      const updatedTenant = await tenant.save();
      res.json(updatedTenant);
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      await tenant.deleteOne();
      res.json({ message: "Tenant deleted" });
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
