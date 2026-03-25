// lib/services/socket_service.dart
//
// Manages the Socket.IO WebSocket connection to the backend.
// Emits typed callbacks when orders are created or updated,
// so the rest of the app can react to real-time events.
//
// Design notes:
// - Singleton-style: one instance shared across the app (via Provider)
// - Callbacks are set externally so this service stays decoupled from UI
// - Handles reconnection automatically via socket_io_client options

import 'dart:convert';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../config/app_config.dart';
import '../models/order_model.dart';
import '../utils/logger.dart';

/// Possible states of the socket connection
enum SocketConnectionState {
  disconnected,
  connecting,
  connected,
  reconnecting,
  error,
}

/// Callback types for socket events
typedef OrderCallback = void Function(Order order);
typedef ConnectionStateCallback = void Function(SocketConnectionState state);
typedef ErrorMessageCallback = void Function(String message);

class SocketService {
  // The underlying Socket.IO client socket
  io.Socket? _socket;

  // External callbacks — set by the OrderProvider
  OrderCallback? onOrderCreated;
  OrderCallback? onOrderUpdated;
  ConnectionStateCallback? onConnectionStateChanged;
  ErrorMessageCallback? onErrorMessage;

  // Current connection state
  SocketConnectionState _connectionState = SocketConnectionState.disconnected;
  SocketConnectionState get connectionState => _connectionState;

  bool get isConnected => _connectionState == SocketConnectionState.connected;

  // ── Connection Management ──────────────────────────────────────────────

  /// Initializes and connects the socket to the backend.
  /// Safe to call multiple times — won't create duplicate connections.
  void connect() {
    if (_socket != null && _socket!.connected) {
      log.d('[SocketService] Already connected, skipping');
      return;
    }

    log.i('[SocketService] Connecting to ${AppConfig.socketUrl}');
    _updateState(SocketConnectionState.connecting);

    // Configure the socket with transport and reconnection settings
    _socket = io.io(
      AppConfig.socketUrl,
      io.OptionBuilder()
          // On Flutter (dart:io), socket_io_client uses websocket transport.
          // Using 'polling' here leads to connect timeouts on Android.
          .setTransports(['websocket'])
          // Reconnection settings
          .enableReconnection()
          .setReconnectionAttempts(AppConfig.socketReconnectAttempts)
          .setReconnectionDelay(AppConfig.socketReconnectDelay)
          .setReconnectionDelayMax(10000) // cap at 10s
          .setPath(AppConfig.socketPath)
          // Auto-connect when initialized
          .enableAutoConnect()
          // Disable forceNew so we reuse the connection if possible
          .disableForceNew()
          // For development: allow self-signed SSL certificates
          // Remove this in production once domain is mapped
          .setExtraHeaders({'pragma': 'no-cache', 'cache-control': 'no-cache'})
          .build(),
    );

    _registerEventHandlers();
  }

  /// Disconnects the socket gracefully.
  void disconnect() {
    log.i('[SocketService] Disconnecting socket');
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
    _updateState(SocketConnectionState.disconnected);
  }

  // ── Event Registration ─────────────────────────────────────────────────

  /// Registers all socket event listeners.
  /// Called once after the socket is created.
  void _registerEventHandlers() {
    final socket = _socket;
    if (socket == null) return;

    // ── Connection lifecycle events ──

    socket.onConnect((_) {
      log.i('[SocketService] ✅ Connected! Socket ID: ${socket.id}');
      _updateState(SocketConnectionState.connected);
    });

    socket.onDisconnect((reason) {
      log.w('[SocketService] ⚡ Disconnected. Reason: $reason');
      _updateState(SocketConnectionState.disconnected);
    });

    socket.onReconnecting((attempt) {
      log.i('[SocketService] 🔄 Reconnecting... Attempt #$attempt');
      _updateState(SocketConnectionState.reconnecting);
    });

    socket.onReconnect((_) {
      log.i('[SocketService] ✅ Reconnected successfully');
      _updateState(SocketConnectionState.connected);
    });

    socket.onReconnectFailed((_) {
      log.e('[SocketService] ❌ Reconnection failed after max attempts');
      onErrorMessage?.call('Socket reconnect failed after max attempts');
      _updateState(SocketConnectionState.error);
    });

    socket.onError((error) {
      log.e('[SocketService] Socket error: $error');
      onErrorMessage?.call('Socket error: ${_stringifyError(error)}');
      _updateState(SocketConnectionState.error);
    });

    socket.onConnectError((error) {
      log.e('[SocketService] Connection error: $error');
      onErrorMessage?.call('Socket connect error: ${_stringifyError(error)}');
      _updateState(SocketConnectionState.error);
    });

    // ── Business events ──

    /// Fires when a new order is created by a customer on the website
    socket.on('new_order', (data) {
      log.i('[SocketService] 📦 new_order event received');
      _handleOrderEvent(data, isCreated: true);
    });

    /// Fires when an existing order is updated (e.g. status change)
    socket.on('order_status_updated', (data) {
      log.i('[SocketService] 🔄 order_status_updated event received');
      _handleOrderEvent(data, isCreated: false);
    });
  }

  // ── Event Parsing ──────────────────────────────────────────────────────

  /// Parses the raw socket payload into an [Order] and calls the
  /// appropriate callback. Handles multiple payload shapes gracefully.
  void _handleOrderEvent(dynamic data, {required bool isCreated}) {
    try {
      Map<String, dynamic> orderJson;

      if (data is Map<String, dynamic>) {
        // Payload might be the order directly, or wrapped in { order: {...} }
        if (data.containsKey('order') && data['order'] is Map) {
          orderJson = data['order'] as Map<String, dynamic>;
        } else if (data.containsKey('data') && data['data'] is Map) {
          orderJson = data['data'] as Map<String, dynamic>;
        } else {
          orderJson = data;
        }
      } else if (data is String) {
        // Sometimes the payload is a JSON string
        final decoded = jsonDecode(data);
        orderJson = decoded is Map<String, dynamic> ? decoded : {};
      } else {
        log.w('[SocketService] Unknown socket payload type: ${data.runtimeType}');
        return;
      }

      final order = Order.fromJson(orderJson);
      log.d('[SocketService] Parsed order: ${order.id} (${order.status.value})');

      if (isCreated) {
        onOrderCreated?.call(order);
      } else {
        onOrderUpdated?.call(order);
      }
    } catch (e, st) {
      log.e('[SocketService] Failed to parse socket event', error: e, stackTrace: st);
    }
  }

  // ── State Updates ──────────────────────────────────────────────────────

  void _updateState(SocketConnectionState newState) {
    if (_connectionState == newState) return;
    _connectionState = newState;
    onConnectionStateChanged?.call(newState);
  }

  String _stringifyError(dynamic error) {
    if (error == null) return 'unknown error';
    if (error is Map) {
      final msg = error['msg'];
      final type = error['type'];
      final desc = error['desc'];
      return 'msg=$msg, type=$type, desc=$desc';
    }
    return error.toString();
  }

  /// Cleans up resources. Call when the app is closing.
  void dispose() {
    disconnect();
    log.d('[SocketService] Disposed');
  }
}
