// lib/services/api_service.dart
//
// Handles all HTTP communication with the backend REST API.
// Uses the `http` package for making requests.
// All methods return typed results and throw descriptive exceptions on failure.

import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http/io_client.dart';
import '../config/app_config.dart';
import '../models/order_model.dart';
import '../utils/logger.dart';

/// Custom exception for API errors — carries a human-readable message
class ApiException implements Exception {
  final String message;
  final int? statusCode;

  const ApiException(this.message, {this.statusCode});

  @override
  String toString() => 'ApiException($statusCode): $message';
}

class ApiService {
  // Shared HTTP client — reusing a single client is more efficient
  // than creating one per request (connection pooling)
  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? _createDefaultClient();

  static http.Client _createDefaultClient() {
    try {
      final backendUri = Uri.parse(AppConfig.backendUrl);
      final backendHost = backendUri.host;

      final ioHttpClient = HttpClient()
        ..badCertificateCallback = (X509Certificate cert, String host, int port) {
          // Allow cert mismatch only for configured backend host (IP/domain).
          // This is required while using HTTPS with an IP and a domain cert.
          if (host == backendHost) {
            log.w('[ApiService] Accepting certificate for $host:$port');
            return true;
          }
          return false;
        };

      return IOClient(ioHttpClient);
    } catch (e) {
      log.w('[ApiService] Falling back to default HTTP client: $e');
      return http.Client();
    }
  }

  // ── Default headers sent with every request ────────────────────────────

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  // ── GET /api/orders ────────────────────────────────────────────────────

  /// Fetches all orders from the backend.
  /// Returns a list of [Order] objects sorted by createdAt descending.
  Future<List<Order>> fetchOrders() async {
    // Append the canteen query parameter so we only get relevant orders
    final baseUri = Uri.parse(AppConfig.ordersEndpoint);
    final url = baseUri.replace(
      queryParameters: {
        ...baseUri.queryParameters,
        'canteen': AppConfig.canteenId,
      },
    );
    
    log.i('[ApiService] GET $url');

    try {
      final response = await _client
          .get(url, headers: _headers)
          .timeout(AppConfig.httpTimeout);

      log.d('[ApiService] Response ${response.statusCode}: ${response.body.length} bytes');

      if (response.statusCode == 200) {
        final dynamic decoded = jsonDecode(response.body);

        // Handle both array response and { data: [...] } wrapper
        List<dynamic> rawList;
        if (decoded is List) {
          rawList = decoded;
        } else if (decoded is Map && decoded['data'] is List) {
          rawList = decoded['data'] as List;
        } else if (decoded is Map && decoded['orders'] is List) {
          rawList = decoded['orders'] as List;
        } else {
          log.w('[ApiService] Unexpected response format');
          return [];
        }

        final orders = rawList
            .whereType<Map<String, dynamic>>()
            .map((json) {
              try {
                return Order.fromJson(json);
              } catch (e) {
                log.e('[ApiService] Failed to parse order', error: e);
                return null;
              }
            })
            .whereType<Order>() // filters out nulls
            .toList();

        // Sort by creation time — newest first
        orders.sort((a, b) => b.createdAt.compareTo(a.createdAt));

        log.i('[ApiService] Fetched ${orders.length} orders');
        return orders;
      } else {
        throw ApiException(
          'Failed to fetch orders: ${response.reasonPhrase}',
          statusCode: response.statusCode,
        );
      }
    } on SocketException {
      throw const ApiException('No internet connection. Check your network.');
    } on HttpException catch (e) {
      throw ApiException('HTTP error: ${e.message}');
    } on FormatException catch (e) {
      throw ApiException('Invalid response format: ${e.message}');
    } on ApiException {
      rethrow; // Don't wrap our own exceptions
    } catch (e) {
      throw ApiException('Unexpected error: $e');
    }
  }

  // ── PATCH /api/orders/:id ──────────────────────────────────────────────

  /// Updates an order's status on the backend.
  ///
  /// [orderId] — the ID of the order to update
  /// [newStatus] — the new status value (e.g. 'PREPARING')
  /// [estimatedTimeMinutes] — ETA in minutes to include when status is accepted
  ///
  /// Returns the updated [Order] as returned by the server.
  Future<Order> updateOrderStatus(
    String orderId,
    String newStatus, {
    int? estimatedTimeMinutes,
  }) async {
    final url = Uri.parse('${AppConfig.ordersEndpoint}/$orderId/status');
    final statusForBackend = _mapStatusForBackend(newStatus);
    final payload = <String, dynamic>{'status': statusForBackend};
    if (statusForBackend == 'accepted') {
      payload['estimatedTime'] = estimatedTimeMinutes ?? 30;
    }
    final body = jsonEncode(payload);

    log.i('[ApiService] PUT $url → payload: $payload');

    try {
      final response = await _client
          .put(url, headers: _headers, body: body)
          .timeout(AppConfig.httpTimeout);

      log.d('[ApiService] Response ${response.statusCode}');

      if (response.statusCode == 200) {
        final dynamic decoded = jsonDecode(response.body);

        // Handle both direct object and { data: {...} } wrapper
        Map<String, dynamic> orderJson;
        if (decoded is Map<String, dynamic>) {
          if (decoded.containsKey('data') && decoded['data'] is Map) {
            orderJson = decoded['data'] as Map<String, dynamic>;
          } else if (decoded.containsKey('order') && decoded['order'] is Map) {
            orderJson = decoded['order'] as Map<String, dynamic>;
          } else {
            orderJson = decoded;
          }
          return Order.fromJson(orderJson);
        } else {
          throw const ApiException('Unexpected response format from PATCH');
        }
      } else {
        throw ApiException(
          'Failed to update order: ${response.reasonPhrase}',
          statusCode: response.statusCode,
        );
      }
    } on SocketException {
      throw const ApiException('No internet connection. Check your network.');
    } on ApiException {
      rethrow;
    } catch (e) {
      throw ApiException('Unexpected error while updating order: $e');
    }
  }

  /// Disposes the HTTP client when the service is no longer needed.
  void dispose() {
    _client.close();
    log.d('[ApiService] HTTP client disposed');
  }

  String _mapStatusForBackend(String appStatus) {
    switch (appStatus.toUpperCase()) {
      case 'NEW':
        return 'pending';
      case 'PREPARING':
        return 'accepted';
      case 'REJECTED':
        return 'rejected';
      case 'COMPLETED':
        return 'completed';
      default:
        return appStatus.toLowerCase();
    }
  }
}
