const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");

const PatientSchema = new mongoose.Schema({
  // Basic info
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: Number, required: true },
  date_created: { type: Date, required: true, default: () => dayjs().toDate() },
  resetCode: { type: String, default: "" },
  resetCodeExpiration: { type: Date, default: Date.now },
  isDisabled: {
    type: Boolean,
    default: false,
  },

  dateOfBirth: { type: Date, required: false, default: "" },
  gender: { type: String, required: false, default: "" },
  weight: { type: String, required: false, default: "" },
  height: { type: String, required: false, default: "" },
  profilePhoto: { type: String, required: false }, // URL to the profile photo
  admissionNumber: {
    type: String,
    unique: true,
    sparse: true,
    required: false,
  }, // Unique admission number
  isProfileComplete: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
  address: { type: String, required: false, default: "" },
});

// Pre-save hook to hash password before saving
PatientSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Patient = mongoose.model("patient", PatientSchema);

module.exports = Patient;
