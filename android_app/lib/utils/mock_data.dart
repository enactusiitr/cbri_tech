// lib/utils/mock_data.dart
//
// Mock data for development and UI testing.
// Use this when you want to run the app without a live backend.
//
// HOW TO USE:
//   In lib/main.dart, replace the real ApiService and SocketService
//   with MockApiService and MockSocketService from this file.
//   (Only for development — revert before production builds.)

import '../models/order_model.dart';

/// Returns a realistic set of sample orders across all statuses.
List<Order> getMockOrders() {
  final now = DateTime.now();

  return [
    // ── NEW orders ──────────────────────────────────────────────────────
    Order(
      phoneNumber: '555-0123',
      address: 'Campus Dorm',
      id: 'ord-001',
      customerName: 'Alice Johnson',
      items: [
        const OrderItem(name: 'Margherita Pizza', quantity: 1, price: 12.99),
        const OrderItem(name: 'Garlic Bread', quantity: 2, price: 3.49),
        const OrderItem(name: 'Diet Coke', quantity: 1, price: 2.50),
      ],
      totalAmount: 22.47,
      status: OrderStatus.newOrder,
      createdAt: now.subtract(const Duration(minutes: 2)),
    ),

    Order(
      phoneNumber: '555-0123',
      address: 'Campus Dorm',
      id: 'ord-002',
      customerName: 'Bob Martinez',
      items: [
        const OrderItem(name: 'Double Cheeseburger', quantity: 2, price: 10.99),
        const OrderItem(name: 'Sweet Potato Fries', quantity: 2, price: 4.50),
        const OrderItem(name: 'Milkshake', quantity: 1, price: 5.99),
      ],
      totalAmount: 36.97,
      status: OrderStatus.newOrder,
      createdAt: now.subtract(const Duration(minutes: 5)),
    ),

    Order(
      phoneNumber: '555-0123',
      address: 'Campus Dorm',
      id: 'ord-003',
      customerName: 'Carol White',
      items: [
        const OrderItem(name: 'Caesar Salad', quantity: 1, price: 9.99),
        const OrderItem(name: 'Sparkling Water', quantity: 2, price: 2.00),
      ],
      totalAmount: 13.99,
      status: OrderStatus.newOrder,
      createdAt: now.subtract(const Duration(minutes: 8)),
    ),

    // ── PREPARING orders ─────────────────────────────────────────────────
    Order(
      phoneNumber: '555-0123',
      address: 'Campus Dorm',
      id: 'ord-004',
      customerName: 'David Kim',
      items: [
        const OrderItem(name: 'Spaghetti Bolognese', quantity: 1, price: 14.99),
        const OrderItem(name: 'House Wine', quantity: 2, price: 6.99),
        const OrderItem(name: 'Tiramisu', quantity: 1, price: 6.50),
      ],
      totalAmount: 35.47,
      status: OrderStatus.preparing,
      createdAt: now.subtract(const Duration(minutes: 15)),
    ),

    Order(
      phoneNumber: '555-0123',
      address: 'Campus Dorm',
      id: 'ord-005',
      customerName: 'Emma Thompson',
      items: [
        const OrderItem(name: 'Veggie Burger', quantity: 1, price: 11.99),
        const OrderItem(name: 'Garden Salad', quantity: 1, price: 7.50),
        const OrderItem(name: 'Lemonade', quantity: 2, price: 3.25),
      ],
      totalAmount: 25.99,
      status: OrderStatus.preparing,
      createdAt: now.subtract(const Duration(minutes: 18)),
    ),

    // ── READY orders ─────────────────────────────────────────────────────
    Order(
      phoneNumber: '555-0123',
      address: 'Campus Dorm',
      id: 'ord-006',
      customerName: 'Frank Davis',
      items: [
        const OrderItem(name: 'BBQ Ribs (Half Rack)', quantity: 1, price: 22.99),
        const OrderItem(name: 'Coleslaw', quantity: 1, price: 3.99),
        const OrderItem(name: 'Craft Beer', quantity: 2, price: 5.50),
      ],
      totalAmount: 37.98,
      status: OrderStatus.ready,
      createdAt: now.subtract(const Duration(minutes: 30)),
    ),

    // ── COMPLETED orders ─────────────────────────────────────────────────
    Order(
      phoneNumber: '555-0123',
      address: 'Campus Dorm',
      id: 'ord-007',
      customerName: 'Grace Lee',
      items: [
        const OrderItem(name: 'Fish & Chips', quantity: 2, price: 13.99),
        const OrderItem(name: 'Mushy Peas', quantity: 2, price: 2.99),
        const OrderItem(name: 'Tartar Sauce', quantity: 2, price: 1.50),
      ],
      totalAmount: 36.96,
      status: OrderStatus.completed,
      createdAt: now.subtract(const Duration(hours: 1)),
    ),

    Order(
      phoneNumber: '555-0123',
      address: 'Campus Dorm',
      id: 'ord-008',
      customerName: 'Henry Wilson',
      items: [
        const OrderItem(name: 'Club Sandwich', quantity: 1, price: 12.99),
        const OrderItem(name: 'French Fries', quantity: 1, price: 3.99),
        const OrderItem(name: 'Iced Tea', quantity: 1, price: 2.99),
      ],
      totalAmount: 19.97,
      status: OrderStatus.completed,
      createdAt: now.subtract(const Duration(hours: 2)),
    ),
  ];
}
