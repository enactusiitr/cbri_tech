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
    const customer = req.body?.customer ?? {};
    const name = req.body?.name ?? customer?.name;
    const phoneNumber = req.body?.phoneNumber ?? customer?.phoneNumber;
    const address = req.body?.address ?? customer?.address;
    const canteen = req.body?.canteen ?? customer?.canteen;
    const items = req.body?.items;

    // Normalize item shape from frontend and guard against malformed payloads.
    const normalizedItems = Array.isArray(items)
      ? items
          .map((item) => {
            const itemName =
              item?.itemName ??
              item?.name ??
              item?.menuItem?.name ??
              'Item';

            const rawQuantity = Number(item?.quantity ?? 1);
            const rawPrice = Number(item?.price ?? item?.menuItem?.price ?? 0);
            const imageUrl =
              item?.imageUrl ??
              item?.image ??
              item?.menuItem?.image ??
              '';

            const quantity =
              Number.isFinite(rawQuantity) && rawQuantity > 0 ? rawQuantity : 1;
            const price = Number.isFinite(rawPrice) && rawPrice >= 0 ? rawPrice : 0;

            return {
              itemName: String(itemName).trim() || 'Item',
              quantity,
              price,
              imageUrl: String(imageUrl),
            };
          })
      : [];

    if (
      !String(name || '').trim() ||
      !String(phoneNumber || '').trim() ||
      !String(address || '').trim() ||
      normalizedItems.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order payload. Name, phone, address and at least one item are required.',
      });
    }

    const totalAmount = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // Save normalized order to MongoDB
    const newOrder = new Order({
      name: String(name).trim(),
      phoneNumber: String(phoneNumber).trim(),
      address: String(address).trim(),
      canteen: canteen || 'cbri inside',
      items: normalizedItems,
      totalAmount,
    });
    const savedOrder = await newOrder.save();
    
    console.log(`\n================================`);
    console.log(`🎉 NEW ORDER RECEIVED! 🎉`);
    console.log(`Customer: ${name}`);
    console.log(`Phone: ${phoneNumber}`);
    console.log(`Address: ${address}`);
    console.log(`Items: ${normalizedItems.length} item(s)`);
    console.log(`Total: Rs.${totalAmount.toFixed(2)}`);
    console.log(`================================\n`);
    
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
    // Hardcoded for 'cbri inside' canteen as requested
    const orders = await Order.find({ 
      status: { $in: ['pending', 'accepted'] },
      canteen: 'cbri inside'
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// 3. ANDROID APP: Update order status (Accept/Reject/Done)
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    // If marked as 'completed' or 'rejected', delete it from DB as requested
    if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'rejected') {
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);
      if (!deletedOrder) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      
      // Also broadcast so other apps remove it
      io.emit('order_status_updated', { _id: deletedOrder._id, status: status.toUpperCase() });
      return res.json({ success: true, order: { _id: deletedOrder._id, status: status.toUpperCase() } });
    }

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
