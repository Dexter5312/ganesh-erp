import mongoose from 'mongoose';

const materialLogSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['IN', 'OUT'] // IN = Purchases, OUT = Sent to processes
  },
  quantity: { type: Number, required: true },
  notes: { type: String },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('MaterialLog', materialLogSchema);
