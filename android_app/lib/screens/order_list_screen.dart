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
import '../config/app_config.dart';
import '../models/order_model.dart';
import '../providers/order_provider.dart';
import '../services/socket_service.dart';
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
    final width = MediaQuery.of(context).size.width;
    final isCompact = width < 380;

    // We select only the data this tab needs, avoiding full rebuilds
    // when orders in OTHER tabs change.
    final providerStatus = context.select<OrderProvider, ProviderStatus>(
      (p) => p.status,
    );
    final errorMessage = context.select<OrderProvider, String>(
      (p) => p.errorMessage,
    );
    final technicalError = context.select<OrderProvider, String>(
      (p) => p.lastTechnicalError,
    );
    final socketState = context.select<OrderProvider, SocketConnectionState>(
      (p) => p.socketState,
    );
    final debugLogs = context.select<OrderProvider, List<String>>(
      (p) => p.debugLogs,
    );

    // Show loading skeleton during initial fetch
    if (providerStatus == ProviderStatus.loading) {
      return const OrderSkeleton(count: 4);
    }

    // Show error view with retry option
    if (providerStatus == ProviderStatus.error) {
      return ErrorView(
        message: technicalError.isNotEmpty ? '$errorMessage\n\n$technicalError' : errorMessage,
        onRetry: () => context.read<OrderProvider>().fetchOrders(),
      );
    }

    // Get the filtered list for this tab's status
    final orders = context.select<OrderProvider, List<Order>>(
      (p) => p.ordersForStatus(status),
    );

    // Show empty state if no orders match this status
    if (orders.isEmpty) {
      return SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          children: [
            EmptyOrdersView(status: status),
            if (socketState == SocketConnectionState.error || technicalError.isNotEmpty)
              _DiagnosticsPanel(
                socketState: socketState,
                technicalError: technicalError,
                logs: debugLogs,
              ),
            const SizedBox(height: 20),
          ],
        ),
      );
    }

    // Render the list of order cards.
    // Using ListView.builder for efficient rendering of large lists
    // (only renders cards visible on screen).
    return RefreshIndicator(
      // Pull-to-refresh triggers a new API fetch
      onRefresh: () => context.read<OrderProvider>().fetchOrders(),
      color: Theme.of(context).colorScheme.primary,
      backgroundColor: Theme.of(context).colorScheme.surface,
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 560),
          child: ListView.builder(
            padding: EdgeInsets.symmetric(
              vertical: isCompact ? 6 : 8,
              horizontal: isCompact ? 8 : 12,
            ),
            itemCount: orders.length,
            // physics ensures RefreshIndicator works even when list is small
            physics: const AlwaysScrollableScrollPhysics(),
            itemBuilder: (context, index) {
              final order = orders[index];
              return Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: OrderCard(
                  // ValueKey ensures Flutter correctly identifies each card
                  // during reordering (when an order moves to a different tab)
                  key: ValueKey(order.id),
                  order: order,
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

class _DiagnosticsPanel extends StatelessWidget {
  final SocketConnectionState socketState;
  final String technicalError;
  final List<String> logs;

  const _DiagnosticsPanel({
    required this.socketState,
    required this.technicalError,
    required this.logs,
  });

  @override
  Widget build(BuildContext context) {
    final visibleLogs = logs.take(12).toList();
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.fromLTRB(12, 0, 12, 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.red.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Connection Diagnostics',
            style: TextStyle(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          SelectableText('Socket state: $socketState'),
          SelectableText('Backend: ${AppConfig.backendUrl}'),
          if (technicalError.isNotEmpty) ...[
            const SizedBox(height: 8),
            const Text('Last error:'),
            SelectableText(
              technicalError,
              style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
            ),
          ],
          if (visibleLogs.isNotEmpty) ...[
            const SizedBox(height: 10),
            const Text('Recent logs:'),
            const SizedBox(height: 6),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFF6F7F9),
                borderRadius: BorderRadius.circular(8),
              ),
              child: SelectableText(
                visibleLogs.join('\n'),
                style: const TextStyle(fontFamily: 'monospace', fontSize: 11),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
