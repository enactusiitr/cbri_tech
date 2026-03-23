// lib/widgets/connection_indicator.dart
//
// A small animated widget displayed in the AppBar to show the
// current WebSocket connection status. Provides at-a-glance
// feedback so staff know if real-time updates are active.

import 'package:flutter/material.dart';
import '../config/app_theme.dart';
import '../services/socket_service.dart';

class ConnectionIndicator extends StatefulWidget {
  final SocketConnectionState state;

  const ConnectionIndicator({super.key, required this.state});

  @override
  State<ConnectionIndicator> createState() => _ConnectionIndicatorState();
}

class _ConnectionIndicatorState extends State<ConnectionIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    // Pulse animation for the "connecting/reconnecting" state
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final config = _getConfig(widget.state);

    return Padding(
      padding: const EdgeInsets.only(right: 16),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Animated dot indicator
          AnimatedBuilder(
            animation: _pulseAnimation,
            builder: (context, child) {
              final shouldPulse = widget.state ==
                      SocketConnectionState.connecting ||
                  widget.state == SocketConnectionState.reconnecting;

              return Opacity(
                opacity: shouldPulse ? _pulseAnimation.value : 1.0,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: config.color,
                    shape: BoxShape.circle,
                    boxShadow: widget.state == SocketConnectionState.connected
                        ? [
                            BoxShadow(
                              color: config.color.withOpacity(0.5),
                              blurRadius: 6,
                              spreadRadius: 1,
                            ),
                          ]
                        : null,
                  ),
                ),
              );
            },
          ),
          const SizedBox(width: 6),

          // Status label
          Text(
            config.label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: config.color,
            ),
          ),
        ],
      ),
    );
  }

  _IndicatorConfig _getConfig(SocketConnectionState state) {
    switch (state) {
      case SocketConnectionState.connected:
        return _IndicatorConfig(AppTheme.accentGreen, 'Live');
      case SocketConnectionState.connecting:
        return _IndicatorConfig(AppTheme.accentAmber, 'Connecting');
      case SocketConnectionState.reconnecting:
        return _IndicatorConfig(AppTheme.accentAmber, 'Reconnecting');
      case SocketConnectionState.error:
        return _IndicatorConfig(const Color(0xFFE74C3C), 'Error');
      case SocketConnectionState.disconnected:
        return _IndicatorConfig(AppTheme.textSecondary, 'Offline');
    }
  }
}

class _IndicatorConfig {
  final Color color;
  final String label;
  const _IndicatorConfig(this.color, this.label);
}
