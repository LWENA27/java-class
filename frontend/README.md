# 🎨 Frontend - Login & Dashboard

## 📁 Files Created

1. **login.html** - User login page (no tenant subdomain)
2. **register.html** - User registration page
3. **dashboard.html** - Protected dashboard page (requires JWT token)

## 🚀 How to Use

### Step 1: Make Sure Backend is Running

```bash
# Check if backend is running on port 8080
curl http://localhost:8080/api/health

# If not running, start it:
cd /var/www/html/smart-menu-saas/backend
java -jar target/smartmenu-backend-1.0.0.jar
```

### Step 2: Open Login Page in Browser

Open this URL in your browser:
```
file:///var/www/html/smart-menu-saas/frontend/login.html
```

Or use the command:
```bash
xdg-open file:///var/www/html/smart-menu-saas/frontend/login.html
```

### Step 3: Test the Login Flow

#### Option A: Use Existing Test User
- Username: `testuser`
- Password: `Test123!`

#### Option B: Create New Account
1. Click "Register here" link
2. Fill in the form:
   - Username: your choice
   - Email: your@email.com
   - Full Name: Your Name
   - Password: at least 6 characters
3. Click "Register"
4. You'll be redirected to login page
5. Login with your credentials

### Step 4: Explore the Dashboard

After successful login, you'll be redirected to the dashboard where you can:
- See your user information
- View your JWT token (the "VIP wristband")
- See menu items (if any exist)
- Logout

## 🔐 How JWT Authentication Works in This App

### Login Process:
```
1. User enters username & password
2. JavaScript sends POST to /api/auth/login
3. Backend validates credentials
4. Backend generates JWT token
5. Frontend receives token
6. Frontend stores token in localStorage
7. Redirect to dashboard
```

### Accessing Protected Pages:
```
1. User visits dashboard
2. JavaScript checks for token in localStorage
3. If no token → redirect to login
4. If token exists → display page
5. For API calls, send: "Authorization: Bearer <token>"
```

### Logout Process:
```
1. User clicks logout button
2. JavaScript removes token from localStorage
3. Redirect to login page
```

## 🎓 Teaching Notes (For Beginners)

### What is localStorage?
Think of it as your browser's pocket where you store small pieces of data:
- Survives page refreshes
- Survives browser close/reopen
- Only accessible by same website
- Perfect for storing JWT tokens

### Why No Tenant Subdomain?
In the old PHP version, you had multi-tenant (multiple restaurants on one system).
In this Spring Boot version, we simplified it to single-tenant for learning.
Each restaurant would have their own deployment.

### JWT vs PHP Sessions

| PHP Sessions | JWT Tokens |
|--------------|------------|
| Stored on server | Stored on client |
| `$_SESSION['user_id']` | `localStorage.getItem('jwt_token')` |
| Server checks session | Client sends token with every request |
| Server has to store all sessions | Server only validates signature |
| Stateful (server remembers) | Stateless (server doesn't remember) |

## 🧪 Testing with Browser Developer Tools

1. **Open DevTools**: Press F12
2. **Console Tab**: See login/logout messages
3. **Application Tab → Local Storage**: See stored JWT token
4. **Network Tab**: See API requests with Authorization header

## 📝 API Endpoints Used

```javascript
// Register new user
POST http://localhost:8080/api/auth/register
Body: { username, email, fullName, password }
Response: { message: "User registered successfully!" }

// Login
POST http://localhost:8080/api/auth/login
Body: { username, password }
Response: { token, id, username, email, role }

// Get menu items (protected)
GET http://localhost:8080/api/menu-items
Header: Authorization: Bearer <token>
Response: [ { id, name, description, price } ]
```

## 🎨 UI Features

### Login Page:
- ✅ Clean design (copied from smart-menu-qr)
- ✅ Username & Password fields
- ✅ Password visibility toggle (eye icon)
- ✅ Error messages
- ✅ Success messages
- ✅ Loading spinner
- ✅ Link to registration

### Register Page:
- ✅ Username, Email, Full Name, Password fields
- ✅ Password strength indicator
- ✅ Form validation
- ✅ Success/error messages
- ✅ Redirect to login after registration

### Dashboard:
- ✅ Navigation bar with user info
- ✅ Logout button
- ✅ Welcome card with JWT token display
- ✅ User stats cards
- ✅ Menu items list (fetched from API with JWT)
- ✅ Auto-redirect if not authenticated

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot connect to server"
**Solution**: Make sure Spring Boot backend is running on port 8080

### Issue 2: "Session expired"
**Solution**: JWT token expired (24 hours). Just login again.

### Issue 3: "CORS Error"
**Solution**: Backend already has CORS enabled in WebConfig.java

### Issue 4: Page not loading
**Solution**: Use `file://` protocol or set up a simple web server:
```bash
cd /var/www/html/smart-menu-saas/frontend
python3 -m http.server 8000
# Then open: http://localhost:8000/login.html
```

## 🔄 Delete Test User (Clean Up)

```bash
docker exec -it smartmenu-mongodb mongosh --eval 'use smartmenu; db.users.deleteOne({username: "testuser"})'
```

## 📚 Next Steps

1. ✅ Test login/register flow
2. ✅ Inspect JWT token at https://jwt.io
3. ✅ Watch Network tab to see Authorization headers
4. ✅ Try accessing dashboard without token (should redirect)
5. ✅ Logout and login again

## 🎯 What You Learned

- ✅ How to create login/register UI
- ✅ How to send API requests with JavaScript fetch()
- ✅ How to store JWT tokens in localStorage
- ✅ How to send Authorization headers
- ✅ How to protect pages (redirect if not authenticated)
- ✅ How JWT authentication works end-to-end

---

**You now have a complete JWT authentication system with UI!** 🎉
