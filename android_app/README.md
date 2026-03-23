# 🍽️ Restaurant Dashboard — Flutter App

A production-quality Flutter application for restaurant staff to manage orders in real-time.

---

## 📁 Project Structure

```
restaurant_dashboard/
├── .env                          # Environment variables (backend URL)
├── pubspec.yaml                  # Flutter dependencies
├── README.md
└── lib/
    ├── main.dart                 # App entry point, Provider setup
    ├── config/
    │   ├── app_config.dart       # Backend URL, API paths, socket settings
    │   └── app_theme.dart        # Material theme, colors, typography
    ├── models/
    │   └── order_model.dart      # Order + OrderItem + OrderStatus
    ├── services/
    │   ├── api_service.dart      # REST API calls (GET, PATCH)
    │   └── socket_service.dart   # Socket.IO connection + event handling
    ├── providers/
    │   └── order_provider.dart   # Global state: orders list, fetch, update
    ├── screens/
    │   ├── dashboard_screen.dart # Main screen with 4-tab layout
    │   └── order_list_screen.dart# Single tab view (filtered by status)
    ├── widgets/
    │   ├── order_card.dart       # Order card with items + action button
    │   ├── connection_indicator.dart # Live/Offline indicator in AppBar
    │   ├── order_skeleton.dart   # Shimmer loading skeletons
    │   ├── empty_orders_view.dart# Empty state per tab
    │   └── error_view.dart       # Error state with retry
    └── utils/
        └── logger.dart           # Centralized Logger instance
```

---

## 🚀 Setup Instructions

### Prerequisites

- Flutter SDK ≥ 3.0.0 (run `flutter --version` to check)
- Dart SDK ≥ 3.0.0 (included with Flutter)
- A running backend (Node.js + Socket.IO) — see Backend section below

### 1. Clone / Download the project

```bash
cd restaurant_dashboard
```

### 2. Configure the Backend URL

Edit the `.env` file in the project root:

```env
BACKEND_URL=https://your-actual-backend-url.com
API_BASE_PATH=/api
```

Replace `https://your-actual-backend-url.com` with your Node.js backend URL.

> **Local development tip:** If your backend runs locally, use:
> - Android emulator: `http://10.0.2.2:3000`
> - iOS simulator: `http://localhost:3000`
> - Physical device: `http://YOUR_LOCAL_IP:3000`

### 3. Install dependencies

```bash
flutter pub get
```

### 4. Run the app

```bash
# Debug mode (with hot reload)
flutter run

# Release mode (optimized)
flutter run --release

# Specific device
flutter run -d chrome          # Web
flutter run -d android         # Android
flutter run -d ios             # iOS
```

---

## ⚙️ Backend Requirements

Your Node.js backend must:

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Returns array of all orders |
| `PATCH` | `/api/orders/:id` | Updates order status |

**GET `/api/orders` — Response format:**
```json
[
  {
    "id": "abc123",
    "customerName": "John Doe",
    "items": [
      { "name": "Burger", "quantity": 2, "price": 8.99 },
      { "name": "Fries", "quantity": 1, "price": 3.49 }
    ],
    "totalAmount": 21.47,
    "status": "NEW",
    "createdAt": "2024-01-15T12:30:00Z"
  }
]
```

> Also supports wrapped formats: `{ "data": [...] }` or `{ "orders": [...] }`

**PATCH `/api/orders/:id` — Request body:**
```json
{ "status": "PREPARING" }
```

**PATCH Response:** The updated order object (same shape as above).

### Socket.IO Events

The server must emit these events:

```javascript
// When a new order is created by a customer
socket.emit('order_created', orderObject);

// When an order is updated (status change, etc.)
socket.emit('order_updated', orderObject);
```

The `orderObject` can be:
- The order directly: `{ id, customerName, items, ... }`
- Wrapped: `{ order: { id, customerName, items, ... } }`
- Wrapped: `{ data: { id, customerName, items, ... } }`

