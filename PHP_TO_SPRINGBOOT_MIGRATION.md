# 🔄 PHP to Spring Boot + React Migration Guide

## Overview

This document maps features from the PHP project (`/var/www/html/smart-menu-qr/`) to the new Spring Boot + React implementation (`/var/www/html/smart-menu-saas/`).

Use this as a reference when teaching to show what functionality exists in PHP and how to rebuild it.

---

## 📂 Project Structure Comparison

### PHP Project Structure
```
smart-menu-qr/
├── index.php                  # Landing page
├── register.php               # User registration
├── db.php                     # Database connection
├── room_services.php          # Menu items management
├── status.php                 # Order status
├── submit_feedback.php        # Customer feedback
├── test.html                  # Testing interface
├── admin/                     # Admin panel
│   ├── dashboard.php
│   ├── menu.php
│   ├── orders.php
│   └── tables.php
├── api/                       # API endpoints
│   ├── get_menu.php
│   ├── create_order.php
│   └── update_order.php
├── includes/                  # Shared code
│   ├── header.php
│   ├── footer.php
│   └── functions.php
├── assets/                    # CSS, JS, images
├── qr-gen/                    # QR code generation
└── vendor/                    # Composer dependencies
```

### Spring Boot + React Structure
```
smart-menu-saas/
├── backend/                   # Spring Boot API
│   ├── src/main/java/com/smartmenu/
│   │   ├── model/             # = db.php entities
│   │   ├── repository/        # = database queries
│   │   ├── service/           # = includes/functions.php
│   │   ├── controller/        # = api/*.php
│   │   ├── dto/               # Request/response objects
│   │   ├── config/            # Configuration
│   │   ├── security/          # JWT authentication
│   │   └── util/              # = includes/functions.php
│   └── pom.xml                # = composer.json
├── frontend/                  # React UI
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # = admin/*.php (as React)
│   │   │   ├── admin/         # Admin panel pages
│   │   │   ├── customer/      # Customer-facing pages
│   │   │   └── kitchen/       # Kitchen dashboard
│   │   ├── services/          # API calls (axios)
│   │   ├── context/           # Global state
│   │   └── App.jsx            # = index.php
│   └── package.json           # = composer.json (for Node)
└── docker-compose.yml         # Run everything together
```

---

## 🔄 Feature Migration Map

### 1. Database Connection

#### PHP (`db.php`)
```php
<?php
$host = "localhost";
$dbname = "smart_menu";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
```

#### Spring Boot (`application.properties`)
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/smartmenu
spring.data.mongodb.database=smartmenu
```

**Key Differences:**
- MySQL → MongoDB (SQL → NoSQL)
- Connection string in config file (not code)
- Spring Boot auto-configures connection
- No manual connection handling needed

---

### 2. User Registration

#### PHP (`register.php`)
```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $password]);
    
    echo json_encode(["success" => true, "message" => "User registered"]);
}
?>
```

#### Spring Boot (Controller + Service)
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    public User register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        return userRepository.save(user);
    }
}
```

**Key Differences:**
- Separation of concerns (Controller → Service → Repository)
- `@Valid` annotation for automatic validation
- Type safety (Java classes vs PHP arrays)
- BCrypt encoding (same as PHP `password_hash`)
- Returns JSON automatically

---

### 3. Menu Items Management

#### PHP (`room_services.php`)
```php
<?php
// Get all menu items
if ($_GET['action'] == 'list') {
    $stmt = $pdo->query("SELECT * FROM menu_items WHERE restaurant_id = ?");
    $stmt->execute([$_SESSION['restaurant_id']]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);
}

// Create menu item
if ($_POST['action'] == 'create') {
    $stmt = $pdo->prepare("INSERT INTO menu_items (name, price, description) VALUES (?, ?, ?)");
    $stmt->execute([$_POST['name'], $_POST['price'], $_POST['description']]);
    echo json_encode(["success" => true]);
}
?>
```

#### Spring Boot
```java
@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {
    
    @Autowired
    private MenuItemService service;
    
    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems(
            @RequestParam(required = false) String restaurantId) {
        List<MenuItem> items = service.findByRestaurantId(restaurantId);
        return ResponseEntity.ok(items);
    }
    
    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(
            @Valid @RequestBody MenuItemRequest request) {
        MenuItem item = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }
}
```

**Key Differences:**
- RESTful URL structure (`/api/menu-items` vs `room_services.php?action=list`)
- HTTP methods (GET, POST, PUT, DELETE) instead of `?action=` parameter
- Automatic JSON serialization/deserialization
- Type-safe request/response objects
- Built-in validation

---

### 4. Order Management

#### PHP (`api/create_order.php`)
```php
<?php
session_start();
$data = json_decode(file_get_contents("php://input"), true);

$order_id = uniqid();
$items = $data['items'];
$total = 0;

foreach ($items as $item) {
    $total += $item['price'] * $item['quantity'];
}

$stmt = $pdo->prepare("INSERT INTO orders (order_id, customer_name, total, status) VALUES (?, ?, ?, 'pending')");
$stmt->execute([$order_id, $data['customer_name'], $total]);

foreach ($items as $item) {
    $stmt = $pdo->prepare("INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)");
    $stmt->execute([$order_id, $item['id'], $item['quantity'], $item['price']]);
}

echo json_encode(["success" => true, "order_id" => $order_id]);
?>
```

