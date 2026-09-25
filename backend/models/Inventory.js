import mongoose from 'mongoose';

// Schema for inventory items
const inventorySchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  partNumber: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  supplier: {
    type: String
  },
  // track when we added this item
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
