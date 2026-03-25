import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route Definitions
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import { fileURLToPath } from 'url';

// Initialize Environment Variables
dotenv.config();

// Establish Database Connection
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
/**
 * MIDDLEWARE PROTOCOL
 */
app.use(cors());
app.use(express.json());

/**
 * API GATEWAYS
 */
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

/**
 * STATIC ASSET CONFIGURATION
 */
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('Akshaya API Terminal: Online and Operational.');
  });
}

/**
 * GLOBAL ERROR SHIELD
 */
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ 
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SERVER] Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});