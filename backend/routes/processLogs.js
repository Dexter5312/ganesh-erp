import express from 'express';
import ProcessLog from '../models/ProcessLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const logs = await ProcessLog.find().sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const log = new ProcessLog({
    processType: req.body.processType,
    itemName: req.body.itemName,
    quantity: req.body.quantity,
    operatorName: req.body.operatorName
  });

  try {
    const newLog = await log.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
