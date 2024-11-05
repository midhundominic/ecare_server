const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
  resultPDF: { type: String, required: true }, // Path to stored PDF
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadDate: { type: Date, default: Date.now },
  remarks: String
});

module.exports = mongoose.model('TestResult', testResultSchema);