#### Spring Boot
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            OrderResponse.from(order)
        );
    }
}

@Service
@Transactional
public class OrderService {
    
    public Order createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setTableId(request.getTableId());
        order.setRestaurantId(request.getRestaurantId());
        
        List<OrderItem> items = new ArrayList<>();
        double total = 0.0;
        
        for (OrderItemRequest itemReq : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setMenuItemId(itemReq.getMenuItemId());
            item.setMenuItemName(itemReq.getMenuItemName());
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(itemReq.getPrice());
            item.setSubtotal(itemReq.getPrice() * itemReq.getQuantity());
            
            items.add(item);
            total += item.getSubtotal();
        }
        
        order.setItems(items);
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.PENDING);
        
        return orderRepository.save(order);
    }
}
```

**Key Differences:**
- `@Transactional` ensures all-or-nothing (like MySQL transactions)
- Embedded documents (OrderItem inside Order) instead of separate table
- Type-safe domain models
- Automatic ID generation (MongoDB ObjectId)
- Service layer handles business logic

---

### 5. QR Code Generation

#### PHP (`qr-gen/generate.php`)
```php
<?php
require 'vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

$table_id = $_GET['table_id'];
$url = "https://yourdomain.com/menu?table=" . $table_id;

$qrCode = new QrCode($url);
$writer = new PngWriter();
$result = $writer->write($qrCode);

header('Content-Type: ' . $result->getMimeType());
echo $result->getString();
?>
```

#### Spring Boot
```java
@RestController
@RequestMapping("/api/qr")
public class QRCodeController {
    
    @Autowired
    private QRCodeService qrCodeService;
    
    @GetMapping("/{tableId}")
    public ResponseEntity<byte[]> generateQRCode(@PathVariable String tableId) {
        byte[] qrCode = qrCodeService.generateQRCode(tableId);
        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCode);
    }
}

@Service
public class QRCodeService {
    
    public byte[] generateQRCode(String tableId) {
        String url = "https://yourdomain.com/menu?table=" + tableId;
        
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, 300, 300);
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        
        return outputStream.toByteArray();
    }
}
```

**Key Differences:**
- ZXing library (Java) instead of Endroid (PHP)
- Returns byte array (can be saved to file or returned as response)
- More control over QR code size and format

---

### 6. Authentication & Sessions

#### PHP
```php
<?php
session_start();

// Login
if ($_POST['action'] == 'login') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    }
}

// Check if logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
?>
```

#### Spring Boot (JWT)
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return ResponseEntity.ok(new JwtResponse(
            jwt,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail()
        ));
    }
}

// Protected endpoint
@GetMapping("/profile")
@PreAuthorize("hasRole('USER')")
public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    User user = userService.findById(userDetails.getId());
    return ResponseEntity.ok(user);
}
```

**Key Differences:**
- **Sessions (PHP)** → **JWT tokens (Spring Boot)**
- Stateless authentication (no server-side session storage)
- Token sent in HTTP header: `Authorization: Bearer <token>`
- `@PreAuthorize` for role-based access control
- More secure for APIs and mobile apps

---

## 🎨 UI Migration (React)

### PHP Admin Dashboard
```php
<!-- admin/dashboard.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <div class="container">
        <h1>Dashboard</h1>
        
        <div class="stats">
            <?php
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM orders WHERE status = 'pending'");
            $pending = $stmt->fetch()['total'];
            ?>
            <div class="stat-card">
                <h3><?php echo $pending; ?></h3>
                <p>Pending Orders</p>
            </div>
        </div>
        
        <table id="orders-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 10");
                while ($order = $stmt->fetch()) {
                    echo "<tr>";
                    echo "<td>{$order['id']}</td>";
                    echo "<td>{$order['customer_name']}</td>";
                    echo "<td>\${$order['total']}</td>";
                    echo "<td>{$order['status']}</td>";
                    echo "<td><button onclick='viewOrder({$order['id']})'>View</button></td>";
                    echo "</tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
    
    <?php include '../includes/footer.php'; ?>
    <script src="../assets/js/dashboard.js"></script>
</body>
</html>
```

### React Admin Dashboard
```jsx
// frontend/src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { StatCard } from '../../components/StatCard';
import { OrderTable } from '../../components/OrderTable';

export const Dashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ pending: 0, preparing: 0, ready: 0 });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, []);
    
    const fetchOrders = async () => {
        try {
            const data = await orderService.getAll({ restaurantId: user.restaurantId });
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchStats = async () => {
        try {
            const data = await orderService.getStats(user.restaurantId);
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };
    
    const handleViewOrder = (orderId) => {
        // Navigate to order detail page
        navigate(`/admin/orders/${orderId}`);
    };
    
    if (loading) {
        return <div className="spinner">Loading...</div>;
    }
    
    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard title="Pending Orders" value={stats.pending} color="yellow" />
                <StatCard title="Preparing" value={stats.preparing} color="blue" />
                <StatCard title="Ready" value={stats.ready} color="green" />
            </div>
            
            <OrderTable 
                orders={orders} 
                onView={handleViewOrder}
                onRefresh={fetchOrders}
            />
        </div>
    );
};
```

