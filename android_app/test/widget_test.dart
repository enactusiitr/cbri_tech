// test/widget_test.dart
//
// Basic smoke test — verifies the app can start and render
// the DashboardScreen without crashing.
//
// To run: flutter test

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:restaurant_dashboard/config/app_theme.dart';
import 'package:restaurant_dashboard/models/order_model.dart';
import 'package:restaurant_dashboard/providers/order_provider.dart';
import 'package:restaurant_dashboard/screens/dashboard_screen.dart';
import 'package:restaurant_dashboard/services/api_service.dart';
import 'package:restaurant_dashboard/services/socket_service.dart';

// ── Fake implementations for testing ──────────────────────────────────────

/// A mock ApiService that returns sample data instantly (no network call)
class MockApiService extends ApiService {
  @override
  Future<List<Order>> fetchOrders() async {
    return [
      Order(
        phoneNumber: '123', address: 'Test',
        id: 'test-001',
        customerName: 'Alice Johnson',
        items: [
          const OrderItem(name: 'Margherita Pizza', quantity: 1, price: 12.99),
          const OrderItem(name: 'Coke', quantity: 2, price: 2.49),
        ],
        totalAmount: 17.97,
        status: OrderStatus.newOrder,
        createdAt: DateTime.now(),
      ),
      Order(
        phoneNumber: '123', address: 'Test',
        id: 'test-002',
        customerName: 'Bob Smith',
        items: [
          const OrderItem(name: 'Veggie Burger', quantity: 2, price: 9.99),
        ],
        totalAmount: 19.98,
        status: OrderStatus.preparing,
        createdAt: DateTime.now().subtract(const Duration(minutes: 5)),
      ),
    ];
  }

  @override
  Future<Order> updateOrderStatus(
    String orderId,
    String newStatus, {
    int? estimatedTimeMinutes,
  }) async {
    return Order(
        phoneNumber: '123', address: 'Test',
      id: orderId,
      customerName: 'Test Customer',
      items: [],
      totalAmount: 0,
      status: OrderStatus.fromString(newStatus),
      createdAt: DateTime.now(),
    );
  }
}

/// A mock SocketService that does nothing (no real connection)
class MockSocketService extends SocketService {
  @override
  void connect() {
    // No-op: don't actually connect during tests
  }

  @override
  void disconnect() {
    // No-op
  }
}

// ── Test helper ────────────────────────────────────────────────────────────

Widget buildTestApp() {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider<OrderProvider>(
        create: (_) => OrderProvider(
          apiService: MockApiService(),
          socketService: MockSocketService(),
        ),
      ),
    ],
    child: MaterialApp(
      theme: AppTheme.darkTheme,
      home: const DashboardScreen(),
    ),
  );
}

// ── Tests ──────────────────────────────────────────────────────────────────

void main() {
  group('DashboardScreen', () {
    testWidgets('renders without crashing', (WidgetTester tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump(); // First frame

      // The app should not throw
      expect(find.byType(DashboardScreen), findsOneWidget);
    });

    testWidgets('shows TabBar with expected tabs', (WidgetTester tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump();

      expect(find.byType(TabBar), findsOneWidget);
      expect(find.text('NEW'), findsWidgets);
      expect(find.text('PREPARING'), findsWidgets);
    });

    testWidgets('shows app title', (WidgetTester tester) async {
      await tester.pumpWidget(buildTestApp());
      await tester.pump();

      expect(find.text('Zakaaz Shopkeeper'), findsOneWidget);
    });
  });

  group('OrderModel', () {
    test('parses order from JSON correctly', () {
      final json = {
        'id': 'abc123',
        'customerName': 'Test Customer',
        'items': [
          {'name': 'Burger', 'quantity': 2, 'price': 8.99},
        ],
        'totalAmount': 17.98,
        'status': 'PREPARING',
        'createdAt': '2024-01-15T12:30:00Z',
      };

      final order = Order.fromJson(json);

      expect(order.id, 'abc123');
      expect(order.customerName, 'Test Customer');
      expect(order.items.length, 1);
      expect(order.items[0].name, 'Burger');
      expect(order.items[0].quantity, 2);
      expect(order.status, OrderStatus.preparing);
      expect(order.totalAmount, 17.98);
    });

    test('OrderStatus.fromString handles all statuses', () {
      expect(OrderStatus.fromString('NEW'), OrderStatus.newOrder);
      expect(OrderStatus.fromString('PREPARING'), OrderStatus.preparing);
      expect(OrderStatus.fromString('READY'), OrderStatus.ready);
      expect(OrderStatus.fromString('COMPLETED'), OrderStatus.completed);
      expect(OrderStatus.fromString('UNKNOWN'), OrderStatus.newOrder); // default
    });

    test('copyWith creates updated order', () {
      final original = Order(
        phoneNumber: '123', address: 'Test',
        id: '1',
        customerName: 'Alice',
        items: [],
        totalAmount: 10.0,
        status: OrderStatus.newOrder,
        createdAt: DateTime.now(),
      );

      final updated = original.copyWith(status: OrderStatus.preparing);

      expect(updated.id, '1');
      expect(updated.customerName, 'Alice');
      expect(updated.status, OrderStatus.preparing);
    });

    test('Order equality is based on id', () {
      final now = DateTime.now();
      final a = Order(
        phoneNumber: '123', address: 'Test',
        id: 'same-id',
        customerName: 'Alice',
        items: [],
        totalAmount: 10.0,
        status: OrderStatus.newOrder,
        createdAt: now,
      );
      final b = Order(
        phoneNumber: '123', address: 'Test',
        id: 'same-id',
        customerName: 'Bob', // different name
        items: [],
        totalAmount: 99.0,
        status: OrderStatus.completed,
        createdAt: now,
      );

      expect(a == b, true); // Same ID → equal
    });
  });
}
