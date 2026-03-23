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

  /// Deep charcoal — primary background for dark surfaces
  static const Color backgroundDark = Color(0xFF111318);

  /// Slightly lighter surface for cards and panels
  static const Color surfaceDark = Color(0xFF1C2028);

  /// Card / elevated surface
  static const Color cardDark = Color(0xFF252B35);

  /// Accent orange — for NEW status badge and primary actions
  static const Color accentOrange = Color(0xFFFF6B35);

  /// Accent amber — for PREPARING status
  static const Color accentAmber = Color(0xFFFFB830);

  /// Accent green — for READY status
  static const Color accentGreen = Color(0xFF2ECC71);

  /// Muted teal — for COMPLETED status
  static const Color accentCompleted = Color(0xFF6C7A8D);

  /// Primary text color
  static const Color textPrimary = Color(0xFFEFF1F5);

  /// Secondary / muted text
  static const Color textSecondary = Color(0xFF8B95A8);

  /// Divider / border color
  static const Color divider = Color(0xFF2D3441);

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

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: backgroundDark,

      // Color scheme
      colorScheme: const ColorScheme.dark(
        primary: accentOrange,
        secondary: accentAmber,
        surface: surfaceDark,
        error: Color(0xFFE74C3C),
        onPrimary: Colors.white,
        onSecondary: Colors.black,
        onSurface: textPrimary,
      ),

      // Typography — using Google Fonts for a polished look
      textTheme: GoogleFonts.interTextTheme(
        ThemeData.dark().textTheme,
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
      tabBarTheme: TabBarTheme(
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
      cardTheme: CardTheme(
        color: cardDark,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: divider, width: 1),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
}
