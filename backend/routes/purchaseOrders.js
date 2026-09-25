import express from 'express';
import PurchaseOrder from '../models/PurchaseOrder.js';

const router = express.Router();

// GET all purchase orders
router.get('/', async (req, res) => {
  try {
    const pos = await PurchaseOrder.find().sort({ createdAt: -1 });
    res.json(pos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new purchase order
router.post('/', async (req, res) => {
  const { supplierName, materialName, quantity, expectedDelivery, totalCost } = req.body;
  try {
    const newPO = new PurchaseOrder({ supplierName, materialName, quantity, expectedDelivery, totalCost });
    const savedPO = await newPO.save();
    res.status(201).json(savedPO);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT to update status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Received'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const updatedPO = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedPO) {
      return res.status(404).json({ message: 'Purchase Order not found' });
    }
    res.json(updatedPO);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
