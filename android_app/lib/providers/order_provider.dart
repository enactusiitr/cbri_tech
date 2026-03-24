// lib/providers/order_provider.dart
//
// The central state manager for the entire app.
// This is the "brain" that:
//   1. Fetches all orders from the REST API on startup
//   2. Listens to socket events and updates the order list in real-time
//   3. Exposes filtered order lists for each tab (NEW, PREPARING, READY, COMPLETED)
//   4. Handles status update actions from the UI
//
// Uses ChangeNotifier so Provider can notify listening widgets automatically.

import 'package:flutter/foundation.dart';
import '../models/order_model.dart';
import '../services/api_service.dart';
import '../services/socket_service.dart';
import '../utils/logger.dart';

/// Describes the overall loading/error state of the provider
enum ProviderStatus {
  idle,
  loading,
  loaded,
  error,
}

class OrderProvider extends ChangeNotifier {
  final ApiService _apiService;
  final SocketService _socketService;

  // ── State ──────────────────────────────────────────────────────────────

  /// Master list of all orders (all statuses combined)
  List<Order> _orders = [];

  ProviderStatus _status = ProviderStatus.idle;
  String _errorMessage = '';

  // Track which order IDs are currently being updated (shows loading on card)
  final Set<String> _updatingOrderIds = {};

  // ── Getters ────────────────────────────────────────────────────────────

  List<Order> get orders => List.unmodifiable(_orders);

  ProviderStatus get status => _status;
  String get errorMessage => _errorMessage;

  bool get isLoading => _status == ProviderStatus.loading;
  bool get hasError => _status == ProviderStatus.error;

