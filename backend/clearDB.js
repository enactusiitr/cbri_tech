require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

async function clearDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');
    
    // Clear all documents in the Order collection
    const result = await Order.deleteMany({});
    console.log(`Database cleared successfully! Deleted ${result.deletedCount} orders.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDB();