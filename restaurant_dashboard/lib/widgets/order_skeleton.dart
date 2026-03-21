// lib/widgets/order_skeleton.dart
//
// Displays animated shimmer skeleton cards while orders are loading.
// Provides a polished loading experience instead of a plain spinner.

import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../config/app_theme.dart';

class OrderSkeleton extends StatelessWidget {
  /// Number of skeleton cards to show
  final int count;

  const OrderSkeleton({super.key, this.count = 4});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: count,
      itemBuilder: (context, index) => const _SkeletonCard(),
    );
  }
}

class _SkeletonCard extends StatelessWidget {
  const _SkeletonCard();

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppTheme.cardDark,
      highlightColor: AppTheme.surfaceDark,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.cardDark,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header row
            Row(
              children: [
                _box(width: 40, height: 40, radius: 10),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _box(width: 140, height: 14, radius: 6),
                      const SizedBox(height: 6),
                      _box(width: 90, height: 12, radius: 6),
                    ],
                  ),
                ),
                _box(width: 50, height: 32, radius: 6),
              ],
            ),
            const SizedBox(height: 16),
            _box(width: double.infinity, height: 1, radius: 0),
            const SizedBox(height: 16),

            // Items
            _box(width: 60, height: 11, radius: 4),
            const SizedBox(height: 10),
            _itemRow(),
            const SizedBox(height: 8),
            _itemRow(),
            const SizedBox(height: 8),
            _itemRow(),
            const SizedBox(height: 16),
            _box(width: double.infinity, height: 1, radius: 0),
            const SizedBox(height: 16),

            // Footer
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _box(width: 40, height: 10, radius: 4),
                    const SizedBox(height: 6),
                    _box(width: 70, height: 18, radius: 6),
                  ],
                ),
                _box(width: 100, height: 40, radius: 10),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _itemRow() {
    return Row(
      children: [
        _box(width: 30, height: 22, radius: 5),
        const SizedBox(width: 10),
        Expanded(child: _box(width: double.infinity, height: 13, radius: 4)),
        const SizedBox(width: 10),
        _box(width: 45, height: 13, radius: 4),
      ],
    );
  }

  Widget _box({
    required double width,
    required double height,
    required double radius,
  }) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}
