require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

async function runMigration() {
  await mongoose.connect(process.env.MONGO_URI);

  const orders = await Order.find({}).sort({ createdAt: -1 });
  let updatedCount = 0;

  for (const order of orders) {
    const normalizedItems = Array.isArray(order.items)
      ? order.items.map((item) => {
          const itemName = String(item?.itemName || item?.name || 'Unknown Item').trim() || 'Unknown Item';
          const quantity = Number(item?.quantity ?? 1);
          const price = Number(item?.price ?? 0);

          return {
            itemName,
            quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
            price: Number.isFinite(price) && price >= 0 ? price : 0,
          };
        })
      : [];

    const totalAmount = normalizedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    const hasDiff =
      JSON.stringify(order.items) !== JSON.stringify(normalizedItems) ||
      order.totalAmount !== totalAmount;

    if (!hasDiff) {
      continue;
    }

    order.items = normalizedItems;
    order.totalAmount = totalAmount;
    if (!order.canteen) {
      order.canteen = 'cbri inside';
    }

    await order.save();
    updatedCount += 1;
  }

  console.log(`Migration complete. Updated ${updatedCount} order(s).`);
  await mongoose.disconnect();
}

runMigration().catch(async (err) => {
  console.error('Migration failed:', err);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
