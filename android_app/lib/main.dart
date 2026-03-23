// lib/main.dart
//
// App entry point.
// Sets up:
//   1. Environment variables (flutter_dotenv)
//   2. The Provider dependency injection tree
//   3. The MaterialApp with the dark theme
//   4. The root DashboardScreen

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';

import 'config/app_theme.dart';
import 'providers/order_provider.dart';
import 'screens/dashboard_screen.dart';
import 'services/api_service.dart';
import 'services/socket_service.dart';
import 'utils/logger.dart';

Future<void> main() async {
  // Ensure Flutter bindings are initialized before any async work
  WidgetsFlutterBinding.ensureInitialized();

  // Lock orientation to portrait on phones, allow landscape on tablets
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);

  // Load .env file (contains BACKEND_URL, etc.)
  // If the file is missing, the app falls back to default values in AppConfig
  try {
    await dotenv.load(fileName: '.env');
    log.i('[main] .env loaded successfully');
  } catch (e) {
    log.w('[main] Could not load .env file: $e — using default config');
  }

  log.i('[main] Starting Restaurant Dashboard...');

  runApp(const RestaurantDashboardApp());
}

class RestaurantDashboardApp extends StatelessWidget {
  const RestaurantDashboardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // ChangeNotifierProvider creates the OrderProvider and makes it
        // available to all descendant widgets via context.watch / context.read
        ChangeNotifierProvider<OrderProvider>(
          // lazy: false means the provider is created immediately
          // (not on first access) — important so socket connection starts ASAP
          lazy: false,
          create: (_) => OrderProvider(
            apiService: ApiService(),
            socketService: SocketService(),
          ),
        ),
      ],
      child: MaterialApp(
        title: 'Restaurant Dashboard',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const DashboardScreen(),

        // Builder wraps the Navigator so we can show SnackBars from the provider
        // using a global ScaffoldMessenger (optional pattern)
        builder: (context, child) {
          return MediaQuery(
            // Prevent text scaling from breaking the layout
            data: MediaQuery.of(context).copyWith(
              textScaler: const TextScaler.linear(1.0),
            ),
            child: child!,
          );
        },
      ),
    );
  }
}
