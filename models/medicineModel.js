const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stockQuantity: { type: Number, default: 0 },
  price: { type: Number, required: true },
  manufacturer: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medicine', medicineSchema);