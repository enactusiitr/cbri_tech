// lib/models/order_model.dart
//
// Defines the core data structures for the restaurant order system.
// OrderItem represents a single menu item in an order.
// Order represents a complete customer order with all its items and metadata.

/// Represents a single item within an order (e.g. "2x Burger")
class OrderItem {
  final String name;
  final int quantity;
  final double price;

  const OrderItem({
    required this.name,
    required this.quantity,
    required this.price,
  });

  /// Creates an OrderItem from a JSON map (from API or socket payload)
  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      name: json['name'] as String? ?? 'Unknown Item',
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
    );
  }

  /// Converts this OrderItem to a JSON map (for API calls)
  Map<String, dynamic> toJson() => {
        'name': name,
        'quantity': quantity,
        'price': price,
      };

  @override
  String toString() => 'OrderItem(name: $name, qty: $quantity, price: $price)';
}

/// Enum representing all possible order statuses.
/// These match exactly the status strings used by the backend.
enum OrderStatus {
  newOrder('NEW'),
  preparing('PREPARING'),
  ready('READY'),
  completed('COMPLETED');

  /// The string value as stored/sent by the backend
  final String value;
  const OrderStatus(this.value);

  /// Parses a backend string into an OrderStatus enum value.
  /// Defaults to [OrderStatus.newOrder] if unrecognized.
  static OrderStatus fromString(String status) {
    return OrderStatus.values.firstWhere(
      (e) => e.value == status.toUpperCase(),
      orElse: () => OrderStatus.newOrder,
    );
  }
}

/// Represents a complete customer order.
class Order {
  final String id;
  final String customerName;
  final List<OrderItem> items;
  final double totalAmount;
  final OrderStatus status;
  final DateTime createdAt;

  const Order({
    required this.id,
    required this.customerName,
    required this.items,
    required this.totalAmount,
    required this.status,
    required this.createdAt,
  });

  /// Creates an Order from a JSON map received from the API or socket
  factory Order.fromJson(Map<String, dynamic> json) {
    // Parse items array safely
    final rawItems = json['items'];
    final List<OrderItem> items = rawItems is List
        ? rawItems
            .whereType<Map<String, dynamic>>()
            .map((item) => OrderItem.fromJson(item))
            .toList()
        : [];

    // Parse the createdAt timestamp — accept both ISO strings and epoch ints
    DateTime createdAt;
    final rawDate = json['createdAt'];
    if (rawDate is String) {
      createdAt = DateTime.tryParse(rawDate) ?? DateTime.now();
    } else if (rawDate is int) {
      createdAt = DateTime.fromMillisecondsSinceEpoch(rawDate);
    } else {
      createdAt = DateTime.now();
    }

    return Order(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? '',
      customerName: json['customerName'] as String? ?? 'Unknown Customer',
      items: items,
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0.0,
      status: OrderStatus.fromString(json['status'] as String? ?? 'NEW'),
      createdAt: createdAt,
    );
  }

  /// Converts this Order to a JSON map
  Map<String, dynamic> toJson() => {
        'id': id,
        'customerName': customerName,
        'items': items.map((i) => i.toJson()).toList(),
        'totalAmount': totalAmount,
        'status': status.value,
        'createdAt': createdAt.toIso8601String(),
      };

  /// Returns a copy of this order with updated fields.
  /// Useful for state immutability when updating an order's status.
  Order copyWith({
    String? id,
    String? customerName,
    List<OrderItem>? items,
    double? totalAmount,
    OrderStatus? status,
    DateTime? createdAt,
  }) {
    return Order(
      id: id ?? this.id,
      customerName: customerName ?? this.customerName,
      items: items ?? this.items,
      totalAmount: totalAmount ?? this.totalAmount,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  String toString() =>
      'Order(id: $id, customer: $customerName, status: ${status.value})';

  @override
  bool operator ==(Object other) =>
      identical(this, other) || (other is Order && other.id == id);

  @override
  int get hashCode => id.hashCode;
}