  /// Returns orders filtered by a specific status
  List<Order> ordersForStatus(OrderStatus status) {
    return _orders
        .where((order) => order.status == status)
        .toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt)); // newest first
  }

  /// Convenience getters for each tab
  List<Order> get newOrders => ordersForStatus(OrderStatus.newOrder);
  List<Order> get preparingOrders => ordersForStatus(OrderStatus.preparing);
  List<Order> get readyOrders => ordersForStatus(OrderStatus.ready);
  List<Order> get completedOrders => ordersForStatus(OrderStatus.completed);

  /// Socket connection state for the status indicator in the AppBar
  SocketConnectionState get socketState => _socketService.connectionState;

  /// Returns true if the given order ID is currently being updated via API
  bool isUpdating(String orderId) => _updatingOrderIds.contains(orderId);

  // ── Constructor ────────────────────────────────────────────────────────

  OrderProvider({
    required ApiService apiService,
    required SocketService socketService,
  })  : _apiService = apiService,
        _socketService = socketService {
    _initialize();
  }

  // ── Initialization ─────────────────────────────────────────────────────

  /// Called once on construction. Sets up socket callbacks and fetches orders.
  void _initialize() {
    log.i('[OrderProvider] Initializing...');

    // Wire socket callbacks — these run on the main isolate, so it's safe
    // to call notifyListeners() from them
    _socketService.onOrderCreated = _onOrderCreated;
    _socketService.onOrderUpdated = _onOrderUpdated;
    _socketService.onConnectionStateChanged = _onSocketStateChanged;

    // Start socket connection
    _socketService.connect();

    // Fetch initial order list from REST API
    fetchOrders();
  }

  // ── API Operations ─────────────────────────────────────────────────────

  /// Fetches all orders from the backend and replaces the local list.
  /// Called on startup and on manual refresh.
  Future<void> fetchOrders() async {
    log.i('[OrderProvider] Fetching orders from API...');
    _setStatus(ProviderStatus.loading);
    _errorMessage = '';

    try {
      final fetchedOrders = await _apiService.fetchOrders();
      _orders = fetchedOrders;
      _setStatus(ProviderStatus.loaded);
      log.i('[OrderProvider] Loaded ${_orders.length} orders');
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _setStatus(ProviderStatus.error);
      log.e('[OrderProvider] API fetch failed: ${e.message}');
    } catch (e) {
      _errorMessage = 'An unexpected error occurred. Please try again.';
      _setStatus(ProviderStatus.error);
      log.e('[OrderProvider] Unexpected error during fetch: $e');
    }
  }

  /// Updates an order's status via the REST API.
  ///
  /// [orderId]   — the ID of the order to update
  /// [newStatus] — the new [OrderStatus]
  ///
  /// Optimistically updates the UI immediately, then reverts on failure.
  Future<void> updateOrderStatus(String orderId, OrderStatus newStatus) async {
    log.i('[OrderProvider] Updating order $orderId → ${newStatus.value}');

    // Mark as updating to show loading state on the specific card
    _updatingOrderIds.add(orderId);
    notifyListeners();

    // Optimistic update — update UI immediately for a snappy feel
    final index = _orders.indexWhere((o) => o.id == orderId);
    Order? originalOrder;
    if (index != -1) {
      originalOrder = _orders[index];
      _orders[index] = originalOrder.copyWith(status: newStatus);
      notifyListeners();
    }

    try {
      // Persist the change to the backend
      final updatedOrder = await _apiService.updateOrderStatus(
        orderId,
        newStatus.value,
      );

      // Replace with the server's authoritative version
      _upsertOrder(updatedOrder);
      log.i('[OrderProvider] Order $orderId updated to ${newStatus.value}');
    } on ApiException catch (e) {
      log.e('[OrderProvider] Failed to update order: ${e.message}');
      // Revert optimistic update on failure
      if (originalOrder != null && index != -1) {
        _orders[index] = originalOrder;
      }
      _errorMessage = e.message;
      // Notify UI of the revert
      notifyListeners();
    } catch (e) {
      log.e('[OrderProvider] Unexpected update error: $e');
      if (originalOrder != null && index != -1) {
        _orders[index] = originalOrder;
      }
      notifyListeners();
    } finally {
      // Always remove the loading state for this order
      _updatingOrderIds.remove(orderId);
      notifyListeners();
    }
  }

  // ── Socket Event Handlers ──────────────────────────────────────────────

  /// Called when a new order arrives via socket
  void _onOrderCreated(Order order) {
    if (order.canteen != 'cbri inside') return;
    
    log.i('[OrderProvider] 📦 New order received: ${order.id}');
    // Only add if not already in the list (idempotent)
    if (!_orders.any((o) => o.id == order.id)) {
      _orders.insert(0, order); // Insert at top (newest first)
      notifyListeners();
    }
  }

  /// Called when an existing order is updated via socket
  void _onOrderUpdated(Order updatedOrder) {
    log.i('[OrderProvider] 🔄 Order updated via socket: ${updatedOrder.id}');
    _upsertOrder(updatedOrder);
  }

  /// Called when the socket connection state changes
  void _onSocketStateChanged(SocketConnectionState state) {
    log.d('[OrderProvider] Socket state: $state');
    // Notify UI so the connection indicator in the AppBar updates
    notifyListeners();
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  /// Inserts or replaces an order in the master list.
  /// If an order with the same ID exists, it is replaced in-place.
  /// Otherwise, the new order is prepended to the list.
  void _upsertOrder(Order order) {
    final index = _orders.indexWhere((o) => o.id == order.id);
    
    // If order is completed/rejected, remove it from list
    if (order.status == OrderStatus.completed || order.status == OrderStatus.rejected) {
      if (index != -1) {
        _orders.removeAt(index);
        notifyListeners();
      }
      return;
    }

    if (index != -1) {
      _orders[index] = order;
    } else {
      _orders.insert(0, order);
    }
    notifyListeners();
  }

  void _setStatus(ProviderStatus status) {
    _status = status;
    notifyListeners();
  }

  // ── Cleanup ────────────────────────────────────────────────────────────

  @override
  void dispose() {
    log.d('[OrderProvider] Disposing...');
    _socketService.dispose();
    _apiService.dispose();
    super.dispose();
  }
}