**Key Differences:**
- **Server-side rendering (PHP)** → **Client-side rendering (React)**
- State management with hooks (`useState`, `useEffect`)
- API calls with axios/fetch (no page refresh)
- Component-based architecture (reusable components)
- Tailwind CSS for styling
- React Router for navigation

---

## 📊 Data Model Migration

### MySQL Tables → MongoDB Collections

#### PHP (MySQL)
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(255),
    available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT NOT NULL,
    table_id INT,
    customer_name VARCHAR(100),
    total_amount DECIMAL(10,2),
    status ENUM('pending','confirmed','preparing','ready','delivered','cancelled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

#### MongoDB (Spring Boot)
```javascript
// users collection
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "username": "admin",
  "email": "admin@example.com",
  "password": "$2a$10$hashed...",  // BCrypt hashed
  "fullName": "Admin User",
  "restaurantId": "507f1f77bcf86cd799439012",
  "role": "ADMIN",
  "active": true,
  "createdAt": ISODate("2025-11-20T10:00:00Z"),
  "updatedAt": ISODate("2025-11-20T10:00:00Z")
}

// menu_items collection
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "restaurantId": "507f1f77bcf86cd799439012",
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza",
  "price": 12.99,
  "category": "Pizza",
  "imageUrl": "https://example.com/pizza.jpg",
  "available": true,
  "createdAt": ISODate("2025-11-20T10:00:00Z"),
  "updatedAt": ISODate("2025-11-20T10:00:00Z")
}

// orders collection (embedded order_items)
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "restaurantId": "507f1f77bcf86cd799439012",
  "tableId": "507f1f77bcf86cd799439015",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "items": [
    {
      "menuItemId": "507f1f77bcf86cd799439013",
      "menuItemName": "Margherita Pizza",
      "quantity": 2,
      "price": 12.99,
      "subtotal": 25.98
    }
  ],
  "totalAmount": 25.98,
  "status": "PENDING",
  "createdAt": ISODate("2025-11-20T10:00:00Z"),
  "updatedAt": ISODate("2025-11-20T10:00:00Z")
}
```

**Key Differences:**
- **Relational (MySQL)** → **Document-oriented (MongoDB)**
- Foreign keys → Store IDs as strings (or embed documents)
- JOIN queries → Embedded documents or application-level lookups
- ENUM → Java enum + string in MongoDB
- AUTO_INCREMENT → ObjectId (MongoDB's default)
- Timestamps handled by Spring Data MongoDB annotations

---

## 🚀 Migration Strategy

### Step-by-Step Approach

1. **Analyze PHP Feature**
   - Review PHP code
   - Identify business logic
   - List database queries
   - Note UI elements

2. **Design Spring Boot Equivalent**
   - Create/update model
   - Design API endpoint
   - Plan request/response DTOs
   - Consider validation

3. **Implement Backend**
   - Write service method
   - Write controller endpoint
   - Add validation
   - Handle errors

4. **Test API**
   - Test with curl
   - Test with Swagger
   - Verify in MongoDB
   - Check logs

5. **Build React UI**
   - Create component
   - Implement API calls
   - Add form validation
   - Style with Tailwind

6. **Integration Test**
   - Test full flow (frontend → backend → database)
   - Check edge cases
   - Ensure error handling works

---

## 📝 Feature Checklist

Use this to track migration progress:

### Authentication & Users
- [ ] User registration
- [ ] User login (JWT)
- [ ] Password reset
- [ ] User profile
- [ ] Role-based access control

### Menu Management
- [ ] List menu items
- [ ] Create menu item
- [ ] Update menu item
- [ ] Delete menu item
- [ ] Upload item image
- [ ] Toggle availability
- [ ] Filter by category

### Table Management
- [ ] List tables
- [ ] Create table
- [ ] Update table
- [ ] Delete table
- [ ] Generate QR code
- [ ] Download QR code (PNG/PDF)

### Order Management
- [ ] Customer place order
- [ ] List orders (admin)
- [ ] View order details
- [ ] Update order status
- [ ] Order history
- [ ] Real-time updates (optional)

### Kitchen Dashboard
- [ ] View pending orders
- [ ] Update order status
- [ ] Mark order ready
- [ ] View order history

### Customer Menu View
- [ ] Browse menu
- [ ] View item details
- [ ] Add to cart
- [ ] Place order
- [ ] Order confirmation

---

## 🎓 Teaching Notes

When migrating features:

1. **Always show PHP first** - "This is what you built before"
2. **Explain the problem** - "Why we're changing it"
3. **Design together** - API endpoints, models
4. **Code together** - Let student type (you guide)
5. **Test together** - Verify it works
6. **Compare** - "See how it's better/different?"

---

*Use this guide alongside TEACHING_GUIDE.md for complete context*

**Last Updated:** November 20, 2025
