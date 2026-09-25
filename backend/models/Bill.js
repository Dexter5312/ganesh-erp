import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  clientCompanyName: {
    type: String,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  baseAmount: {
    type: Number,
    required: true
  },
  cgst: {
    type: Number,
    default: 0
  },
  sgst: {
    type: Number,
    default: 0
  },
  igst: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  destinationState: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
