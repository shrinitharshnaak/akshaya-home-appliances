import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Fix for ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server/.env') });

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI not found in server/.env');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Define a simple schema to read products
    const productSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    
    const products = await Product.find({}).limit(10);
    console.log('--- PRODUCTS ---');
    products.forEach(p => {
      console.log(`ID: ${p._id} | Name: ${p.name?.slice(0, 20)} | Image: ${p.image}`);
    });
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB();