All three formats are handled automatically.

---

## 🎨 Features

### Dashboard Tabs
- **NEW** — Incoming orders from customers. Staff tap "Accept" to start preparing.
- **PREPARING** — Kitchen is working on these. Tap "Mark Ready" when done.
- **READY** — Orders ready for pickup/delivery. Tap "Complete" to archive.
- **COMPLETED** — Historical completed orders.

### Real-Time Updates
- Connects to the backend via Socket.IO WebSocket
- New orders appear instantly without any page refresh
- Status changes from other staff are reflected immediately
- Connection status indicator (🟢 Live / 🟡 Connecting / 🔴 Offline) in the top bar

### Order Cards Show
- Customer name
- Order time and date
- Each item with quantity and price
- Total amount
- Contextual action button (status-dependent)

### Loading States
- Shimmer skeleton cards while initial data loads
- Per-card loading spinner while a status update is in flight
- Pull-to-refresh on any tab

### Error Handling
- Network failure → Error view with Retry button
- Socket disconnect → Automatic reconnection (up to 5 attempts)
- Individual order update failure → Optimistic UI reverts gracefully

---

## 🏗️ Architecture

### Clean Architecture Layers

```
UI (screens, widgets)
    ↕ Provider (context.watch / context.read)
State (OrderProvider — ChangeNotifier)
    ↕ calls
Services (ApiService, SocketService)
    ↕ HTTP / WebSocket
Backend (Node.js REST + Socket.IO)
```

### State Management (Provider)

`OrderProvider` is the single source of truth:
- Holds the master `List<Order>`
- Exposes filtered lists per status tab
- Handles optimistic updates (UI changes immediately, reverts on API error)
- Bridges socket events → UI updates

### Socket Integration

`SocketService` is fully decoupled from UI:
- Manages connection lifecycle
- Parses raw socket payloads into `Order` objects
- Calls typed callbacks set by `OrderProvider`
- Auto-reconnects on disconnect

---

## 🔧 Customization

### Change Backend URL at runtime
Edit `.env` — no code changes needed.

### Add more socket events
In `socket_service.dart`, add inside `_registerEventHandlers()`:
```dart
socket.on('your_event', (data) {
  // handle it
});
```

### Add more order statuses
1. Add to the `OrderStatus` enum in `order_model.dart`
2. Add a tab in `dashboard_screen.dart`
3. Add action config in `order_card.dart` → `_getActionConfig()`
4. Add empty state in `empty_orders_view.dart`

### Change theme colors
Edit `app_theme.dart` — all colors are centralized.

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `provider` | ^6.1.2 | State management |
| `http` | ^1.2.1 | REST API calls |
| `socket_io_client` | ^2.0.3+1 | WebSocket / Socket.IO |
| `flutter_dotenv` | ^5.1.0 | Environment variables |
| `intl` | ^0.19.0 | Date formatting |
| `logger` | ^2.3.0 | Colored debug logging |
| `google_fonts` | ^6.2.1 | Inter font family |
| `shimmer` | ^3.0.0 | Loading skeleton effect |

---

## 🐛 Troubleshooting

**"Connection Failed" on startup**
→ Check your `BACKEND_URL` in `.env`. Ensure the backend is running and accessible.

**Socket shows "Offline" permanently**
→ Verify the backend has Socket.IO enabled and CORS allows your app's origin.
→ Check if the backend requires WebSocket transport explicitly.

**Orders don't appear from socket**
→ Open Flutter DevTools and check the log output (`[SocketService]` prefix).
→ Verify the socket event names match: `order_created` and `order_updated`.

**PATCH returns 404**
→ Confirm the backend route is `/api/orders/:id` (or update `API_BASE_PATH` in `.env`).

**Fonts not loading**
→ Run `flutter pub get` and ensure internet access during first build (fonts download from Google).
