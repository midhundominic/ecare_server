const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;