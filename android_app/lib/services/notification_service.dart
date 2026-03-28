import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../models/order_model.dart';
import '../utils/logger.dart';

class NotificationService {
  NotificationService._();

  static final NotificationService instance = NotificationService._();

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  static const String _channelId = 'new_order_alerts';
  static const String _channelName = 'New Order Alerts';
  static const String _channelDescription =
      'Alerts for incoming canteen orders';

  bool _isInitialized = false;

  Future<void> initialize() async {
    if (_isInitialized) return;

    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
    await _plugin.initialize(const InitializationSettings(android: androidInit));

    final androidPlugin =
        _plugin.resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>();

    await androidPlugin?.requestNotificationsPermission();
    await androidPlugin?.createNotificationChannel(
      const AndroidNotificationChannel(
        _channelId,
        _channelName,
        description: _channelDescription,
        importance: Importance.max,
        playSound: true,
        sound: RawResourceAndroidNotificationSound('bell'),
        enableVibration: true,
      ),
    );

    _isInitialized = true;
    log.i('[NotificationService] Initialized');
  }

  int _notificationIdForOrder(String orderId) {
    return orderId.hashCode & 0x7fffffff;
  }

  Future<void> showNewOrderNotification(Order order, {int? ringTick}) async {
    await initialize();

    const details = NotificationDetails(
      android: AndroidNotificationDetails(
        _channelId,
        _channelName,
        channelDescription: _channelDescription,
        importance: Importance.max,
        priority: Priority.max,
        category: AndroidNotificationCategory.alarm,
        ongoing: true,
        autoCancel: false,
        playSound: true,
        sound: RawResourceAndroidNotificationSound('bell'),
        enableVibration: true,
        visibility: NotificationVisibility.public,
      ),
    );

    await _plugin.show(
      _notificationIdForOrder(order.id),
      'New Order (${order.canteen})',
      '${order.customerName} • ${order.items.length} item(s) • Pending${ringTick != null ? ' • Alert #$ringTick' : ''}',
      details,
      payload: order.id,
    );
  }

  Future<void> cancelOrderNotification(String orderId) async {
    await _plugin.cancel(_notificationIdForOrder(orderId));
  }
}