import express from 'express';
import MaterialLog from '../models/MaterialLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const logs = await MaterialLog.find().sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const log = new MaterialLog({
    itemName: req.body.itemName,
    type: req.body.type,
    quantity: req.body.quantity,
    notes: req.body.notes
  });

  try {
    const newLog = await log.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
