# 🎓 Full Stack Application Guide - SmartMenu SaaS

## 📚 Complete Learning Guide: Frontend to Database

This guide shows you **exactly** how your full-stack application works from the browser all the way to the database.

---

## 🏗️ Architecture Overview

```
┌─────────────┐      HTTP/REST       ┌─────────────┐      MongoDB       ┌─────────────┐
│   Browser   │ ←─────────────────→ │   Backend   │ ←─────────────→   │   MongoDB   │
│  (React UI) │      JSON + JWT      │ (Spring Boot)│    Documents      │  (Database) │
│ Port: 5173  │                      │  Port: 8080 │                   │ Port: 27017 │
└─────────────┘                      └─────────────┘                   └─────────────┘
```

### 🔄 Request Flow Example (Creating a Table)

1. **User Action**: Clicks "Add Table" button on QR Codes page
2. **Frontend**: `QRCodes.jsx` calls `api.post('/tables', data)`
3. **API Client**: `api.js` adds JWT token to request headers
4. **Network**: HTTP POST request sent to `http://localhost:8080/api/tables`
5. **Backend Security**: `JwtAuthenticationFilter` validates the JWT token
6. **Controller**: `TableController.createTable()` receives the request
7. **Repository**: `TableRepository.save()` writes to MongoDB
8. **Database**: MongoDB stores the document in `smartmenu.tables` collection
9. **Response**: Backend returns the saved table as JSON
10. **Frontend**: Updates UI with the new table

---

## 🚀 Starting the Application

### Prerequisites
- Java 21+ installed
- Node.js 18+ installed
- Docker (for MongoDB)

### Step 1: Start MongoDB
```bash
# Start MongoDB container
docker run -d --name smartmenu-mongo -p 27017:27017 -v smartmenu_mongo:/data/db mongo:6.0

# Verify it's running
docker ps | grep smartmenu-mongo
```

### Step 2: Start Backend (Spring Boot)
```bash
# From project root
cd backend
mvn spring-boot:run

# OR run the built JAR
java -jar backend/target/smartmenu-backend-1.0.0.jar
```

**Expected output:**
```
✅ SmartMenu Backend Started Successfully!
📡 API: http://localhost:8080
📖 Swagger UI: http://localhost:8080/swagger-ui.html
🗄️  MongoDB: localhost:27017/smartmenu
```

### Step 3: Start Frontend (React + Vite)
```bash
# From project root
cd frontend-react
npm install  # First time only
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Step 4: Access the Application
Open your browser: **http://localhost:5173**

---

## 🔐 Authentication Flow (Login)

### How Login Works

#### 1. User Enters Credentials
```javascript
// In Login.jsx
username: "admin"
password: "admin123"
```

#### 2. Frontend Calls Backend
```javascript
// api.js
const response = await api.post('/auth/login', {
    username: 'admin',
    password: 'admin123'
});
```

#### 3. Backend Validates Credentials
```java
// AuthService.java
// 1. Check username & password against database
// 2. If valid, generate JWT token
String jwt = jwtUtil.generateToken(username);
```

#### 4. Backend Returns JWT Token
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": "6920b160af94ea6298b3ab11",
  "username": "admin",
  "email": "admin@example.com",
  "role": "ROLE_RESTAURANT_OWNER"
}
```

#### 5. Frontend Saves Token
```javascript
// api.js - saveUserData()
localStorage.setItem('jwt_token', data.token);
localStorage.setItem('user_id', data.id);
localStorage.setItem('username', data.username);
```

#### 6. Future Requests Include Token
```javascript
// api.js - Request Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

### Test Login via Terminal
```bash
# Register a user (first time only)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "fullName": "Admin User"
  }'

# Login and get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc2Mzc1MTk2MywiZXhwIjoxNzYzODM4MzYzfQ.BWixFSLC5V1Y-EiXPuyo3ZKrOdaZsRtlFwimpEeH_CdAia1J3eKbWe7Kzre5O9XbuW71PNcG8zD_9PDLNWHIYw",
  "type": "Bearer",
  "id": "6920b160af94ea6298b3ab11",
  "username": "admin",
  "email": "admin@example.com",
  "role": "ROLE_RESTAURANT_OWNER"
}
```

---

## 📋 QR Code Management Flow

### Creating a Table/Room

#### 1. Frontend Form Submission
```javascript
// QRCodes.jsx
const handleAdd = async (e) => {
    e.preventDefault();
    const payload = {
        tableNumber: 'T1',
        isRoom: false,
        location: 'Main Hall'
    };
    const resp = await api.post('/tables', payload);
    setTables(prev => [...prev, resp.data]);
};
```

#### 2. Backend Receives Request
```java
// TableController.java
@PostMapping
public ResponseEntity<?> createTable(
    @AuthenticationPrincipal UserDetailsImpl currentUser,
    @RequestBody Map<String, Object> body
) {
    String userId = currentUser.getId(); // From JWT token
    String tableNumber = body.get("tableNumber");
    boolean isRoom = body.get("isRoom");
    String location = body.get("location");
    
    // Generate unique QR code ID
    String qrCodeId = UUID.randomUUID().toString();
    String qrCodeUrl = "/index.html?table=" + qrCodeId;
    
    // Create and save table
    Table table = new Table();
    table.setUserId(userId);
    table.setTableNumber(tableNumber);
    table.setQrCodeId(qrCodeId);
    table.setQrCodeUrl(qrCodeUrl);
    // ... set other fields
    
    Table saved = tableRepository.save(table);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}
