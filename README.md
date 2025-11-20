# 🍽️ SmartMenu SaaS

> A full-stack QR Restaurant Menu & Ordering System built with Spring Boot, React, and MongoDB

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-blue.svg)](https://openjdk.java.net/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

## 📋 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 About

SmartMenu is a modern SaaS solution that allows restaurants to:
- Create digital menus accessible via QR codes
- Accept orders from customers' smartphones
- Manage orders in real-time through a kitchen dashboard
- Handle multiple restaurants (multi-tenant architecture)

**This project is a learning journey from PHP/MySQL to Spring Boot/MongoDB stack.**

---

## ✨ Features

### 👨‍💼 Admin Panel
- ✅ User authentication (JWT)
- ✅ Menu item management (CRUD)
- ✅ Table management
- ✅ QR code generation
- ✅ Order management
- ✅ Restaurant settings

### 👨‍🍳 Kitchen Dashboard
- ✅ Real-time order notifications
- ✅ Order status updates (Pending → Preparing → Ready → Delivered)
- ✅ Order history

### 📱 Customer View (QR Menu)
- ✅ Browse menu by category
- ✅ View item details
- ✅ Add items to cart
- ✅ Place order (name + phone)
- ✅ Order confirmation

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Java** | 21 | Programming language |
| **Spring Boot** | 3.2.0 | Backend framework |
| **Spring Data MongoDB** | 3.2.0 | Database ORM |
| **Spring Security** | 6.1.1 | Authentication & Authorization |
| **JWT** | 0.11.5 | Stateless authentication |
| **Maven** | 3.8.7 | Build tool |
| **Swagger/OpenAPI** | 2.2.0 | API documentation |
| **Lombok** | 1.18.30 | Reduce boilerplate code |

### Database
| Technology | Version | Purpose |
|-----------|---------|---------|
| **MongoDB** | 7.0 | NoSQL database |
| **Docker** | Latest | MongoDB containerization |

### Frontend (Coming Soon)
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.x | UI framework |
| **Vite** | 4.x | Build tool |
| **Axios** | 1.x | HTTP client |
| **React Router** | 6.x | Routing |
| **TailwindCSS** | 3.x | Styling |

---

## 📁 Project Structure

```
smart-menu-saas/
├── backend/                           # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/smartmenu/
│   │   │   │   ├── SmartMenuApplication.java    # Main entry point
│   │   │   │   ├── model/                        # Database entities
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── MenuItem.java
│   │   │   │   │   ├── Table.java
│   │   │   │   │   └── Order.java
│   │   │   │   ├── repository/                   # Data access layer
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── MenuItemRepository.java
│   │   │   │   │   ├── TableRepository.java
│   │   │   │   │   └── OrderRepository.java
│   │   │   │   ├── service/                      # Business logic
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   ├── MenuItemService.java
│   │   │   │   │   ├── TableService.java
│   │   │   │   │   └── OrderService.java
│   │   │   │   ├── controller/                   # REST endpoints
│   │   │   │   │   ├── HealthController.java
│   │   │   │   │   ├── MenuItemController.java  # (to be created)
│   │   │   │   │   └── ...
│   │   │   │   ├── dto/                          # Request/Response objects
│   │   │   │   ├── config/                       # Configuration classes
│   │   │   │   ├── security/                     # Security & JWT
│   │   │   │   ├── exception/                    # Exception handlers
│   │   │   │   └── util/                         # Utility classes
│   │   │   └── resources/
│   │   │       └── application.properties        # App configuration
│   │   └── test/                                 # Unit & integration tests
│   ├── pom.xml                                   # Maven dependencies
│   └── Dockerfile                                # Docker build
├── frontend/                          # React frontend (coming soon)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml                 # Run full stack
├── TEACHING_GUIDE.md                  # Comprehensive teaching documentation
├── QUICK_START_TEACHING.md            # Quick reference for teachers
└── README.md                          # This file
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- **Java 21** or higher
- **Maven 3.8+**
- **Docker** (for MongoDB)
- **Node.js 18+** (for frontend, later)
- **Git**

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/LWENA27/KJ.git
cd smart-menu-saas
```

#### 2. Start MongoDB (Docker)
```bash
# Pull and run MongoDB container
sudo docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v ~/mongo-data:/data/db \
  mongo:7.0

# Verify it's running
sudo docker ps | grep mongodb
```

#### 3. Configure Backend
```bash
cd backend

# Update application.properties if needed
# Default config should work out of the box:
# - MongoDB: localhost:27017/smartmenu
# - Server port: 8080
```

#### 4. Build & Run Backend
```bash
# Build project
mvn clean install -DskipTests

# Run application
mvn spring-boot:run

# Or run in background
nohup mvn spring-boot:run > /tmp/smartmenu-backend.log 2>&1 &
```

#### 5. Verify Backend is Running
```bash
# Health check
curl http://localhost:8080/api/health

# Expected response:
# {
#   "status": "UP",
#   "message": "SmartMenu Backend is running!",
#   "timestamp": 1763653094242,
#   "service": "smartmenu-backend",
#   "version": "1.0.0"
# }
```

#### 6. Access API Documentation
Open in your browser:
```
http://localhost:8080/swagger-ui.html
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Current Endpoints

#### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "UP",
  "message": "SmartMenu Backend is running!",
  "timestamp": 1763653094242,
  "service": "smartmenu-backend",
  "version": "1.0.0"
}
```

### Coming Soon

#### Menu Items
```http
POST   /api/menu-items              # Create menu item
GET    /api/menu-items              # Get all menu items
GET    /api/menu-items/{id}         # Get single menu item
PUT    /api/menu-items/{id}         # Update menu item
DELETE /api/menu-items/{id}         # Delete menu item
PATCH  /api/menu-items/{id}/toggle  # Toggle availability
```

#### Authentication
```http
POST /api/auth/register  # Register new user
POST /api/auth/login     # Login & get JWT token
POST /api/auth/refresh   # Refresh JWT token
GET  /api/auth/me        # Get current user
```

#### Tables
```http
POST   /api/tables       # Create table
GET    /api/tables       # Get all tables
GET    /api/tables/{id}  # Get single table
PUT    /api/tables/{id}  # Update table
DELETE /api/tables/{id}  # Delete table
```

#### Orders
```http
POST   /api/orders       # Create order
GET    /api/orders       # Get all orders
GET    /api/orders/{id}  # Get single order
PATCH  /api/orders/{id}  # Update order status
```

For full interactive API documentation, visit:
```
http://localhost:8080/swagger-ui.html
```

---

## 🔧 Development

### Running the Backend

#### Development Mode (with hot reload)
```bash
cd backend
mvn spring-boot:run
```

#### Production Mode (JAR file)
```bash
# Build JAR
mvn clean package -DskipTests

# Run JAR
java -jar target/smartmenu-backend-1.0.0.jar
```

### Database Management

#### Access MongoDB Shell
```bash
# Enter MongoDB container
sudo docker exec -it mongodb mongosh

# Inside mongosh:
use smartmenu

# View collections
show collections

# Query data
db.menu_items.find().pretty()
db.users.find().pretty()
db.orders.find().pretty()
db.tables.find().pretty()

# Exit
exit
```

#### Backup Database
```bash
# Backup
sudo docker exec mongodb mongodump --db smartmenu --out /backup

# Restore
sudo docker exec mongodb mongorestore --db smartmenu /backup/smartmenu
```

### Code Style

This project follows:
- **Java:** Google Java Style Guide
- **Spring Boot:** Official Spring conventions
- **REST:** RESTful API best practices

### Useful Maven Commands

```bash
# Clean build
mvn clean

# Compile only
mvn compile

# Run tests
mvn test

# Package (create JAR)
mvn package

# Install to local repo
mvn install

# Clean + compile + test + package
mvn clean install

# Skip tests
mvn clean install -DskipTests

# Run specific test
mvn test -Dtest=MenuItemServiceTest

# Show dependency tree
mvn dependency:tree
```

---

## 🧪 Testing

### Run All Tests
```bash
cd backend
mvn test
```

### Test Coverage
```bash
mvn clean test jacoco:report

# View report:
open target/site/jacoco/index.html
```

### Manual API Testing

#### Using curl
```bash
# Health check
curl http://localhost:8080/api/health

# Create menu item (when endpoint is ready)
curl -X POST http://localhost:8080/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "test-restaurant",
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza",
    "price": 12.99,
    "category": "Pizza",
    "imageUrl": "http://example.com/pizza.jpg",
    "available": true
  }'

# Get all menu items
curl http://localhost:8080/api/menu-items

# Pretty print JSON
curl -s http://localhost:8080/api/menu-items | python3 -m json.tool
```

#### Using Swagger UI
1. Open http://localhost:8080/swagger-ui.html
2. Select an endpoint
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"

---

## 🐳 Docker

### Using Docker Compose (Full Stack)

Coming soon:
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up -d --build
```

---

## 🚀 Deployment

### Build for Production

```bash
cd backend

# Build JAR
mvn clean package -DskipTests

# JAR location
ls target/smartmenu-backend-1.0.0.jar
```

### Deploy to Server

#### Option 1: Run JAR directly
```bash
# Copy JAR to server
scp target/smartmenu-backend-1.0.0.jar user@server:/opt/smartmenu/

# SSH to server
ssh user@server

# Run with systemd (recommended)
sudo nano /etc/systemd/system/smartmenu.service
```

Example systemd service file:
```ini
[Unit]
Description=SmartMenu Backend
After=network.target

[Service]
Type=simple
User=smartmenu
WorkingDirectory=/opt/smartmenu
ExecStart=/usr/bin/java -jar /opt/smartmenu/smartmenu-backend-1.0.0.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl daemon-reload
sudo systemctl start smartmenu
sudo systemctl enable smartmenu
sudo systemctl status smartmenu
```

#### Option 2: Docker
```bash
# Build Docker image
docker build -t smartmenu-backend .

# Run container
docker run -d \
  --name smartmenu-backend \
  -p 8080:8080 \
  --link mongodb:mongodb \
  smartmenu-backend
```

---

## 🤝 Contributing

This is a learning project, but contributions are welcome!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Workflow

1. Check existing issues or create a new one
2. Discuss the proposed change
3. Follow the code style guidelines
4. Write tests for new features
5. Update documentation
6. Submit PR for review

---

## 📖 Documentation

- **[Teaching Guide](TEACHING_GUIDE.md)** - Comprehensive guide for teachers/mentors
- **[Quick Start Teaching](QUICK_START_TEACHING.md)** - Quick reference for teaching sessions
- **[API Docs](http://localhost:8080/swagger-ui.html)** - Interactive API documentation (when running)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**LWENA27**
- GitHub: [@LWENA27](https://github.com/LWENA27)
- Project: [KJ Repository](https://github.com/LWENA27/KJ)

---

## 🙏 Acknowledgments

- **Reference Project:** PHP version at `/var/www/html/smart-menu-qr/`
- **Inspired by:** Real-world job requirements for Spring Boot developers
- **Learning Journey:** PHP/MySQL → Spring Boot/MongoDB transition

---

## 📊 Project Status

### Current Phase: **Foundation Complete ✅**

- [x] Environment setup
- [x] Spring Boot project initialization
- [x] Database models (User, MenuItem, Table, Order)
- [x] Repository layer
- [x] Service layer
- [x] Health check API
- [ ] MenuItem CRUD APIs (in progress)
- [ ] Authentication (JWT)
- [ ] React frontend
- [ ] QR code generation
- [ ] Full deployment

### Version: 1.0.0-SNAPSHOT

---

## 📞 Support

For questions or issues:
1. Check the [Teaching Guide](TEACHING_GUIDE.md)
2. Check the [Issues](https://github.com/LWENA27/KJ/issues) page
3. Create a new issue with detailed description

---

## 🎯 Roadmap

### Phase 1: Backend Foundation ✅
- [x] Setup environment
- [x] Create models & repositories
- [x] Create services
- [x] First API endpoint

### Phase 2: Complete Backend (In Progress)
- [ ] MenuItem CRUD APIs
- [ ] User authentication (JWT)
- [ ] Order management APIs
- [ ] Table & QR code APIs
- [ ] File upload (images)

### Phase 3: Frontend
- [ ] React setup
- [ ] Admin dashboard
- [ ] Customer menu view
- [ ] Kitchen dashboard

### Phase 4: Advanced Features
- [ ] Real-time updates (WebSocket)
- [ ] Payment integration
- [ ] Analytics dashboard
- [ ] Email notifications

### Phase 5: Production
- [ ] Full test coverage
- [ ] Docker Compose setup
- [ ] CI/CD pipeline
- [ ] Cloud deployment

---

**Built with ❤️ as a learning project to master Spring Boot, React, and MongoDB**

*Last Updated: November 20, 2025*
