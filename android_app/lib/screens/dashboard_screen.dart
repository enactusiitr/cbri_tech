// lib/screens/dashboard_screen.dart
//
// The main screen of the app.
// Contains the AppBar with connection indicator and a TabBar with 4 tabs:
//   NEW | PREPARING | READY | COMPLETED
//
// Each tab is backed by an OrderListScreen widget.
// The badge count on each tab is kept live via Provider.

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/app_theme.dart';
import '../models/order_model.dart';
import '../providers/order_provider.dart';
import '../services/socket_service.dart';
import '../widgets/connection_indicator.dart';
import 'order_list_screen.dart';

/// Configuration for a single tab
class _TabConfig {
  final OrderStatus status;
  final String label;
  final IconData icon;

  const _TabConfig({
    required this.status,
    required this.label,
    required this.icon,
  });
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Tab definitions — order matters (matches tab index)
  static const List<_TabConfig> _tabs = [
    _TabConfig(
      status: OrderStatus.newOrder,
      label: 'NEW',
      icon: Icons.fiber_new_rounded,
    ),
    _TabConfig(
      status: OrderStatus.preparing,
      label: 'PREPARING',
      icon: Icons.restaurant_rounded,
    ),
    _TabConfig(
      status: OrderStatus.ready,
      label: 'READY',
      icon: Icons.check_circle_rounded,
    ),
    _TabConfig(
      status: OrderStatus.completed,
      label: 'COMPLETED',
      icon: Icons.history_rounded,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(context),
      body: _buildBody(),
    );
  }

  // ── AppBar ─────────────────────────────────────────────────────────────

  PreferredSizeWidget _buildAppBar(BuildContext context) {
    final socketState = context.select<OrderProvider, SocketConnectionState>(
      (p) => p.socketState,
    );

    return AppBar(
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Kitchen Dashboard'),
          Text(
            _getCurrentDateString(),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w400,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
      actions: [
        // Live/Offline indicator
        ConnectionIndicator(state: socketState),
      ],
      bottom: _buildTabBar(context),
    );
  }

  // ── TabBar ─────────────────────────────────────────────────────────────

  PreferredSize _buildTabBar(BuildContext context) {
    return PreferredSize(
      preferredSize: const Size.fromHeight(48),
      child: Container(
        decoration: const BoxDecoration(
          border: Border(
            bottom: BorderSide(color: AppTheme.divider, width: 1),
          ),
        ),
        child: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabAlignment: TabAlignment.start,
          padding: const EdgeInsets.symmetric(horizontal: 8),
          tabs: _tabs.map((tab) {
            // Each tab has a badge showing the current order count
            return _TabWithBadge(
              config: tab,
              tabController: _tabController,
              tabIndex: _tabs.indexOf(tab),
            );
          }).toList(),
        ),
      ),
    );
  }

  // ── Body ───────────────────────────────────────────────────────────────

  Widget _buildBody() {
    return TabBarView(
      controller: _tabController,
      // Using AutomaticKeepAlive via wantKeepAlive in the child widgets
      // would preserve scroll position — for now we rebuild on tab switch
      children: _tabs
          .map((tab) => OrderListScreen(
                key: ValueKey(tab.status),
                status: tab.status,
              ))
          .toList(),
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  String _getCurrentDateString() {
    final now = DateTime.now();
    final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${weekdays[now.weekday - 1]}, ${months[now.month - 1]} ${now.day}';
  }
}

// ── Tab with live order count badge ────────────────────────────────────────

class _TabWithBadge extends StatelessWidget {
  final _TabConfig config;
  final TabController tabController;
  final int tabIndex;

  const _TabWithBadge({
    required this.config,
    required this.tabController,
    required this.tabIndex,
  });

  @override
  Widget build(BuildContext context) {
    // Count for THIS tab's status only — efficient select
    final count = context.select<OrderProvider, int>((p) {
      return p.ordersForStatus(config.status).length;
    });

    final isSelected = tabController.index == tabIndex;
    final tabColor = isSelected
        ? AppTheme.statusColor(config.status.value)
        : AppTheme.textSecondary;

    return Tab(
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            config.label,
            style: TextStyle(
              color: tabColor,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              fontSize: 12,
              letterSpacing: 0.8,
            ),
          ),
          if (count > 0) ...[
            const SizedBox(width: 6),
            // Badge showing order count
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppTheme.statusColor(config.status.value)
                    : AppTheme.divider,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                count.toString(),
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: isSelected ? Colors.white : AppTheme.textSecondary,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