```

#### 3. MongoDB Document Created
```json
{
  "_id": "6920b81caf94ea6298b3ab12",
  "userId": "6920b160af94ea6298b3ab11",
  "tableNumber": "T1",
  "qrCodeId": "d1c98b06-351b-4f51-ae42-c66c0e381280",
  "qrCodeUrl": "/index.html?table=d1c98b06-351b-4f51-ae42-c66c0e381280",
  "qrCodeImage": "",
  "room": false,
  "location": "Main Hall",
  "active": true,
  "createdAt": "2025-11-21T19:06:03.999Z",
  "_class": "com.smartmenu.model.Table"
}
```

#### 4. Frontend Displays New Table
```javascript
// QRCodes.jsx renders the table list
{tables.map(table => (
    <tr key={table.id}>
        <td>{table.tableNumber}</td>
        <td>{table.room ? t('tableTypeRoom') : t('tableTypeTable')}</td>
        <td>{table.location}</td>
        <td>
            <img src={generateQR(table.qrCodeId)} alt="QR Code" />
        </td>
        <td>
            <button onClick={() => handleDelete(table.id)}>Delete</button>
        </td>
    </tr>
))}
```

### Test via Terminal
```bash
# 1. Login and save token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 2. Create a table
curl -X POST http://localhost:8080/api/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "tableNumber": "T1",
    "isRoom": false,
    "location": "Main Hall"
  }'

# 3. List all tables
curl -X GET http://localhost:8080/api/tables \
  -H "Authorization: Bearer $TOKEN"

# 4. View in MongoDB
docker exec -it smartmenu-mongo mongosh --quiet --eval \
  "db.getSiblingDB('smartmenu').tables.find().forEach(printjson)"
```

---

## 🗄️ MongoDB Operations

### Viewing Data
```bash
# Connect to MongoDB container
docker exec -it smartmenu-mongo mongosh

# Switch to smartmenu database
use smartmenu

# List all collections
show collections

# View all tables
db.tables.find().pretty()

# Count tables
db.tables.countDocuments()

# Find specific table
db.tables.findOne({ tableNumber: "T1" })

# View all users
db.user.find().pretty()
```

### Understanding MongoDB Documents

#### User Document
```json
{
  "_id": "6920b160af94ea6298b3ab11",
  "username": "admin",
  "email": "admin@example.com",
  "password": "$2a$10$...",  // BCrypt hashed
  "role": "ROLE_RESTAURANT_OWNER",
  "active": true,
  "createdAt": "2025-11-21T18:50:00.000Z",
  "_class": "com.smartmenu.model.User"
}
```

#### Table Document
```json
{
  "_id": "6920b81caf94ea6298b3ab12",
  "userId": "6920b160af94ea6298b3ab11",  // References User._id
  "tableNumber": "T1",
  "qrCodeId": "d1c98b06-351b-4f51-ae42-c66c0e381280",
  "qrCodeUrl": "/index.html?table=d1c98b06-351b-4f51-ae42-c66c0e381280",
  "room": false,
  "location": "Main Hall",
  "active": true,
  "createdAt": "2025-11-21T19:06:03.999Z"
}
```

---

## 🔍 Key Files and Their Roles

### Frontend Files

| File | Purpose | Key Functions |
|------|---------|---------------|
| `src/services/api.js` | API communication hub | - Creates axios instance<br>- Adds JWT to requests<br>- Handles 401 errors |
| `src/pages/Login.jsx` | Login UI | - Handles login form<br>- Saves JWT to localStorage<br>- Redirects to dashboard |
| `src/pages/QRCodes.jsx` | QR management UI | - Lists tables<br>- Creates new tables<br>- Deletes tables<br>- Generates QR codes |
| `src/i18n/translations.js` | Multi-language support | - EN/SW/FR translations<br>- Used via `t()` function |
| `vite.config.js` | Vite configuration | - Proxy `/api` to backend<br>- Dev server on port 5173 |

### Backend Files

| File | Purpose | Key Functions |
|------|---------|---------------|
| `config/SecurityConfig.java` | Security setup | - JWT authentication<br>- Public/protected endpoints<br>- CORS configuration |
| `controller/TableController.java` | Table API endpoints | - GET /api/tables<br>- POST /api/tables<br>- DELETE /api/tables/{id} |
| `controller/AuthController.java` | Auth API endpoints | - POST /api/auth/register<br>- POST /api/auth/login |
| `service/AuthService.java` | Auth business logic | - Register users<br>- Validate credentials<br>- Generate JWT |
| `repository/TableRepository.java` | Table data access | - MongoDB queries<br>- findByUserId()<br>- save(), delete() |
| `model/Table.java` | Table data model | - MongoDB document structure<br>- Field definitions |
| `security/JwtAuthenticationFilter.java` | JWT validation | - Extracts token from header<br>- Validates token<br>- Sets authentication |
| `util/JwtUtil.java` | JWT utilities | - Generate tokens<br>- Validate tokens<br>- Extract username |

---

## 🧪 Testing the Complete Flow

### Browser Testing (Recommended for Beginners)

1. **Open DevTools** (F12 in Chrome/Firefox)

2. **Login**
   - Go to http://localhost:5173
   - Login with: `admin` / `admin123`
   - Watch Network tab → see POST to `/api/auth/login`
   - Check Application → Local Storage → see `jwt_token`

3. **Create Table**
   - Go to QR Codes page
   - Fill form: Table Number = "T1", Location = "Main Hall"
   - Click "Add Table/Room"
   - Watch Network tab → see POST to `/api/tables`
   - See Authorization header with Bearer token

4. **View in MongoDB**
   ```bash
   docker exec -it smartmenu-mongo mongosh --quiet --eval \
     "db.getSiblingDB('smartmenu').tables.find().pretty()"
   ```

### Terminal Testing (For Advanced Users)

```bash
# Complete test script
#!/bin/bash

