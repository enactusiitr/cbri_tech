// lib/config/app_config.dart
//
// Centralized configuration for the app.
// All URLs and environment-specific values live here.
// In production, load values from the .env file via flutter_dotenv.

import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConfig {
  AppConfig._(); // Prevent instantiation — pure static utility class

  /// The base URL of your Node.js backend.
  /// Reads from the BACKEND_URL key in the .env file.
  /// Falls back to localhost for local development.
  static String get backendUrl =>
      dotenv.env['BACKEND_URL'] ?? 'http://localhost:3000';

  /// The REST API base path
  static String get apiBasePath =>
      dotenv.env['API_BASE_PATH'] ?? '/api';

  /// Full base URL for REST API calls (e.g. https://your-backend.com/api)
  static String get apiBaseUrl => '$backendUrl$apiBasePath';

  /// Full URL for the orders endpoint
  static String get ordersEndpoint => '$apiBaseUrl/orders';

  /// Socket.IO server URL (same as the backend base URL)
  static String get socketUrl => backendUrl;

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
