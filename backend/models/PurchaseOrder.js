import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  materialName: { type: String, required: true },
  quantity: { type: Number, required: true },
  expectedDelivery: { type: Date, required: true },
  totalCost: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Received'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
