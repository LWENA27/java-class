# SmartMenu SaaS - Teaching Guide & Learning Documentation

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Student Background & Learning Goals](#student-background--learning-goals)
3. [What Has Been Learned So Far](#what-has-been-learned-so-far)
4. [Project Architecture](#project-architecture)
5. [Current Project Status](#current-project-status)
6. [PHP to Spring Boot Migration Strategy](#php-to-spring-boot-migration-strategy)
7. [Teaching Roadmap (What's Next)](#teaching-roadmap-whats-next)
8. [How to Continue Teaching](#how-to-continue-teaching)
9. [Common Teaching Moments](#common-teaching-moments)
10. [Testing & Verification](#testing--verification)

---

## 🎯 Project Overview

### **Project Name:** SmartMenu SaaS
**Description:** A full-stack QR Restaurant Menu & Ordering System (SaaS)

### **Business Requirements:**
- ✅ Restaurants can create menu items with images
- ✅ Generate QR codes for tables
- ✅ Customers scan QR → see menu → place orders
- ✅ Kitchen dashboard receives and manages orders
- ✅ Admin dashboard for restaurant owners
- ✅ JWT authentication
- ✅ Payment integration (future phase)

### **Reference Project:**
- **PHP Version:** `/var/www/html/smart-menu-qr/` (existing, working project)
- **Goal:** Rebuild using modern stack (Spring Boot + React + MongoDB)

### **Why This Project?**
This project is based on a **job posting** the student is targeting. It covers ALL required skills:
- Spring Boot (REST APIs)
- Spring MVC
- MongoDB
- Spring Data MongoDB
- Spring Security
- Swagger/OpenAPI
- React.js
- Microservices concepts
- Docker

---

## 👨‍🎓 Student Background & Learning Goals

### **Current Knowledge:**
- ✅ PHP (CodeIgniter framework)
- ✅ MySQL/MariaDB
- ✅ Basic HTML/CSS/JavaScript
- ✅ Linux/Ubuntu terminal commands
- ✅ Git basics

### **Learning Style:**
- **Prefers:** Hands-on first, then explanation
- **Requests:** Challenge assumptions, teach best practices
- **Goal:** Get job-ready in Spring Boot + React stack

### **Target Job Requirements:**
From the job posting image provided:
```
✅ Spring Boot (RESTful APIs)
✅ Spring MVC, Spring Data, Spring Security
✅ MongoDB (experience required)
✅ React.js / Thymeleaf
✅ Microservices & Spring Framework
✅ Experience with Hooks, Redux, Context API
✅ MongoDB aggregation pipelines and schema design
✅ Ability to work independently
✅ Problem-solving skills
```

---

## ✅ What Has Been Learned So Far

### **Phase 1: Environment Setup (COMPLETED)**

#### 1. **Java & Build Tools**
**Learned:**
- ✅ Java 21 is installed and working
- ✅ Maven (build tool like Composer in PHP)
- ✅ Maven commands must run from directory with `pom.xml`
- ✅ `mvn spring-boot:run` starts the application

**Teaching Moment Given:**
```bash
# ❌ WRONG (like running composer outside your PHP project)
cd /var/www/html/
mvn spring-boot:run  # No pom.xml here!

# ✅ CORRECT
cd /var/www/html/smart-menu-saas/backend/
mvn spring-boot:run  # pom.xml is here!
```

**Key Maven Commands Taught:**
| Command | Purpose | PHP Equivalent |
|---------|---------|----------------|
| `mvn clean` | Delete compiled files | `rm -rf vendor/` |
| `mvn compile` | Compile Java to bytecode | `php artisan optimize` |
| `mvn test` | Run unit tests | `php artisan test` |
| `mvn package` | Create JAR file | Create deployment artifact |
| `mvn spring-boot:run` | Start app | `php artisan serve` |
| `mvn clean install` | Full build | Clean + compile + test + package |

#### 2. **MongoDB Setup**
**Learned:**
- ✅ MongoDB running in Docker container
- ✅ Container port mapping: 27017:27017
- ✅ No authentication (dev mode)
- ✅ Database name: `smartmenu`

**Docker Commands Used:**
```bash
# Start MongoDB container
sudo docker run -d --name mongodb -p 27017:27017 -v ~/mongo-data:/data/db mongo:7.0

# Check container status
sudo docker ps

# View logs
sudo docker logs -f mongodb

# Execute mongosh inside container
sudo docker exec -it mongodb mongosh --eval "db.adminCommand('ping')"
```

**Connection String:**
```
mongodb://localhost:27017/smartmenu
```

---

### **Phase 2: Spring Boot Project Structure (COMPLETED)**

#### 1. **Project Architecture (MVC Pattern)**
**Learned:** Spring Boot follows MVC + Service Layer architecture:

```
backend/
├── src/main/java/com/smartmenu/
│   ├── SmartMenuApplication.java      ← Main entry point
│   ├── model/                         ← Database entities (like Eloquent models)
│   │   ├── User.java
│   │   ├── MenuItem.java
│   │   ├── Table.java
│   │   └── Order.java
│   ├── repository/                    ← Database queries (like Laravel repositories)
│   │   ├── UserRepository.java
│   │   ├── MenuItemRepository.java
│   │   ├── TableRepository.java
│   │   └── OrderRepository.java
│   ├── service/                       ← Business logic (separates logic from controllers)
│   │   ├── UserService.java
│   │   ├── MenuItemService.java
│   │   ├── TableService.java
│   │   └── OrderService.java
│   ├── controller/                    ← REST endpoints (routes + handlers)
│   │   ├── HealthController.java
│   │   ├── MenuItemController.java
│   │   └── (more to be created)
│   ├── dto/                           ← Data Transfer Objects (request/response shapes)
│   ├── config/                        ← Configuration (CORS, Security, etc.)
│   ├── security/                      ← JWT filters, auth logic
│   ├── exception/                     ← Custom exceptions + error handlers
│   └── util/                          ← Helper functions (QR code, etc.)
└── src/main/resources/
    └── application.properties         ← Configuration file (like .env in PHP)
```

**Teaching Moment Given:**
Compared to PHP/Laravel:
| Spring Boot | Laravel/CodeIgniter | Purpose |
|-------------|---------------------|---------|
| `@Entity` Model | Eloquent Model | Database table mapping |
| `Repository` | Repository/Query Builder | Database queries |
| `Service` | Service Class | Business logic |
| `@RestController` | Controller | HTTP request handling |
| `@RequestMapping` | Route | URL routing |
| `application.properties` | `.env` | Configuration |

#### 2. **Dependencies (pom.xml)**
**Learned:** Like `composer.json` in PHP:

```xml
<dependencies>
    <!-- REST API -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- MongoDB -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>
    
    <!-- Security + JWT -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    
    <!-- Swagger API Docs -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.2.0</version>
    </dependency>
    
    <!-- Lombok (reduces boilerplate) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
</dependencies>
```

**Teaching Moment:** Each starter includes multiple related dependencies.

#### 3. **Configuration (application.properties)**
**Learned:** Like `.env` in PHP:

```properties
# Server Configuration
server.port=8080
spring.application.name=smartmenu-backend

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/smartmenu
spring.data.mongodb.database=smartmenu

# JWT Configuration
jwt.secret=YourSuperSecretKeyForJWTTokenGenerationChangeThisInProduction
jwt.expiration=86400000

# Swagger/OpenAPI
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html

# CORS (Allow React frontend)
cors.allowed-origins=http://localhost:3000,http://localhost:5173

# Logging
logging.level.root=INFO
logging.level.com.smartmenu=DEBUG
```

---

### **Phase 3: Models (Database Entities) (COMPLETED)**

#### **4 Models Created:**

##### 1. **User.java** (Authentication)
```java
@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    @Indexed(unique = true)
    private String username;
    
    private String password;  // Will be hashed with BCrypt
    private String fullName;
    
    @Indexed
    private String restaurantId;
    
    private UserRole role;  // ADMIN, STAFF, CUSTOMER
    private boolean active = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

public enum UserRole {
    ADMIN,
    STAFF,
    CUSTOMER
}
```

**Teaching Moment Given:**
- `@Document` = MongoDB collection (like `protected $table` in Eloquent)
- `@Id` = Primary key (auto-generated by MongoDB)
- `@Indexed` = Create index for faster queries (like database indexes)
- `@Data` (Lombok) = Auto-generates getters, setters, toString, equals, hashCode
- `@NoArgsConstructor` / `@AllArgsConstructor` (Lombok) = Auto-generate constructors

##### 2. **MenuItem.java** (Menu Management)
```java
@Document(collection = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {
    @Id
    private String id;
    
    @Indexed
    private String restaurantId;
    
    private String name;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private boolean available = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

##### 3. **Table.java** (QR Code Management)
```java
@Document(collection = "tables")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Table {
    @Id
    private String id;
    
    @Indexed
    private String restaurantId;
    
    private String tableNumber;
    private String qrCodeUrl;
    private String qrCodeData;
    private boolean active = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

##### 4. **Order.java** (Order Management)
```java
@Document(collection = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    private String id;
    
    @Indexed
    private String restaurantId;
    
    @Indexed
    private String tableId;
    
    private String customerName;
    private String customerPhone;
    
    private List<OrderItem> items;
    private Double totalAmount;
    private OrderStatus status;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class OrderItem {
    private String menuItemId;
    private String menuItemName;
    private Integer quantity;
    private Double price;
    private Double subtotal;
}

enum OrderStatus {
    PENDING,
    CONFIRMED,
    PREPARING,
    READY,
    DELIVERED,
    CANCELLED
}
```

**Teaching Moment Given:**
- Embedded documents (OrderItem inside Order) vs separate collections
- Enums for fixed choices (status, role)
- Timestamps with `@CreatedDate` and `@LastModifiedDate`

---

### **Phase 4: Repositories (Database Access) (COMPLETED)**

#### **4 Repositories Created:**

**Teaching Moment Given:**
- Repository = Interface (not a class!)
- Spring Data MongoDB auto-implements methods
- Just extend `MongoRepository<EntityType, IdType>`

```java
// UserRepository.java
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    List<User> findByRestaurantId(String restaurantId);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}

// MenuItemRepository.java
public interface MenuItemRepository extends MongoRepository<MenuItem, String> {
    List<MenuItem> findByRestaurantId(String restaurantId);
    List<MenuItem> findByRestaurantIdAndAvailable(String restaurantId, boolean available);
    List<MenuItem> findByRestaurantIdAndCategory(String restaurantId, String category);
}

// TableRepository.java
public interface TableRepository extends MongoRepository<Table, String> {
    List<Table> findByRestaurantId(String restaurantId);
    Optional<Table> findByRestaurantIdAndTableNumber(String restaurantId, String tableNumber);
    List<Table> findByRestaurantIdAndActive(String restaurantId, boolean active);
}

// OrderRepository.java
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByRestaurantId(String restaurantId);
    List<Order> findByRestaurantIdAndStatus(String restaurantId, OrderStatus status);
    List<Order> findByTableId(String tableId);
}
```

**Magic Methods Taught:**
| Method Pattern | Example | Generated Query |
|----------------|---------|-----------------|
| `findBy{Field}` | `findByEmail` | `db.users.find({email: value})` |
| `findBy{Field}And{Field}` | `findByRestaurantIdAndActive` | `db.tables.find({restaurantId: x, active: y})` |
| `existsBy{Field}` | `existsByEmail` | `db.users.exists({email: value})` |
| `countBy{Field}` | `countByRestaurantId` | `db.orders.count({restaurantId: x})` |

---

### **Phase 5: Services (Business Logic) (COMPLETED)**

#### **4 Service Classes Created:**

**Teaching Moment Given:**
- Services contain business logic (keep controllers thin)
- Use `@Service` annotation
- Inject repositories with `@Autowired` or constructor injection

```java
@Service
public class MenuItemService {
    private final MenuItemRepository repository;
    
    @Autowired
    public MenuItemService(MenuItemRepository repository) {
        this.repository = repository;
    }
    
    // Business logic methods will go here
}

// Similar for UserService, TableService, OrderService
```

---

### **Phase 6: Controllers (REST APIs) (COMPLETED)**

#### **HealthController.java (First Working API!)**

```java
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "SmartMenu Backend is running!");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "smartmenu-backend");
        response.put("version", "1.0.0");
        
        return ResponseEntity.ok(response);
    }
}
```

**Teaching Moment Given:**
- `@RestController` = Controller that returns JSON (not views)
- `@RequestMapping("/api")` = Base URL prefix
- `@GetMapping("/health")` = Handle GET requests to `/api/health`
- `ResponseEntity<T>` = HTTP response with status code + body

**Test Result:**
```bash
$ curl http://localhost:8080/api/health
{
    "message": "SmartMenu Backend is running!",
    "status": "UP",
    "timestamp": 1763653094242
}
```
✅ **SUCCESS!**

---

### **Phase 7: Understanding Spring Boot Startup (COMPLETED)**

**Learned:** How to read Spring Boot logs:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

Starting SmartMenuApplication...
✅ Bootstrapping Spring Data MongoDB repositories
✅ Found 4 MongoDB repository interfaces
✅ Tomcat initialized with port 8080
✅ MongoClient created with settings...
✅ Monitor thread successfully connected to server
✅ Tomcat started on port 8080
✅ Started SmartMenuApplication in 3.327 seconds

===========================================
✅ SmartMenu Backend Started Successfully!
📡 API: http://localhost:8080
📖 Swagger UI: http://localhost:8080/swagger-ui.html
🗄️  MongoDB: localhost:27017/smartmenu
===========================================
```

**Key Log Messages Taught:**
| Log Message | Meaning |
|-------------|---------|
| `Starting SmartMenuApplication` | App is booting |
| `Bootstrapping Spring Data MongoDB repositories` | Connecting to DB |
| `Found 4 MongoDB repository interfaces` | Our repositories loaded |
| `Tomcat initialized with port 8080` | Web server starting |
| `Monitor thread successfully connected` | ✅ MongoDB connected |
| `Started SmartMenuApplication in X seconds` | ✅ Ready! |

---

## 🏗️ Project Architecture

### **Technology Stack:**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend Framework** | Spring Boot 3.2.0 | REST API, business logic |
| **API Style** | Spring MVC (REST) | RESTful endpoints |
| **Database** | MongoDB 7.0 | NoSQL database |
| **ORM** | Spring Data MongoDB | Database access layer |
| **Authentication** | Spring Security + JWT | Secure authentication |
| **API Documentation** | Swagger/OpenAPI | Auto-generated docs |
| **Build Tool** | Maven 3.8.7 | Dependency management |
| **Runtime** | Java 21 (OpenJDK) | JVM runtime |
| **Container** | Docker | MongoDB containerization |
| **Frontend** | React.js (to be created) | User interface |
| **QR Code** | ZXing (to be implemented) | QR code generation |

### **System Architecture Diagram:**

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Admin Panel  │  │ Customer View│  │   Kitchen    │ │
│  │  Dashboard   │  │  (QR Menu)   │  │  Dashboard   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│          │                 │                 │          │
└──────────┼─────────────────┼─────────────────┼──────────┘
           │                 │                 │
           │   HTTP/JSON     │                 │
           ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND (Spring Boot REST API)             │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Controllers (REST Endpoints)          │ │
│  │    /api/auth  /api/menu  /api/orders  /api/qr     │ │
│  └───────────────────────┬────────────────────────────┘ │
│                          │                               │
│  ┌───────────────────────┴────────────────────────────┐ │
│  │         Services (Business Logic Layer)            │ │
│  │   UserService  MenuService  OrderService  etc.     │ │
│  └───────────────────────┬────────────────────────────┘ │
│                          │                               │
│  ┌───────────────────────┴────────────────────────────┐ │
│  │       Repositories (Data Access Layer)             │ │
│  │  UserRepo  MenuRepo  OrderRepo  TableRepo          │ │
│  └───────────────────────┬────────────────────────────┘ │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  MongoDB Database   │
              │  ┌───────────────┐  │
              │  │ users         │  │
              │  │ menu_items    │  │
              │  │ orders        │  │
              │  │ tables        │  │
              │  └───────────────┘  │
              └─────────────────────┘
```

---

## 📊 Current Project Status

### **✅ Completed:**
1. ✅ Environment setup (Java, Maven, MongoDB)
2. ✅ Spring Boot project initialization
3. ✅ Project structure created
4. ✅ Maven dependencies configured
5. ✅ Application configuration (application.properties)
6. ✅ 4 Models created (User, MenuItem, Table, Order)
7. ✅ 4 Repositories created (database access layer)
8. ✅ 4 Service classes created (business logic layer)
9. ✅ Health check API endpoint working
10. ✅ Backend compiles and runs successfully
11. ✅ MongoDB connection verified

### **🔄 In Progress:**
- MenuItem CRUD APIs (next step)

### **⏳ Not Started:**
1. ⏳ Complete REST APIs for all models
2. ⏳ JWT authentication implementation
3. ⏳ Spring Security configuration
4. ⏳ QR code generation (ZXing)
5. ⏳ File upload (menu item images)
6. ⏳ React frontend
7. ⏳ Integration testing
8. ⏳ Docker Compose for full stack
9. ⏳ Deployment configuration

---

## 🔄 PHP to Spring Boot Migration Strategy

### **Reference Project Analysis:**

**PHP Project Location:** `/var/www/html/smart-menu-qr/`

**Key PHP Files to Reference:**
```
smart-menu-qr/
├── db.php                  → Database connection (use as reference for models)
├── index.php               → Main entry (check routing)
├── register.php            → User registration (compare with User model)
├── room_services.php       → Menu items (compare with MenuItem model)
├── admin/                  → Admin panel (reference for features)
├── api/                    → API endpoints (migrate to Spring Boot controllers)
├── includes/               → Shared logic (migrate to services)
└── qr-gen/                 → QR generation (migrate to ZXing)
```

### **Migration Mapping:**

| PHP Concept | Spring Boot Equivalent | Status |
|-------------|------------------------|--------|
| **Database** | | |
| MySQL tables | MongoDB collections | ✅ Models created |
| PDO queries | Spring Data repositories | ✅ Repositories created |
| **Backend Logic** | | |
| `db.php` connection | `application.properties` | ✅ Complete |
| PHP functions | Service methods | ✅ Services created |
| `$_POST` / `$_GET` | `@RequestBody` / `@RequestParam` | ⏳ To implement |
| `json_encode()` | `@RestController` auto-serializes | ✅ Complete |
| **Authentication** | | |
| `$_SESSION` | JWT tokens | ⏳ To implement |
| Password hashing | BCryptPasswordEncoder | ⏳ To implement |
| **File Upload** | | |
| `move_uploaded_file()` | `MultipartFile` | ⏳ To implement |
| **QR Code** | | |
| PHP QR library | ZXing (Java library) | ⏳ To implement |

### **Feature Comparison Checklist:**

Check PHP project features and map to Spring Boot:

#### **User Management:**
- [ ] User registration
- [ ] User login
- [ ] Password reset
- [ ] User roles (admin, staff)

#### **Menu Management:**
- [ ] Add menu item
- [ ] Edit menu item
- [ ] Delete menu item
- [ ] Upload item image
- [ ] Toggle item availability

#### **Table & QR Management:**
- [ ] Create table
- [ ] Generate QR code
- [ ] Download/Print QR code

#### **Order Management:**
- [ ] Customer places order
- [ ] View pending orders
- [ ] Update order status
- [ ] Order history

**Teaching Strategy:**
1. Look at PHP feature in `smart-menu-qr`
2. Identify the business logic
3. Create Spring Boot equivalent
4. Test and compare behavior
5. Explain differences and improvements

---

## 🗺️ Teaching Roadmap (What's Next)

### **Phase 8: MenuItem CRUD APIs (NEXT - Recommended)**

**Learning Objectives:**
- Understand REST API design (GET, POST, PUT, DELETE)
- Learn request/response handling
- Practice service layer patterns
- Test APIs with curl and Swagger

**Files to Create:**
1. `MenuItemController.java` - REST endpoints
2. Complete `MenuItemService.java` - Business logic
3. DTOs for request/response

**APIs to Build:**
```
POST   /api/menu-items              → Create menu item
GET    /api/menu-items              → Get all items
GET    /api/menu-items/{id}         → Get one item
PUT    /api/menu-items/{id}         → Update item
DELETE /api/menu-items/{id}         → Delete item
PATCH  /api/menu-items/{id}/toggle  → Toggle availability
```

**Expected Learning:**
- `@PostMapping`, `@GetMapping`, `@PutMapping`, `@DeleteMapping`
- `@PathVariable` vs `@RequestParam`
- `@RequestBody` for JSON payloads
- HTTP status codes (200, 201, 404, 400)
- Exception handling

---

### **Phase 9: JWT Authentication**

**Learning Objectives:**
- Understand JWT structure (header.payload.signature)
- Implement Spring Security filter chain
- Create login/register endpoints
- Protect endpoints with `@PreAuthorize`

**Files to Create:**
1. `AuthController.java` - Login/register endpoints
2. `JwtUtils.java` - Token generation/validation
3. `JwtAuthenticationFilter.java` - Request filter
4. `SecurityConfig.java` - Security configuration
5. DTOs: `LoginRequest`, `RegisterRequest`, `JwtResponse`

**APIs to Build:**
```
POST /api/auth/register  → Create new user
POST /api/auth/login     → Get JWT token
POST /api/auth/refresh   → Refresh token
GET  /api/auth/me        → Get current user
```

**Expected Learning:**
- BCrypt password hashing
- JWT token structure
- Filter chains in Spring Security
- Role-based access control (RBAC)

---

### **Phase 10: React Frontend Setup**

**Learning Objectives:**
- Set up React with Vite
- Create project structure
- Install dependencies (axios, react-router, etc.)
- Make first API call from React

**Steps:**
1. `npm create vite@latest frontend -- --template react`
2. Install: axios, react-router-dom, tailwindcss
3. Set up folder structure
4. Create first component
5. Call backend health API

**Expected Learning:**
- React functional components
- useState, useEffect hooks
- Axios for API calls
- CORS configuration
- Environment variables

---

### **Phase 11: Admin Dashboard (React)**

**Learning Objectives:**
- Build admin panel UI
- Implement CRUD operations in React
- Handle forms and validation
- Manage authentication state

**Components to Build:**
1. Login page
2. Dashboard layout
3. Menu item list
4. Add/Edit menu item form
5. Image upload component

---

### **Phase 12: Customer Menu View**

**Learning Objectives:**
- Public-facing UI (no auth)
- Display menu items
- Shopping cart functionality
- Place order

---

### **Phase 13: QR Code Generation**

**Learning Objectives:**
- Use ZXing library
- Generate QR codes on backend
- Download as PNG/PDF
- Integrate with Table model

---

### **Phase 14: Kitchen Dashboard**

**Learning Objectives:**
- Real-time order updates
- Order status management
- WebSocket for live updates (optional)

---

### **Phase 15: Docker & Deployment**

**Learning Objectives:**
- Create Dockerfiles
- Docker Compose for full stack
- Build JAR file
- Deploy to cloud (optional)

---

## 🎓 How to Continue Teaching

### **Teaching Style That Works:**

1. **Hands-On First:**
   - Create files together
   - Run commands together
   - See errors and fix them together

2. **Explain After:**
   - "We just did X, here's why..."
   - Show logs/output
   - Explain what happened

3. **Compare to PHP:**
   - "In PHP you did X, in Spring Boot you do Y"
   - Show equivalent code side-by-side

4. **Challenge Assumptions:**
   - "You might think X, but actually Y is better because..."
   - Suggest best practices
   - Explain trade-offs

### **Step-by-Step Teaching Process:**

#### **For Each New Feature:**

1. **Show the Goal:**
   ```
   "We're going to build the MenuItem API. 
   It will let you create, read, update, delete menu items."
   ```

2. **Reference PHP Project:**
   ```bash
   cd /var/www/html/smart-menu-qr/
   # Show relevant PHP file
   cat room_services.php
   ```

3. **Design the API:**
   ```
   POST   /api/menu-items
   GET    /api/menu-items
   GET    /api/menu-items/{id}
   PUT    /api/menu-items/{id}
   DELETE /api/menu-items/{id}
   ```

4. **Create DTO (Request/Response):**
   ```java
   // Show why DTOs are better than exposing models
   ```

5. **Implement Service Method:**
   ```java
   // Business logic here
   ```

6. **Implement Controller Endpoint:**
   ```java
   // REST endpoint here
   ```

7. **Test Together:**
   ```bash
   curl -X POST http://localhost:8080/api/menu-items \
     -H "Content-Type: application/json" \
     -d '{"name":"Pizza","price":12.99}'
   ```

8. **Explain What Happened:**
   - Show logs
   - Show database
   - Explain flow: Controller → Service → Repository → MongoDB

9. **Challenge:**
   ```
   "Now try adding validation. What if price is negative?"
   ```

10. **Document:**
    - Open Swagger UI
    - Show auto-generated docs
    - Test in Swagger

### **When Errors Occur (Teaching Moments):**

❌ **Student Gets Error:**
```
Error: No plugin found for prefix 'spring-boot'
```

✅ **Your Response:**
1. Don't just fix it
2. Explain WHY it happened
3. Show the correct way
4. Give them the command to run
5. Watch them do it
6. Confirm understanding

### **Checking Understanding:**

Ask these questions regularly:
- "What do you think this code does?"
- "How is this different from PHP?"
- "What would happen if we changed X to Y?"
- "Can you predict what the log will show?"

---

## 💡 Common Teaching Moments

### **1. Maven vs Composer**
```
Student: "Why do I need to run mvn clean install?"

Teacher: "In PHP/Composer, you run composer install once.
In Java/Maven, you compile code to bytecode (.class files).
'mvn clean install' = delete old compiled files + compile + test + package.
Think of it as: clean = rm vendor/, install = composer install + build"
```

### **2. Annotations**
```java
@RestController  // This class handles HTTP requests and returns JSON
@Service         // This class contains business logic
@Repository      // This interface accesses the database
```

"Annotations = metadata that tells Spring what this class does.
Spring reads annotations at startup and configures everything automatically.
It's like PHP attributes or doc comments, but more powerful."

### **3. Dependency Injection**
```java
@Autowired
private MenuItemRepository repository;

// Spring automatically creates and injects the repository
```

"You don't use 'new' keyword in Spring Boot.
Spring manages object creation and lifecycle.
This is called Inversion of Control (IoC).
Think of it like Laravel's service container."

### **4. REST API Design**
```
GET    = Read (no body)
POST   = Create (body required)
PUT    = Update full resource (body required)
PATCH  = Update partial resource (body required)
DELETE = Delete (no body)
```

"Use correct HTTP methods.
Use correct status codes: 200 OK, 201 Created, 404 Not Found, 400 Bad Request"

### **5. MongoDB vs MySQL**
```
MySQL Table       → MongoDB Collection
Row               → Document (JSON-like)
Primary Key (int) → _id (string)
Foreign Key       → Store ID as string
JOIN              → Embed or lookup

Example:
MySQL: SELECT * FROM menu_items WHERE restaurant_id = 1
MongoDB: db.menu_items.find({restaurantId: "abc123"})
```

### **6. Java vs PHP Types**
```
PHP                 → Java
string             → String
int                → Integer / int
float              → Double / double
array              → List<T>
associative array  → Map<K,V>
null               → null (but avoid - use Optional<T>)
boolean            → Boolean / boolean
```

---

## 🧪 Testing & Verification

### **How to Test Each Feature:**

#### **1. Health Check (Already Working)**
```bash
curl http://localhost:8080/api/health
# Should return: {"status":"UP","message":"..."}
```

#### **2. MongoDB Connection**
```bash
sudo docker exec -it mongodb mongosh
use smartmenu
db.menu_items.find()
```

#### **3. Swagger UI**
Open in browser:
```
http://localhost:8080/swagger-ui.html
```

#### **4. Create Menu Item (After Phase 8)**
```bash
curl -X POST http://localhost:8080/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "test-restaurant",
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza",
    "price": 12.99,
    "category": "Pizza",
    "imageUrl": "http://example.com/image.jpg",
    "available": true
  }'
```

#### **5. Get All Menu Items**
```bash
curl http://localhost:8080/api/menu-items
```

#### **6. Login (After Phase 9)**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'

# Should return JWT token
```

### **Verification Checklist:**

Before moving to next phase, verify:
- [ ] Code compiles without errors
- [ ] Application starts successfully
- [ ] API endpoint returns expected response
- [ ] Data is saved in MongoDB
- [ ] Logs show correct behavior
- [ ] Student can explain what was built
- [ ] Student can test it independently

---

## 📝 Quick Reference Commands

### **Backend (Spring Boot)**
```bash
# Navigate to backend
cd /var/www/html/smart-menu-saas/backend

# Compile and run
mvn spring-boot:run

# Clean and rebuild
mvn clean install

# Run tests
mvn test

# Create JAR file
mvn package

# Run JAR file
java -jar target/smartmenu-backend-1.0.0.jar

# Run in background
nohup mvn spring-boot:run > /tmp/backend.log 2>&1 &

# Check if running
ps aux | grep smartmenu

# View logs
tail -f /tmp/backend.log

# Stop background process
pkill -f smartmenu
```

### **MongoDB (Docker)**
```bash
# Start container
sudo docker start mongodb

# Stop container
sudo docker stop mongodb

# View logs
sudo docker logs -f mongodb

# Execute mongosh
sudo docker exec -it mongodb mongosh

# Inside mongosh:
use smartmenu
db.menu_items.find().pretty()
db.users.find().pretty()
db.orders.find().pretty()
exit
```

### **Testing APIs**
```bash
# Health check
curl http://localhost:8080/api/health

# POST with JSON
curl -X POST http://localhost:8080/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":9.99}'

# GET with pretty JSON
curl -s http://localhost:8080/api/menu-items | python3 -m json.tool

# PUT request
curl -X PUT http://localhost:8080/api/menu-items/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated","price":14.99}'

# DELETE request
curl -X DELETE http://localhost:8080/api/menu-items/123

# With authentication (after JWT)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/menu-items
```

### **Frontend (React - Not Created Yet)**
```bash
# Create React app
cd /var/www/html/smart-menu-saas
npm create vite@latest frontend -- --template react

# Navigate and install
cd frontend
npm install

# Install additional dependencies
npm install axios react-router-dom

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 🎯 Student's Current Level

**Skill Assessment:**
- ✅ **Environment Setup:** Comfortable with Linux commands
- ✅ **Maven Basics:** Understands commands and directory context
- ✅ **Spring Boot Structure:** Understands MVC + Service architecture
- ✅ **Models:** Can create entities with annotations
- ✅ **Repositories:** Understands Spring Data MongoDB pattern
- ✅ **Services:** Understands separation of concerns
- ✅ **Controllers:** Created first REST endpoint
- ⏳ **REST APIs:** Ready to learn CRUD operations (next)
- ⏳ **Security:** Not yet covered
- ⏳ **React:** Not yet covered

**Ready For:**
- ✅ Building complete CRUD APIs
- ✅ Learning request/response handling
- ✅ Testing with curl and Swagger
- ⏳ JWT authentication (after CRUD)
- ⏳ React frontend (after authentication)

---

## 📚 Additional Resources for Teacher

### **Spring Boot Documentation:**
- Official Docs: https://spring.io/projects/spring-boot
- Spring Data MongoDB: https://spring.io/projects/spring-data-mongodb
- Spring Security: https://spring.io/projects/spring-security

### **Code Examples:**
- Reference existing PHP project: `/var/www/html/smart-menu-qr/`
- Current project: `/var/www/html/smart-menu-saas/backend/`

### **Testing Tools:**
- Swagger UI: http://localhost:8080/swagger-ui.html
- MongoDB Shell: `sudo docker exec -it mongodb mongosh`
- Curl commands (see Quick Reference above)

---

## 🎓 Teaching Tips

### **DO:**
- ✅ Show logs and explain what they mean
- ✅ Make mistakes intentionally to show debugging
- ✅ Compare to PHP concepts constantly
- ✅ Test together after each feature
- ✅ Explain WHY, not just WHAT
- ✅ Let student run commands themselves
- ✅ Challenge their assumptions
- ✅ Celebrate small wins

### **DON'T:**
- ❌ Skip error handling
- ❌ Move too fast without checking understanding
- ❌ Give answers without explanation
- ❌ Assume prior Java knowledge
- ❌ Ignore the PHP reference project
- ❌ Forget to test after changes

---

## 📖 Next Session Plan

**Start With:**
1. Review what was learned (5 min)
2. Check backend is running
3. Test health endpoint together

**Main Teaching:**
4. Build MenuItem CRUD APIs (Phase 8)
   - Create MenuItemController
   - Implement service methods
   - Test each endpoint
   - Show Swagger docs

**End With:**
5. Test all endpoints with curl
6. Show data in MongoDB
7. Ask comprehension questions
8. Preview next topic (Authentication)

---

## 📞 Questions to Ask Student

Before starting each session:
1. "Did you try anything since last time?"
2. "Any errors or confusion?"
3. "What do you remember about X?"

During teaching:
1. "What do you think this does?"
2. "How would you do this in PHP?"
3. "What will happen if we run this?"

After completing a feature:
1. "Can you explain what we just built?"
2. "How would you test this?"
3. "What questions do you have?"

---

## 🏁 Project Success Criteria

**When is this project "complete"?**

### **Minimum Viable Product (MVP):**
- [ ] User can register/login
- [ ] Admin can create/edit menu items
- [ ] Admin can generate QR codes
- [ ] Customer can scan QR and see menu
- [ ] Customer can place order
- [ ] Kitchen can view and update orders
- [ ] Basic React UI for all features

### **Job-Ready Features:**
- [ ] All REST APIs documented (Swagger)
- [ ] JWT authentication working
- [ ] File upload for images
- [ ] Responsive React UI
- [ ] Docker setup complete
- [ ] Code is clean and commented
- [ ] README with setup instructions

### **Portfolio-Ready:**
- [ ] Deployed online (optional)
- [ ] GitHub repository public
- [ ] Demo video/screenshots
- [ ] Professional README
- [ ] Can explain architecture in interview

---

## 💪 Student Progress Tracking

Use this checklist to track learning:

### **Spring Boot Concepts:**
- [x] Maven project structure
- [x] Dependencies (pom.xml)
- [x] Application properties
- [x] Models with annotations
- [x] Repositories (Spring Data)
- [x] Services (business logic)
- [x] Controllers (REST endpoints)
- [ ] DTOs (request/response)
- [ ] Exception handling
- [ ] Validation (@Valid)
- [ ] JWT authentication
- [ ] Spring Security configuration
- [ ] File upload
- [ ] Custom queries

### **MongoDB Concepts:**
- [x] Document-oriented database
- [x] Collections vs tables
- [x] @Document annotation
- [x] MongoRepository basics
- [ ] Aggregation pipelines
- [ ] Indexes and performance
- [ ] Embedded documents
- [ ] References between documents

### **REST API Concepts:**
- [x] HTTP methods (GET, POST, PUT, DELETE)
- [x] Status codes (200, 201, 404, etc.)
- [x] JSON request/response
- [ ] Path variables vs request params
- [ ] Request body validation
- [ ] Error responses
- [ ] API documentation (Swagger)
- [ ] API versioning

### **React Concepts (To Learn):**
- [ ] Functional components
- [ ] useState, useEffect hooks
- [ ] API calls with axios
- [ ] React Router
- [ ] Form handling
- [ ] Authentication state
- [ ] Context API / Redux

---

## 🎉 Conclusion

This student is motivated, eager to learn, and has a clear goal (job requirements).

**Key Success Factors:**
1. ✅ Has working PHP project as reference
2. ✅ Environment is set up correctly
3. ✅ Basic foundation is solid
4. ✅ Wants to be challenged
5. ✅ Prefers hands-on learning

**Recommended Next Steps:**
1. Build MenuItem CRUD APIs (Phase 8)
2. Test thoroughly with curl and Swagger
3. Implement JWT authentication (Phase 9)
4. Start React frontend (Phase 10)

**Timeline Estimate:**
- Phase 8 (CRUD APIs): 2-3 sessions
- Phase 9 (JWT Auth): 2-3 sessions
- Phase 10-11 (React Frontend): 4-5 sessions
- Phase 12-14 (Complete Features): 3-4 sessions
- Phase 15 (Docker/Deploy): 1-2 sessions

**Total:** ~15-20 teaching sessions to completion

---

## 📞 Contact & Support

**Project Location:** `/var/www/html/smart-menu-saas/`

**Reference Project:** `/var/www/html/smart-menu-qr/`

**Backend URL:** http://localhost:8080

**MongoDB:** localhost:27017/smartmenu

**Swagger UI:** http://localhost:8080/swagger-ui.html

**Git Repository:** LWENA27/KJ (branch: main)

---

**Last Updated:** November 20, 2025  
**Current Phase:** Ready for Phase 8 (MenuItem CRUD APIs)  
**Backend Status:** ✅ Running and tested  
**Student Level:** Beginner-Intermediate (PHP → Java transition)

---

*This guide should be updated after each major milestone or when new concepts are taught.*
