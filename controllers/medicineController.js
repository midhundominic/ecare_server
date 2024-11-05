const Medicine = require('../models/medicineModel');

exports.addMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMedicinesList = async (req, res) => {
  try {
    const medicines = await Medicine.find().select('name stockQuantity price');
    res.status(201).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMedicineStock = async (req, res) => {
  try {
    const { medicineId } = req.params;  // Changed from const id = req.params
    const { stockQuantity } = req.body;
    
    const medicine = await Medicine.findByIdAndUpdate(
      medicineId,  // Use medicineId directly
      { stockQuantity },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const { medicineId } = req.params;
    
    const medicine = await Medicine.findByIdAndDelete(medicineId);
    
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(201).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};