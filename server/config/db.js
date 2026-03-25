import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`.red.bold);
    console.log(`
    👉 TROUBLESHOOTING STEPS:
    1. Is MongoDB installed? (Run 'mongod --version')
    2. Is the service running?
       - Windows: Check 'Services.msc' for MongoDB.
       - Mac: Run 'brew services list'.
    3. Try opening MongoDB Compass and connecting to:
       mongodb://127.0.0.1:27017
    `.yellow);
    process.exit(1);
  }
};

export default connectDB;