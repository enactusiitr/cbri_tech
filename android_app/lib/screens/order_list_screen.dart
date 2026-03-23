// lib/screens/order_list_screen.dart
//
// Renders the order list for a single status tab (e.g. "NEW").
// This widget is reused for all 4 tabs — the status parameter
// determines which subset of orders to display.
//
// It handles three states:
//   - Loading: shows shimmer skeleton cards
//   - Error:   shows error view with retry button
//   - Loaded:  shows the filtered order list or an empty state

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/order_model.dart';
import '../providers/order_provider.dart';
import '../widgets/order_card.dart';
import '../widgets/order_skeleton.dart';
import '../widgets/empty_orders_view.dart';
import '../widgets/error_view.dart';

class OrderListScreen extends StatelessWidget {
  /// The status this screen is filtering by
  final OrderStatus status;

  const OrderListScreen({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    // We select only the data this tab needs, avoiding full rebuilds
    // when orders in OTHER tabs change.
    final providerStatus = context.select<OrderProvider, ProviderStatus>(
      (p) => p.status,
    );
    final errorMessage = context.select<OrderProvider, String>(
      (p) => p.errorMessage,
    );

    // Show loading skeleton during initial fetch
    if (providerStatus == ProviderStatus.loading) {
      return const OrderSkeleton(count: 4);
    }

    // Show error view with retry option
    if (providerStatus == ProviderStatus.error) {
      return ErrorView(
        message: errorMessage,
        onRetry: () => context.read<OrderProvider>().fetchOrders(),
      );
    }

    // Get the filtered list for this tab's status
    final orders = context.select<OrderProvider, List<Order>>(
      (p) => p.ordersForStatus(status),
    );

    // Show empty state if no orders match this status
    if (orders.isEmpty) {
      return EmptyOrdersView(status: status);
    }

    // Render the list of order cards.
    // Using ListView.builder for efficient rendering of large lists
    // (only renders cards visible on screen).
    return RefreshIndicator(
      // Pull-to-refresh triggers a new API fetch
      onRefresh: () => context.read<OrderProvider>().fetchOrders(),
      color: Theme.of(context).colorScheme.primary,
      backgroundColor: const Color(0xFF252B35),
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: orders.length,
        // physics ensures RefreshIndicator works even when list is small
        physics: const AlwaysScrollableScrollPhysics(),
        itemBuilder: (context, index) {
          final order = orders[index];
          return OrderCard(
            // ValueKey ensures Flutter correctly identifies each card
            // during reordering (when an order moves to a different tab)
            key: ValueKey(order.id),
            order: order,
          );
        },
      ),
    );
  }
}
