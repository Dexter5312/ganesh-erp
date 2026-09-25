import express from 'express';
import Worker from '../models/Worker.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find().sort({ date: -1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const worker = new Worker({
    name: req.body.name,
    hoursWorked: req.body.hoursWorked,
    dailyEfficiency: req.body.dailyEfficiency
  });

  try {
    const newWorker = await worker.save();
    res.status(201).json(newWorker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
