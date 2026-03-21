// lib/widgets/empty_orders_view.dart
//
// Displayed when a tab has no orders to show.
// Each status gets a contextually appropriate icon and message.

import 'package:flutter/material.dart';
import '../config/app_theme.dart';
import '../models/order_model.dart';

class EmptyOrdersView extends StatelessWidget {
  final OrderStatus status;

  const EmptyOrdersView({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final config = _getConfig(status);

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Faint icon circle
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppTheme.statusBgColor(status.value),
                shape: BoxShape.circle,
              ),
              child: Icon(
                config.icon,
                size: 38,
                color: AppTheme.statusColor(status.value).withOpacity(0.7),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              config.title,
              style: Theme.of(context).textTheme.headlineSmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              config.subtitle,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  _EmptyConfig _getConfig(OrderStatus status) {
    switch (status) {
      case OrderStatus.newOrder:
        return _EmptyConfig(
          icon: Icons.inbox_outlined,
          title: 'No New Orders',
          subtitle: 'New orders from customers\nwill appear here in real-time.',
        );
      case OrderStatus.preparing:
        return _EmptyConfig(
          icon: Icons.restaurant_outlined,
          title: 'Nothing Preparing',
          subtitle: 'Accept orders from the\nNew tab to start preparing.',
        );
      case OrderStatus.ready:
        return _EmptyConfig(
          icon: Icons.check_circle_outline,
          title: 'Nothing Ready',
          subtitle: 'Orders marked ready for\npickup will appear here.',
        );
      case OrderStatus.completed:
        return _EmptyConfig(
          icon: Icons.history,
          title: 'No Completed Orders',
          subtitle: 'Completed orders will be\narchived here for reference.',
        );
    }
  }
}

class _EmptyConfig {
  final IconData icon;
  final String title;
  final String subtitle;
  const _EmptyConfig({
    required this.icon,
    required this.title,
    required this.subtitle,
  });
}
