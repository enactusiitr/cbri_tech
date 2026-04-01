// lib/config/app_config.dart
//
// Centralized configuration for the app.
// All URLs and environment-specific values live here.
// In production, load values from the .env file via flutter_dotenv.

import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  AppConfig._(); // Prevent instantiation — pure static utility class

  static String _trimTrailingSlash(String value) =>
      value.endsWith('/') ? value.substring(0, value.length - 1) : value;

  static String _ensureLeadingSlash(String value) =>
      value.startsWith('/') ? value : '/$value';

  /// The base URL of your Node.js backend.
  /// Reads from the BACKEND_URL key in the .env file.
  /// Falls back to localhost for local development.
  static String get backendUrl =>
      _trimTrailingSlash(dotenv.env['BACKEND_URL'] ?? 'http://localhost:3000');

  /// Parsed backend URI helper.
  static Uri get backendUri => Uri.parse(backendUrl);

  /// Backend host used for selective TLS bypass in development.
  static String get backendHost => backendUri.host;

  /// The REST API base path
  ///
  /// Resolution behavior:
  /// - If API_BASE_PATH is provided, it is used as-is.
  /// - If backend URL already ends with /api or /<name>-api, use no extra path.
  /// - Otherwise default to /api.
  static String get apiBasePath {
    final configured = (dotenv.env['API_BASE_PATH'] ?? '').trim();
    if (configured.isNotEmpty) {
      if (configured == '/') return '';
      return _ensureLeadingSlash(_trimTrailingSlash(configured));
    }

    final segments = backendUri.path.split('/').where((s) => s.isNotEmpty).toList();
    final last = segments.isEmpty ? '' : segments.last.toLowerCase();
    final pathLooksApiScoped = last == 'api' || last.endsWith('-api');
    return pathLooksApiScoped ? '' : '/api';
  }

  /// Full base URL for REST API calls (e.g. https://your-backend.com/api)
  static String get apiBaseUrl => '$backendUrl$apiBasePath';

  /// Full URL for the orders endpoint
  static String get ordersEndpoint => '$apiBaseUrl/orders';

  /// Socket.IO server URL (same as the backend base URL but without path)
  static String get socketUrl {
    final uri = backendUri;
    return '${uri.scheme}://${uri.host}${uri.hasPort ? ':${uri.port}' : ''}';
  }

  /// Socket.IO path (can be overridden via SOCKET_PATH in .env).
  /// Defaults to '/socket.io/' which matches the current backend setup.
  static String get socketPath {
    final raw = dotenv.env['SOCKET_PATH'] ?? '/socket.io/';
    if (raw.isEmpty) return '/socket.io/';

    final withLeadingSlash = raw.startsWith('/') ? raw : '/$raw';
    return withLeadingSlash.endsWith('/')
        ? withLeadingSlash
        : '$withLeadingSlash/';
  }

  /// Allows temporary certificate bypass when backend is accessed by IP over
  /// HTTPS and cert CN/SAN points to a domain instead.
  static bool get allowBadCertificates =>
      (dotenv.env['ALLOW_BAD_CERTIFICATES'] ?? 'true').toLowerCase() == 'true';

  /// Socket.IO reconnection attempts before giving up
  static const int socketReconnectAttempts = 5;

  /// Delay between reconnection attempts (milliseconds)
  static const int socketReconnectDelay = 2000;

  /// HTTP request timeout duration
  static const Duration httpTimeout = Duration(seconds: 15);

  /// Canteen ID string to determine which orders to show in this app build.
  /// Set using `--dart-define=CANTEEN_ID="cbri inside"` or via .env
  static String get canteenId =>
      const String.fromEnvironment('CANTEEN_ID', defaultValue: 'cbri inside');
}
