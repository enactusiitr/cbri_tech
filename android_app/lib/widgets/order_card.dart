// lib/widgets/order_card.dart
//
// A self-contained widget that renders a single order.
// Shows customer name, creation time, items list, total, and an action button.
// Reads update state from the provider to show a loading indicator on the button.

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../config/app_theme.dart';
import '../models/order_model.dart';
import '../providers/order_provider.dart';

class OrderCard extends StatelessWidget {
  final Order order;

  const OrderCard({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    // We only watch the updating state for THIS specific order,
    // avoiding unnecessary rebuilds for all other cards.
    final isUpdating = context.select<OrderProvider, bool>(
      (p) => p.isUpdating(order.id),
    );

    return Card(
      // Use the order ID as key so Flutter can efficiently reorder cards
      // when orders move between tabs
      key: ValueKey(order.id),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(context),
            const SizedBox(height: 12),
            _buildDivider(),
            const SizedBox(height: 12),
            _buildItemsList(context),
            const SizedBox(height: 12),
            _buildDivider(),
            const SizedBox(height: 12),
            _buildFooter(context, isUpdating),
          ],
        ),
      ),
    );
  }

  // ── Header: customer name + status badge + time ──────────────────────

  Widget _buildHeader(BuildContext context) {
    final theme = Theme.of(context);
    final formattedTime = DateFormat('HH:mm').format(order.createdAt);
    final formattedDate = DateFormat('MMM d').format(order.createdAt);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Order ID circle avatar
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppTheme.statusBgColor(order.status.value),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Center(
            child: Text(
              '#',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: AppTheme.statusColor(order.status.value),
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),

        // Customer name + order ID
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                order.customerName,
                style: theme.textTheme.titleLarge,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              Text(
                'ID: ${_shortId(order.id)}',
                style: theme.textTheme.bodyMedium,
              ),
            ],
          ),
        ),

        // Time column on the right
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              formattedTime,
              style: theme.textTheme.bodyLarge?.copyWith(
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
            Text(
              formattedDate,
              style: theme.textTheme.bodyMedium,
            ),
          ],
        ),
      ],
    );
  }

  // ── Items list ─────────────────────────────────────────────────────────

  Widget _buildItemsList(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'ITEMS',
          style: theme.textTheme.labelSmall?.copyWith(
            letterSpacing: 1.2,
            color: AppTheme.textSecondary,
          ),
        ),
        const SizedBox(height: 8),
        // Render each item in the order
        ...order.items.map((item) => _buildOrderItemRow(context, item)),
      ],
    );
  }

  Widget _buildOrderItemRow(BuildContext context, OrderItem item) {
    final theme = Theme.of(context);
    final itemTotal = item.price * item.quantity;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          // Quantity badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
            decoration: BoxDecoration(
              color: AppTheme.divider,
              borderRadius: BorderRadius.circular(5),
            ),
            child: Text(
              '×${item.quantity}',
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
                fontSize: 12,
              ),
            ),
          ),
          const SizedBox(width: 10),

          // Item name (takes remaining space)
          Expanded(
            child: Text(
              item.name,
              style: theme.textTheme.bodyLarge,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),

          // Item subtotal
          Text(
            '\$${itemTotal.toStringAsFixed(2)}',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // ── Footer: total amount + action button ───────────────────────────────

  Widget _buildFooter(BuildContext context, bool isUpdating) {
    final theme = Theme.of(context);
    final actionConfig = _getActionConfig(order.status);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Total amount
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'TOTAL',
              style: theme.textTheme.labelSmall?.copyWith(letterSpacing: 1.2),
            ),
            const SizedBox(height: 2),
            Text(
              '\$${order.totalAmount.toStringAsFixed(2)}',
              style: theme.textTheme.headlineSmall?.copyWith(
                color: AppTheme.textPrimary,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),

        // Action button (or null if COMPLETED)
        if (actionConfig != null)
          _buildActionButton(context, actionConfig, isUpdating),
      ],
    );
  }

  Widget _buildActionButton(
    BuildContext context,
    _ActionConfig config,
    bool isUpdating,
  ) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 200),
      child: isUpdating
          // Show a loading spinner while the API call is in flight
          ? Container(
              key: const ValueKey('loading'),
              width: 100,
              height: 40,
              decoration: BoxDecoration(
                color: config.color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: config.color,
                  ),
                ),
              ),
            )
          : ElevatedButton(
              key: const ValueKey('button'),
              onPressed: () => _onActionPressed(context, config.nextStatus),
              style: ElevatedButton.styleFrom(
                backgroundColor: config.color,
                foregroundColor: Colors.white,
                elevation: 0,
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                config.label,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),
              ),
            ),
    );
  }

  /// Dispatches the status update action to the provider
  void _onActionPressed(BuildContext context, OrderStatus nextStatus) {
    context.read<OrderProvider>().updateOrderStatus(order.id, nextStatus);
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  Widget _buildDivider() {
    return const Divider(height: 1);
  }

  /// Returns a short version of the order ID for display (last 8 chars)
  String _shortId(String id) {
    if (id.length <= 8) return id;
    return '...${id.substring(id.length - 8)}';
  }

  /// Maps each order status to its action button configuration.
  /// Returns null for COMPLETED (no further action needed).
  _ActionConfig? _getActionConfig(OrderStatus status) {
    switch (status) {
      case OrderStatus.newOrder:
        return _ActionConfig(
          label: 'Accept',
          nextStatus: OrderStatus.preparing,
          color: AppTheme.accentOrange,
        );
      case OrderStatus.preparing:
        return _ActionConfig(
          label: 'Mark Ready',
          nextStatus: OrderStatus.ready,
          color: AppTheme.accentAmber,
        );
      case OrderStatus.ready:
        return _ActionConfig(
          label: 'Complete',
          nextStatus: OrderStatus.completed,
          color: AppTheme.accentGreen,
        );
      case OrderStatus.completed:
        return null; // No further actions
    }
  }
}

/// Internal configuration for the action button on each card.
class _ActionConfig {
  final String label;
  final OrderStatus nextStatus;
  final Color color;

  const _ActionConfig({
    required this.label,
    required this.nextStatus,
    required this.color,
  });
}
