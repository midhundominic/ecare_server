const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // For password hashing (optional but recommended)
const PatientModel = require("../models/patientModel");
const DoctorModel = require("../models/doctorModel");
const CoordinatorModel = require("../models/coordinatorModel");

// Replace with your own secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || "midhun12345";

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check in Patient collection
    const patient = await PatientModel.findOne({ email });
    if (patient) {
      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
      if (patient.isDisabled) {
        return res.status(403).json({ message: "Your account is blocked. Please contact the administrator." });
      }

      const token = jwt.sign(
        { userId: patient._id, email: patient.email, role: patient.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(201).json({
        message: "Login Successful",
        data: {
          email: patient.email,
          role: patient.role,
          name: patient.name,
          userId: patient._id,
        },
        token:token,
      });
    }

    // Check in Doctor collection
    const doctor = await DoctorModel.findOne({ email });
    if (doctor) {
      if (doctor.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
      if (doctor.isDisabled) {
        return res.status(403).json({ message: "Your account is blocked. Please contact the administrator." });
      }

      const token = jwt.sign(
        { userId: doctor._id, email: doctor.email, role: doctor.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(201).json({
        message: "Login Successful",
        data: {
          email: doctor.email,
          role: doctor.role,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          doctorId: doctor._id,
        },
        token:token,
      });
    }

    // Check in Coordinator collection
    const coordinator = await CoordinatorModel.findOne({ email });
    if (coordinator) {
      if (coordinator.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
      if (coordinator.isDisabled) {
        return res.status(403).json({ message: "Your account is blocked. Please contact the administrator." });
      }

      const token = jwt.sign(
        {
          userId: coordinator._id,
          email: coordinator.email,
          role: coordinator.role,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(201).json({
        message: "Login Successful",
        data: {
          coordinatorId: coordinator._id,
          email: coordinator.email,
          role: coordinator.role,
          firstName: coordinator.firstName,
          lastName: coordinator.lastName,
        },
        token:token,
      });
    }

    // If no user found
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signin };