echo "1. Login and get token..."
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "Token: ${TOKEN:0:20}..."

echo -e "\n2. Create table T2..."
curl -X POST http://localhost:8080/api/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"tableNumber":"T2","isRoom":false,"location":"Patio"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n3. List all tables..."
curl -s -X GET http://localhost:8080/api/tables \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n4. MongoDB contents..."
docker exec smartmenu-mongo mongosh --quiet --eval \
  "db.getSiblingDB('smartmenu').tables.find().forEach(printjson)"
```

---

## 🛠️ Common Issues and Solutions

### Issue 1: "Failed to load tables"
**Cause**: No JWT token or invalid token
**Solution**: 
1. Check localStorage has `jwt_token`
2. Login again via UI
3. Check backend logs for JWT validation errors

### Issue 2: Backend returns 403
**Cause**: Token missing or expired
**Solution**:
```bash
# Check token expiration (default: 24 hours)
# Login again to get fresh token
```

### Issue 3: Cannot connect to MongoDB
**Cause**: MongoDB container not running
**Solution**:
```bash
# Check if running
docker ps | grep smartmenu-mongo

# Start if not running
docker start smartmenu-mongo

# Or create new container
docker run -d --name smartmenu-mongo -p 27017:27017 mongo:6.0
```

### Issue 4: Frontend can't reach backend
**Cause**: Backend not running or wrong port
**Solution**:
```bash
# Check backend is running
curl http://localhost:8080/api/health

# Should return: {"message":"SmartMenu Backend is running!","status":"UP"}
```

### Issue 5: CORS errors in browser
**Cause**: Frontend making cross-origin requests
**Solution**: Already fixed! `vite.config.js` proxies `/api` to backend

---

## 📖 Learning Exercises

### Exercise 1: Add a New Field
**Goal**: Add a "capacity" field to tables

1. Update `Table.java` model
2. Update `TableController.java` to accept capacity
3. Update `QRCodes.jsx` form
4. Test creating a table with capacity
5. View in MongoDB

### Exercise 2: Implement Table Search
**Goal**: Search tables by number

1. Add search input in `QRCodes.jsx`
2. Filter tables array based on search
3. (Bonus) Add backend endpoint for server-side search

### Exercise 3: Add Table Statistics
**Goal**: Show total tables count on Dashboard

1. Create endpoint: GET `/api/tables/stats`
2. Return count, active count, etc.
3. Call from `Dashboard.jsx`
4. Display statistics

---

## 🎯 Next Steps

1. ✅ **Current**: Full CRUD for Tables
2. 🚧 **Next**: Implement Orders management
3. 🚧 **Next**: Implement Menu Items management
4. 🚧 **Next**: Implement Customer Feedback
5. 🚧 **Next**: Add real QR code generation on server
6. 🚧 **Next**: Deploy to production (AWS/Azure/Heroku)

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [JWT Introduction](https://jwt.io/introduction)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

## 💡 Key Takeaways

1. **Frontend** → User interface (React)
2. **Backend** → Business logic + API (Spring Boot)
3. **Database** → Data persistence (MongoDB)
4. **JWT** → Secure authentication token
5. **REST API** → Communication protocol (JSON over HTTP)
6. **Axios** → HTTP client for API calls
7. **Repository** → Database access layer
8. **Controller** → API endpoint definitions
9. **Service** → Business logic layer
10. **Model** → Data structure definitions

---

**🎉 Congratulations!** You now have a fully functional full-stack application with authentication, database persistence, and a modern UI!
