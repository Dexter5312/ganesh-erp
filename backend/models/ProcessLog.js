import mongoose from 'mongoose';

const processLogSchema = new mongoose.Schema({
  processType: { 
    type: String, 
    required: true,
    enum: ['Cold Forging', 'Thread Rolling', 'Machining', 'Heat Treatment']
  },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  operatorName: { type: String },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('ProcessLog', processLogSchema);
