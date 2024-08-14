const mongoose = require("mongoose");

const tenantsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ph_no: { type: String, required: true },
    emailId: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    maintaince: { type: Number, required: true },
    final_rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    current_meter_reading: { type: Number, required: true },
    rent_form_date: { type: Date, required: true },
    permanant_address: { type: String, required: true },
    previous_address: { type: String, required: true },
    nature_of_work: { type: String, required: true },
    working_address: { type: String, required: true },
    work_ph_no: { type: String, required: true },
    family_members: { type: Number, required: true },
    male_members: { type: Number, required: true },
    female_members: { type: Number, required: true },
    childs: { type: Number, required: true },
    family_member_names: { type: String, required: true },
    reference_person1: { type: String, required: true },
    reference_person2: { type: String, required: true },
    reference_person1_age: { type: Number, required: true },
    reference_person2_age: { type: Number, required: true },
    agent_name: { type: String, required: true },
    flat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flats",
      required: true,
    },
    rent_status: { type: String, required: true },
    tenant_photo: { type: String },
    adhar_front: { type: String },
    adhar_back: { type: String },
    pan_photo: { type: String },
    electricity_bill: { type: String },
    active: { type: Boolean, default: true }, // New field
    rentPaid: { type: Boolean, default: false }, 
    
    // current_meter_reading: { type: Number }, // Optional field
    // fixed_light_bill: { type: Number }, // Optional field
    // total_light_bill: { type: Number, required: false },
    // fixed_meter_reading: { type: Number, required: false },
  },
  {
    collection: "Tenants",
  }
);

module.exports = mongoose.model("Tenant", tenantsSchema);
