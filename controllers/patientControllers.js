const PatientModel = require("../models/patientModel");
const PatientPersonaModel = require("../models/patientPersonalModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Properly format the private key
  }),
});

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await PatientModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new PatientModel({
      name,
      email,
      password, // Password will be hashed in the pre-save hook
      role: 1,
    });

    // Save the user
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      data: { name: newUser.name, email: newUser.email, role: newUser.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const authWithGoogle = async (req, res) => {
  const { tokenId } = req.body; // Expect the Firebase ID token from the frontend

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const { name, email } = decodedToken; // Extract user info from the decoded token

    // Check if the user exists in the database
    let user = await PatientModel.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new one
      user = new PatientModel({
        name,
        email,
        password: "", // No password for Google users
        role: 1, // Assuming Google users are patients (role = 1)
      });

      await user.save();
    }

    // Generate JWT token for your app
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User login successful!",
      data: {
        email: user.email,
        name: user.name,
        role: user.role,
        userId: user._id,
      },
      token,
    });
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    return res
      .status(500)
      .json({ message: "Invalid or expired Firebase token" });
  }
};

const getAllPatient = async (req, res) => {
  try {
    const patients = await PatientModel.find(
      {},
      {
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        date_created: 1,
        dateOfBirth: 1,
        gender: 1,
        weight: 1,
        height: 1,
        admissionNumber: 1,
        isDisabled:1,
      }
    );

    res.status(201).json({ data: patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deletePatientById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the patient in the Patient schema
    const patient = await PatientModel.findByIdAndDelete(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Delete the associated personal information using the patient's email
    // const personalInfo = await PatientPersonaModel.findOneAndDelete({
    //   email: patient.email,
    // });

    return res.status(201).json({
      message: "Patient deleted successfully",
      patient,
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  authWithGoogle,
  getAllPatient,
  deletePatientById,
};
