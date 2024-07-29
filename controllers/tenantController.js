// controllers/tenantController.js
const Tenant = require("../models/Tenant");
const Flats = require("../models/Flat");
const fs = require("fs");
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
    res.json(tenantRentReceived);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getAllRentPendingTenants = async (req, res) => {
  try {
    const tenantRentPending = await Tenant.find({ rent_status: "pending" });
    res.json(tenantRentPending);
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
    const tenant_by_flat_id = await Tenant.findOne({ flat_id: req.params.id, active:true });
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
  const files = req.files;
  try {
    const {
      name,
      ph_no,
      emailId,
      age,
      gender,
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

    // console.log(files);
    if (
      !files ||
      !files.tenant_photo ||
      !files.adhar_front ||
      !files.adhar_back ||
      !files.pan_photo ||
      !files.electricity_bill
    ) {
      return res.status(400).json({ message: "All file fields are required." });
    }

    const tenant = new Tenant({
      name,
      ph_no,
      emailId,
      age,
      gender,
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
      rent_status,
      name,
      flat_id: req.params.id,
      tenant_photo: files.tenant_photo[0].path,
      adhar_front: files.adhar_front[0].path,
      adhar_back: files.adhar_back[0].path,
      pan_photo: files.pan_photo[0].path,
      electricity_bill: files.electricity_bill[0].path,
    });

    const newTenant = await tenant.save();
    const flat = await Flats.findById(req.params.id);

    flat.flat_status = "allotted";
    const updatedFlat = await flat.save();

    res.status(201).json(newTenant);
  } catch (err) {
    Object.values(files).forEach((fileArray) => {
      fileArray.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error(`Error deleting file: ${file.path}`);
        });
      });
    });
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
      tenant.gender = req.body.gender || tenant.gender;
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

// Example implementation in tenantController.js
exports.getTenantsWithRentPending = async (req, res) => {
  try {
    const tenants = await Tenant.find({ rent_status: "pending" });
    res.json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getTenantsWithRentReceived = async (req, res) => {
  try {
    const tenants = await Tenant.find({ rent_status: "paid" });
    res.json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getActiveTenants = async (req, res) => {
  console.log("Hii");
  try {
    const activeTenants = await Tenant.find({ tenant_status: "Active" });
    res.json(activeTenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Deactivate Tenant
exports.deactivateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      tenant.active = false; // Assuming `active` field is used to track tenant status
      const updatedTenant = await tenant.save();
      res.json({ message: "Tenant deactivated", tenant: updatedTenant });
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.activateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      tenant.active = true; // Assuming `active` field is used to track tenant status
      const updatedTenant = await tenant.save();
      res.json({ message: "Tenant activated", tenant: updatedTenant });
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markRentAsPaid = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (tenant) {
      tenant.rentPaid = true; // Assuming `rentPaid` field is used to track rent payment status
      const updatedTenant = await tenant.save();
      res.json({ message: "Rent marked as paid", tenant: updatedTenant });
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deactiveTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (tenant) {
      tenant.status = "Deactivated"; // or tenant.active = false;
      const updatedTenant = await tenant.save();
      res.json({ message: "Tenant deactivated", tenant: updatedTenant });
    } else {
      res.status(404).json({ message: "Tenant not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
