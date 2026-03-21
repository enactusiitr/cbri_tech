// lib/utils/logger.dart
//
// Centralized logging utility.
// Uses the `logger` package for pretty, colored console output during development.
// In production builds, you can disable logging by setting the log level.

import 'package:logger/logger.dart';

/// Global logger instance accessible throughout the app.
/// Usage:
///   log.d('Debug message');
///   log.i('Info message');
///   log.w('Warning message');
///   log.e('Error message', error: exception, stackTrace: st);
final Logger log = Logger(
  printer: PrettyPrinter(
    methodCount: 1,        // Number of method calls in stack trace
    errorMethodCount: 5,   // Stack trace depth for errors
    lineLength: 80,        // Max line width
    colors: true,          // Colorized output
    printEmojis: true,     // Emojis for log levels
    dateTimeFormat: DateTimeFormat.onlyTimeAndSinceStart,
  ),
  // Change to Level.warning or Level.nothing in production
  level: Level.debug,
);
