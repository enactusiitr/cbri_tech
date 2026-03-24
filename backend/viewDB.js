require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    // Fetch one latest order as plain object to avoid mongoose internal fields
    const singleOrder = await Order.findOne().sort({ createdAt: -1 }).lean();

    console.log('--- ONE ROW FROM DATABASE (clean) ---');
    console.log(JSON.stringify(singleOrder, null, 2));
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });