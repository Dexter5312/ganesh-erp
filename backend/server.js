import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import inventoryRoutes from './routes/inventory.js';
import workersRoutes from './routes/workers.js';
import processLogsRoutes from './routes/processLogs.js';
import materialLogsRoutes from './routes/materialLogs.js';
import authRoutes from './routes/auth.js';
import billsRoutes from './routes/bills.js';
import usersRoutes from './routes/users.js';
import purchaseOrdersRoutes from './routes/purchaseOrders.js';

import Worker from './models/Worker.js';
import Bill from './models/Bill.js';
import PurchaseOrder from './models/PurchaseOrder.js';

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// simple test route
app.get('/', (req, res) => {
  res.send('Ganesh ERP API is running!');
});

// Use routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/process-logs', processLogsRoutes);
app.use('/api/material-logs', materialLogsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bills', billsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/purchase-orders', purchaseOrdersRoutes);

// db connection - using MongoDB Atlas
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("Missing MONGODB_URI in .env");
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas Cloud Database successfully');

    // Clean start: No demo data seeded.



    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
  }
};

startServer();
