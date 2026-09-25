import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, default: 'General Worker' },
  hoursWorked: { type: Number, required: true },
  dailyEfficiency: { type: String, required: true }, // e.g., Excellent, Good, Average
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Worker', workerSchema);
