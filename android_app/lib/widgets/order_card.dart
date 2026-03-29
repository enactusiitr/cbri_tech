// lib/widgets/order_card.dart
//
// A self-contained widget that renders a single order.
// Shows customer name, creation time, items list, total, and an action button.
// Reads update state from the provider to show a loading indicator on the button.

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/app_theme.dart';
import '../models/order_model.dart';
import '../providers/order_provider.dart';

class OrderCard extends StatelessWidget {
  final Order order;

  const OrderCard({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    final isCompact = MediaQuery.of(context).size.width < 380;

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
        padding: EdgeInsets.all(isCompact ? 12 : 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(context, isCompact),
            const SizedBox(height: 12),
            _buildDivider(),
            const SizedBox(height: 12),
            _buildItemsList(context, isCompact),
            const SizedBox(height: 12),
            _buildDivider(),
            const SizedBox(height: 12),
            _buildFooter(context, isUpdating, isCompact),
          ],
        ),
      ),
    );
  }

  // ── Header: customer name + status badge + time ──────────────────────

  Widget _buildHeader(BuildContext context, bool isCompact) {
    final theme = Theme.of(context);
    // Force display timestamps in IST (+05:30) regardless of device timezone.
    final createdAtIst = order.createdAt.toUtc().add(const Duration(hours: 5, minutes: 30));
    final formattedTime = DateFormat('HH:mm').format(createdAtIst);
    final formattedDate = DateFormat('MMM d').format(createdAtIst);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Order ID circle avatar
        Container(
          width: isCompact ? 34 : 40,
          height: isCompact ? 34 : 40,
          decoration: BoxDecoration(
            color: AppTheme.statusBgColor(order.status.value),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Center(
            child: Text(
              '#',
              style: TextStyle(
                fontSize: isCompact ? 14 : 16,
                fontWeight: FontWeight.w800,
                color: AppTheme.statusColor(order.status.value),
              ),
            ),
          ),
        ),
        SizedBox(width: isCompact ? 8 : 12),

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
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(Icons.phone, size: isCompact ? 12 : 14, color: AppTheme.textSecondary),
                  const SizedBox(width: 4),
                  Text(order.phoneNumber, style: theme.textTheme.bodyMedium),
                ]
              ),
              const SizedBox(height: 2),
              Row(
                children: [
                  Icon(Icons.location_on, size: isCompact ? 12 : 14, color: AppTheme.textSecondary),
                  const SizedBox(width: 4),
                  Expanded(child: Text(order.address, style: theme.textTheme.bodyMedium, maxLines: 2, overflow: TextOverflow.ellipsis)),
                ]
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

  Widget _buildItemsList(BuildContext context, bool isCompact) {
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
        ...order.items.map((item) => _buildOrderItemRow(context, item, isCompact)),
      ],
    );
  }

  Widget _buildOrderItemRow(BuildContext context, OrderItem item, bool isCompact) {
    final theme = Theme.of(context);
    final itemTotal = item.price * item.quantity;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          _buildItemThumbnail(item, isCompact),
          SizedBox(width: isCompact ? 8 : 10),

          // Quantity badge
          Container(
            padding: EdgeInsets.symmetric(horizontal: isCompact ? 6 : 7, vertical: 2),
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
          SizedBox(width: isCompact ? 8 : 10),

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
            '₹${itemTotal.toStringAsFixed(2)}',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItemThumbnail(OrderItem item, bool isCompact) {
    final size = isCompact ? 38.0 : 46.0;
    final hasImage = item.imageUrl.trim().isNotEmpty;

    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: Container(
        width: size,
        height: size,
        color: AppTheme.statusBgColor(order.status.value),
        child: hasImage
            ? Image.network(
                item.imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const Icon(Icons.fastfood_rounded),
              )
            : const Icon(Icons.fastfood_rounded),
      ),
    );
  }

  // ── Footer: total amount + action button ───────────────────────────────

  Widget _buildFooter(BuildContext context, bool isUpdating, bool isCompact) {
    final theme = Theme.of(context);
    final actionConfig = _getActionConfig(order.status);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
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
              '₹${order.totalAmount.toStringAsFixed(2)}',
              style: theme.textTheme.headlineSmall?.copyWith(
                color: AppTheme.textPrimary,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),

        // Action buttons
        if (order.status == OrderStatus.newOrder)
          _buildNewOrderActions(context, isUpdating, isCompact)
        else if (actionConfig != null)
          _buildActionButton(context, actionConfig, isUpdating),
      ],
    );
  }

  Widget _buildNewOrderActions(
    BuildContext context,
    bool isUpdating,
    bool isCompact,
  ) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      alignment: WrapAlignment.end,
      children: [
        OutlinedButton.icon(
          onPressed: isUpdating ? null : () => _onRejectPressed(context),
          icon: const Icon(Icons.call_rounded, size: 16),
          label: const Text('Reject'),
          style: OutlinedButton.styleFrom(
            foregroundColor: Colors.red.shade700,
            side: BorderSide(color: Colors.red.shade300),
            padding: EdgeInsets.symmetric(
              horizontal: isCompact ? 10 : 12,
              vertical: 8,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ),
        PopupMenuButton<int>(
          enabled: !isUpdating,
          onSelected: (int estimatedMinutes) {
            context.read<OrderProvider>().updateOrderStatus(
              order.id, 
              OrderStatus.preparing, 
              estimatedTime: estimatedMinutes,
            );
          },
          offset: const Offset(0, 40),
          itemBuilder: (BuildContext context) => const <PopupMenuEntry<int>>[
            PopupMenuItem<int>(
              value: 30,
              child: Text('30 min'),
            ),
            PopupMenuItem<int>(
              value: 60,
              child: Text('1 hr'),
            ),
            PopupMenuItem<int>(
              value: 90,
              child: Text('1.30 min'),
            ),
          ],
          child: Container(
            padding: EdgeInsets.symmetric(
              horizontal: isCompact ? 12 : 16,
              vertical: 8,
            ),
            decoration: BoxDecoration(
              color: isUpdating ? AppTheme.accentOrange.withOpacity(0.5) : AppTheme.accentOrange,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (isUpdating)
                  const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                else ...const [
                  Text(
                    'Accept',
                    style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Colors.white),
                  ),
                  SizedBox(width: 4),
                  Icon(Icons.arrow_drop_down, color: Colors.white, size: 18),
                ]
              ],
            ),
          ),
        ),
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

  Future<void> _onRejectPressed(BuildContext context) async {
    await _callCustomer(context);
    if (context.mounted) {
      context.read<OrderProvider>().updateOrderStatus(order.id, OrderStatus.rejected);
    }
  }

  Future<void> _callCustomer(BuildContext context) async {
    final telUri = Uri(scheme: 'tel', path: order.phoneNumber);
    if (await canLaunchUrl(telUri)) {
      await launchUrl(telUri);
      return;
    }

    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not open dialer for ${order.phoneNumber}')),
      );
    }
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
          label: 'Done',
          nextStatus: OrderStatus.completed,
          color: AppTheme.accentGreen,
        );
      case OrderStatus.ready:
        return _ActionConfig(
          label: 'Complete',
          nextStatus: OrderStatus.completed,
          color: AppTheme.accentGreen,
        );
      case OrderStatus.rejected:
        return null;
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
