// lib/config/app_theme.dart
//
// Centralized Material Theme definition.
// All colors, text styles, and component themes are defined here
// to ensure consistency across the entire app.

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  AppTheme._();

  // ── Brand Colors ──────────────────────────────────────────────────────────

  /// Light app background
  static const Color backgroundDark = Color(0xFFF4F6FA);

  /// Surface background
  static const Color surfaceDark = Color(0xFFFFFFFF);

  /// Card / elevated surface
  static const Color cardDark = Color(0xFFFFFFFF);

  /// Accent orange — for NEW status badge and primary actions
  static const Color accentOrange = Color(0xFFFF6B35);

  /// Accent amber — for PREPARING status
  static const Color accentAmber = Color(0xFFFFB830);

  /// Accent green — for READY status
  static const Color accentGreen = Color(0xFF2ECC71);

  /// Muted teal — for COMPLETED status
  static const Color accentCompleted = Color(0xFF6C7A8D);

  /// Primary text color
  static const Color textPrimary = Color(0xFF0F172A);

  /// Secondary / muted text
  static const Color textSecondary = Color(0xFF64748B);

  /// Divider / border color
  static const Color divider = Color(0xFFE2E8F0);

  // ── Status Color Mapping ──────────────────────────────────────────────────

  /// Returns the color associated with each order status
  static Color statusColor(String status) {
    switch (status.toUpperCase()) {
      case 'NEW':
        return accentOrange;
      case 'PREPARING':
        return accentAmber;
      case 'READY':
        return accentGreen;
      case 'REJECTED':
        return Color(0xFFE74C3C);
      case 'COMPLETED':
        return accentCompleted;
      default:
        return textSecondary;
    }
  }

  /// Returns a lighter background tint for status badges
  static Color statusBgColor(String status) {
    return statusColor(status).withOpacity(0.12);
  }

  // ── ThemeData ─────────────────────────────────────────────────────────────

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: backgroundDark,

      // Color scheme
      colorScheme: const ColorScheme.light(
        primary: accentOrange,
        secondary: accentAmber,
        surface: surfaceDark,
        error: Color(0xFFE74C3C),
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: textPrimary,
      ),

      // Typography — using Google Fonts for a polished look
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.light().textTheme,
      ).copyWith(
        // Large header (screen titles)
        headlineLarge: GoogleFonts.inter(
          fontSize: 28,
          fontWeight: FontWeight.w700,
          color: textPrimary,
          letterSpacing: -0.5,
        ),
        // Medium header (section titles, card headers)
        headlineMedium: GoogleFonts.inter(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: textPrimary,
        ),
        // Small header
        headlineSmall: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        // Title (card customer name)
        titleLarge: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        // Body text
        bodyLarge: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: textPrimary,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w400,
          color: textSecondary,
        ),
        // Small label text
        labelSmall: GoogleFonts.inter(
          fontSize: 11,
          fontWeight: FontWeight.w500,
          color: textSecondary,
          letterSpacing: 0.5,
        ),
      ),

      // AppBar
      appBarTheme: AppBarTheme(
        backgroundColor: backgroundDark,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: textPrimary,
        ),
        iconTheme: const IconThemeData(color: textPrimary),
      ),

      // TabBar
      tabBarTheme: TabBarThemeData(
        labelColor: accentOrange,
        unselectedLabelColor: textSecondary,
        indicatorColor: accentOrange,
        indicatorSize: TabBarIndicatorSize.label,
        labelStyle: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
        ),
        unselectedLabelStyle: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w500,
        ),
      ),

      // Card
      cardTheme: CardThemeData(
        color: cardDark,
        elevation: 0.5,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: divider, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),

      // Divider
      dividerTheme: const DividerThemeData(
        color: divider,
        thickness: 1,
        space: 0,
      ),

      // SnackBar
      snackBarTheme: SnackBarThemeData(
        backgroundColor: cardDark,
        contentTextStyle: GoogleFonts.inter(color: textPrimary),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // Backward-compatible getter for old references.
  static ThemeData get darkTheme => lightTheme;
}
