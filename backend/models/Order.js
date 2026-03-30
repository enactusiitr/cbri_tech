const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  canteen: { type: String, default: 'cbri inside' },
  items: [{
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: '' }
  }],
  totalAmount: { type: Number, required: true, min: 0, default: 0 },
  estimatedTime: { type: Number, min: 1 },
  estimatedDeliveryTime: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
