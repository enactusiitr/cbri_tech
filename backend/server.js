require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const Order = require('./models/Order');

const app = express();
const server = http.createServer(app);

// Setup Socket.IO for real-time app updates (Android Shopkeeper App)
const io = new Server(server, {
  cors: {
    origin: "*", // Make sure to restrict this in production
    methods: ["GET", "POST", "PUT"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('Shopkeeper app connected via WebSocket:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Shopkeeper app disconnected:', socket.id);
  });
});

// ---------------- API ROUTES ----------------

// 1. FRONTEND: Submit a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { name, phoneNumber, address, items } = req.body;
    
    // Save to MongoDB
    const newOrder = new Order({ name, phoneNumber, address, items });
    const savedOrder = await newOrder.save();
    
    // INSTANTLY NOTIFY ANDROID APP: Emit the new order event
    io.emit('new_order', savedOrder);
    
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 2. ANDROID APP: Get all pending/active orders on startup
app.get('/api/orders', async (req, res) => {
  try {
    // Only return orders that are 'pending' or 'accepted' to keep the app clean
    const orders = await Order.find({ status: { $in: ['pending', 'accepted'] } }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 3. ANDROID APP: Update order status (Accept/Reject/Done)
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Optional: Broadcase update so if multiple shopkeepers have the app open, it syncs
    io.emit('order_status_updated', updatedOrder);
    
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
