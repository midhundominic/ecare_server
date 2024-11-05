const ReviewModel = require("../models/reviewModel");
const DoctorModel = require('../models/doctorModel');

const submitReview = async (req, res) => {
  try {
    const { appointmentId, doctorId } = req.params;
    const { patientId, rating, review } = req.body;

    const newReview = new ReviewModel({
      appointmentId,
      doctorId,
      patientId,
      rating,
      review
    });

    await newReview.save();

    // Update doctor's average rating
    const reviews = await ReviewModel.find({ doctorId });
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    await DoctorModel.findByIdAndUpdate(doctorId, { rating: averageRating });

    res.status(201).json({ message: "Review submitted successfully", review: newReview });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Error submitting review" });
  }
};

module.exports = {submitReview}