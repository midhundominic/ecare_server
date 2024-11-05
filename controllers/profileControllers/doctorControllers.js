const DoctorModel = require("../../models/doctorModel");
const upload = require("../../middleware/upload");
const fs = require("fs");
const path = require("path");

const getDoctorProfile = async (req, res) => {
  const email = req.user.email;
  try {
    const doctor = await DoctorModel.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(201).json({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone,
      gender: doctor.gender,
      profilePhoto: doctor.profilePhoto || "", // Return profile photo path
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const uploadDoctorProfilePhoto = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err || "File upload failed" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { email } = req.body;
    try {
      const doctor = await DoctorModel.findOne({ email });
      if (!doctor) {
        return res.status(400).json({ message: "Doctor not found" });
      }

      if (doctor.profilePhoto) {
        const oldPhotoPath = doctor.profilePhoto
        
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }

      // Save the new profile photo path
      doctor.profilePhoto = req.file.filename;
      await doctor.save();

      res.status(201).json({
        message: "Profile photo uploaded successfully",
        profilePhoto: doctor.profilePhoto,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });
};

module.exports = { getDoctorProfile, uploadDoctorProfilePhoto };
