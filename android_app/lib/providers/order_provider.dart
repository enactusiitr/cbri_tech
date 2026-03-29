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
import 'dart:async';
import 'package:audioplayers/audioplayers.dart';
import '../config/app_config.dart';
import '../models/order_model.dart';
import '../services/api_service.dart';
import '../services/notification_service.dart';
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
  String _lastTechnicalError = '';
  final List<String> _debugLogs = [];

  // Track which order IDs are currently being updated (shows loading on card)
  final Set<String> _updatingOrderIds = {};
  final List<AudioPlayer> _activeBellPlayers = [];
  final Set<String> _ringingOrderIds = {};
  final Map<String, Order> _ringingOrdersById = {};
  final Map<String, int> _ringTickCountByOrderId = {};
  Timer? _bellLoopTimer;
  Timer? _fallbackPollTimer;
  bool _hasCompletedInitialFetch = false;

  // ── Getters ────────────────────────────────────────────────────────────

  List<Order> get orders => List.unmodifiable(_orders);

  ProviderStatus get status => _status;
  String get errorMessage => _errorMessage;
  String get lastTechnicalError => _lastTechnicalError;
  List<String> get debugLogs => List.unmodifiable(_debugLogs);

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
    _pushLog('Initializing provider for canteen: ${AppConfig.canteenId}');

    // Wire socket callbacks — these run on the main isolate, so it's safe
    // to call notifyListeners() from them
    _socketService.onOrderCreated = _onOrderCreated;
    _socketService.onOrderUpdated = _onOrderUpdated;
    _socketService.onConnectionStateChanged = _onSocketStateChanged;
    _socketService.onErrorMessage = _onSocketErrorMessage;

    // Start socket connection
    _socketService.connect();

    // Fetch initial order list from REST API
    fetchOrders();

    // Fallback polling ensures alerts still work if socket events are missed.
    _startFallbackPolling();
  }

  // ── API Operations ─────────────────────────────────────────────────────

  /// Fetches all orders from the backend and replaces the local list.
  /// Called on startup and on manual refresh.
  Future<void> fetchOrders() async {
    log.i('[OrderProvider] Fetching orders from API...');
    _pushLog('API fetch started');
    _setStatus(ProviderStatus.loading);
    _errorMessage = '';

    try {
      final fetchedOrders = await _apiService.fetchOrders();
      _applyFetchedOrders(fetchedOrders);
      _setStatus(ProviderStatus.loaded);
      log.i('[OrderProvider] Loaded ${_orders.length} orders');
      _pushLog('API fetch success: ${_orders.length} orders');
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _lastTechnicalError = e.toString();
      _setStatus(ProviderStatus.error);
      log.e('[OrderProvider] API fetch failed: ${e.message}');
      _pushLog('API fetch failed: ${e.message}');
    } catch (e) {
      _errorMessage = 'Unexpected error: $e';
      _lastTechnicalError = e.toString();
      _setStatus(ProviderStatus.error);
      log.e('[OrderProvider] Unexpected error during fetch: $e');
      _pushLog('Unexpected fetch error: $e');
    }
  }

  /// Updates an order's status via the REST API.
  ///
  /// [orderId]   — the ID of the order to update
  /// [newStatus] — the new [OrderStatus]
  ///
  /// Optimistically updates the UI immediately, then reverts on failure.
  Future<void> updateOrderStatus(String orderId, OrderStatus newStatus, {int? estimatedTime}) async {
    log.i('[OrderProvider] Updating order $orderId → ${newStatus.value}');
    _pushLog('Update order $orderId -> ${newStatus.value}');

    if (newStatus != OrderStatus.newOrder) {
      _stopAlertForOrder(orderId);
    }

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
        estimatedTime: estimatedTime,
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
      _lastTechnicalError = e.toString();
      _pushLog('Order update failed: ${e.message}');
      // Notify UI of the revert
      notifyListeners();
    } catch (e) {
      log.e('[OrderProvider] Unexpected update error: $e');
      _lastTechnicalError = e.toString();
      _pushLog('Unexpected update error: $e');
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
    if (order.canteen != AppConfig.canteenId) return;
    
    log.i('[OrderProvider] 📦 New order received: ${order.id}');
    // Only add if not already in the list (idempotent)
    if (!_orders.any((o) => o.id == order.id)) {
      _orders.insert(0, order); // Insert at top (newest first)
      _startAlertForOrder(order);
      _pushLog('Socket new order: ${order.id}');
      notifyListeners();
    }
  }

  /// Called when an existing order is updated via socket
  void _onOrderUpdated(Order updatedOrder) {
    if (updatedOrder.canteen != AppConfig.canteenId && 
        updatedOrder.status != OrderStatus.rejected && 
        updatedOrder.status != OrderStatus.completed) {
      return; 
    }
    
    log.i('[OrderProvider] 🔄 Order updated via socket: ${updatedOrder.id}');
    _pushLog('Socket order updated: ${updatedOrder.id} -> ${updatedOrder.status.value}');
    _upsertOrder(updatedOrder);

    if (updatedOrder.status != OrderStatus.newOrder) {
      _stopAlertForOrder(updatedOrder.id);
    }
  }

  /// Called when the socket connection state changes
  void _onSocketStateChanged(SocketConnectionState state) {
    log.d('[OrderProvider] Socket state: $state');
    _pushLog('Socket state: $state');
    // Notify UI so the connection indicator in the AppBar updates
    notifyListeners();
  }

  void _onSocketErrorMessage(String message) {
    _lastTechnicalError = message;
    _pushLog(message);
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
      _stopAlertForOrder(order.id);
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

  void _applyFetchedOrders(List<Order> fetchedOrders) {
    final previousById = {for (final o in _orders) o.id: o};

    if (_hasCompletedInitialFetch) {
      for (final order in fetchedOrders) {
        final wasKnown = previousById.containsKey(order.id);
        if (!wasKnown && order.status == OrderStatus.newOrder) {
          _startAlertForOrder(order);
        }
      }
    }

    _orders = fetchedOrders;
    _hasCompletedInitialFetch = true;

    final activeFetchedNewIds = fetchedOrders
        .where((o) => o.status == OrderStatus.newOrder)
        .map((o) => o.id)
        .toSet();

    final ringingSnapshot = List<String>.from(_ringingOrderIds);
    for (final ringingId in ringingSnapshot) {
      if (!activeFetchedNewIds.contains(ringingId)) {
        _stopAlertForOrder(ringingId);
      }
    }
  }

  void _startFallbackPolling() {
    _fallbackPollTimer?.cancel();
    _fallbackPollTimer = Timer.periodic(const Duration(seconds: 8), (_) {
      unawaited(_syncOrdersSilently());
    });
  }

  Future<void> _syncOrdersSilently() async {
    try {
      final fetchedOrders = await _apiService.fetchOrders();
      _applyFetchedOrders(fetchedOrders);
      notifyListeners();
    } catch (_) {
      // Ignore transient polling failures; socket and manual refresh remain active.
    }
  }

  void _setStatus(ProviderStatus status) {
    _status = status;
    notifyListeners();
  }

  Future<void> _playNewOrderSound() async {
    final player = AudioPlayer();
    try {
      await player.setReleaseMode(ReleaseMode.stop);
      await player.setPlayerMode(PlayerMode.lowLatency);
      await player.setAudioContext(
        AudioContext(
          android: AudioContextAndroid(
            contentType: AndroidContentType.sonification,
            usageType: AndroidUsageType.notificationRingtone,
            audioFocus: AndroidAudioFocus.gainTransientMayDuck,
          ),
        ),
      );

      _activeBellPlayers.add(player);

      player.play(AssetSource('bell.wav'), volume: 1.0).then((_) {
        log.i('[OrderProvider] bell.wav played');
        _pushLog('Played bell.wav for new order');
      }).catchError((error) {
        log.e('[OrderProvider] bell.wav playback failed: $error');
        _lastTechnicalError = 'Bell playback failed: $error';
        _pushLog(_lastTechnicalError);
        notifyListeners();
      });

      Future<void>.delayed(const Duration(seconds: 2), () async {
        await player.dispose();
        _activeBellPlayers.remove(player);
      });
    } catch (error) {
      log.e('[OrderProvider] bell.wav playback failed: $error');
      _lastTechnicalError = 'Bell playback failed: $error';
      _pushLog(_lastTechnicalError);
      notifyListeners();
      await player.dispose();
      _activeBellPlayers.remove(player);
    }
  }

  void _startAlertForOrder(Order order) {
    _ringingOrderIds.add(order.id);
    _ringingOrdersById[order.id] = order;
    _ringTickCountByOrderId.putIfAbsent(order.id, () => 0);
    _ensureBellLoopRunning();
    unawaited(_playNewOrderSound());
    unawaited(NotificationService.instance.showNewOrderNotification(order));
  }

  void _stopAlertForOrder(String orderId) {
    if (_ringingOrderIds.remove(orderId)) {
      _ringingOrdersById.remove(orderId);
      _ringTickCountByOrderId.remove(orderId);
      _pushLog('Stopped bell for order: $orderId');
      unawaited(NotificationService.instance.cancelOrderNotification(orderId));
    }

    if (_ringingOrderIds.isEmpty) {
      _bellLoopTimer?.cancel();
      _bellLoopTimer = null;
      final players = List<AudioPlayer>.from(_activeBellPlayers);
      _activeBellPlayers.clear();
      for (final player in players) {
        unawaited(player.stop());
        unawaited(player.dispose());
      }
    }
  }

  void _ensureBellLoopRunning() {
    if (_bellLoopTimer != null) return;

    _bellLoopTimer = Timer.periodic(const Duration(seconds: 3), (_) {
      if (_ringingOrderIds.isEmpty) {
        _bellLoopTimer?.cancel();
        _bellLoopTimer = null;
        return;
      }
      _pushLog('Bell loop tick for ${_ringingOrderIds.length} active order(s)');
      unawaited(_playNewOrderSound());

      for (final entry in _ringingOrdersById.entries) {
        final orderId = entry.key;
        final order = entry.value;
        final nextTick = (_ringTickCountByOrderId[orderId] ?? 0) + 1;
        _ringTickCountByOrderId[orderId] = nextTick;
        unawaited(
          NotificationService.instance.showNewOrderNotification(
            order,
            ringTick: nextTick,
          ),
        );
      }
    });
  }

  void _pushLog(String message) {
    final timestamp = DateTime.now().toIso8601String();
    _debugLogs.insert(0, '[$timestamp] $message');
    if (_debugLogs.length > 80) {
      _debugLogs.removeLast();
    }
  }

  // ── Cleanup ────────────────────────────────────────────────────────────

  @override
  void dispose() {
    log.d('[OrderProvider] Disposing...');
    _bellLoopTimer?.cancel();
    _fallbackPollTimer?.cancel();
    _ringingOrderIds.clear();
    _ringingOrdersById.clear();
    _ringTickCountByOrderId.clear();
    final players = List<AudioPlayer>.from(_activeBellPlayers);
    _activeBellPlayers.clear();
    for (final player in players) {
      unawaited(player.dispose());
    }
    _socketService.dispose();
    _apiService.dispose();
    super.dispose();
  }
}
