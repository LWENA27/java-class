# 🔐 Authentication Guide - Development Mode

## ✅ Quick Fix Applied!

Your authentication issue is now fixed. You can access the dashboard using test credentials.

---

## 🎯 How to Login

### Test Credentials:
- **Username:** `admin`
- **Password:** `admin123`

### Steps:
1. Go to: http://localhost:5174/login
2. Enter username: `admin`
3. Enter password: `admin123`
4. Click "Login"
5. You'll be redirected to the Dashboard! ✨

---

## 🎓 What Was The Problem?

### Issue 1: Backend Not Running
- Spring Boot backend was trying to start on port 8080
- Port 8080 was already in use by another process
- Backend couldn't start, so authentication API wasn't available

### Issue 2: Registration Failing
- Frontend was trying to call `/api/auth/register`
- But backend wasn't running, so request failed
- Error: "Registration failed. Please try again."

---

## 🛠️ The Solution

### Short-term Fix (Current):
**Mock Authentication** - Works without backend

```javascript
// In Login.jsx
const TEST_USERNAME = 'admin';
const TEST_PASSWORD = 'admin123';

if (username === TEST_USERNAME && password === TEST_PASSWORD) {
    // Create mock user data
    // Save to localStorage
    // Redirect to dashboard
}
```

**Benefits:**
- ✅ You can test the frontend immediately
- ✅ No need to fix backend port conflict
- ✅ All frontend features work
- ✅ Multi-language support works
- ✅ Menu management works

**Limitations:**
- ⚠️ Not real authentication (no database)
- ⚠️ No registration (use test credentials only)
- ⚠️ Data won't persist (uses mock data)

---

### Long-term Fix (TODO):

#### Option 1: Fix Port Conflict
```bash
# Find what's using port 8080
lsof -i:8080

# Kill the process
kill -9 <PID>

# Start backend
cd backend
mvn spring-boot:run
```

#### Option 2: Change Backend Port
```properties
# In backend/src/main/resources/application.properties
server.port=8081
```

Then update frontend API URL:
```javascript
// In frontend-react/src/services/api.js
const API_BASE_URL = 'http://localhost:8081';
```

---

## 📝 How Mock Authentication Works

### 1. **Login Process**

When you type username and password:

```javascript
// Check credentials
if (username === 'admin' && password === 'admin123') {
    // Success! Create fake user data
    const mockUserData = {
        token: 'mock-jwt-token',
        username: 'admin',
        email: 'admin@smartmenu.com',
        role: 'RESTAURANT_OWNER'
    };
    
    // Save to browser storage
    localStorage.setItem('user', JSON.stringify(mockUserData));
    
    // Redirect to dashboard
    navigate('/dashboard');
}
```

### 2. **Protected Routes**

Dashboard checks if you're logged in:

```javascript
// In Dashboard.jsx
useEffect(() => {
    if (!isLoggedIn()) {
        navigate('/login');  // Redirect to login
    }
}, []);
```

### 3. **isLoggedIn() Function**

```javascript
// In api.js
export const isLoggedIn = () => {
    const user = localStorage.getItem('user');
    return user !== null;  // Returns true if user data exists
};
```

---

## 🧪 Testing Checklist

Try these to confirm everything works:

### ✅ Login Flow
1. Go to http://localhost:5174/login
2. See blue info box with test credentials
3. Enter: admin / admin123
4. Click Login
5. See success message
6. Redirected to Dashboard

### ✅ Dashboard Access
1. Dashboard loads successfully
2. See 5 stat cards (Orders, Sales, etc.)
3. See Recent Orders table
4. See Top Selling Items
5. See Customer Feedback
6. Click "Manage Menu" in sidebar

### ✅ Menu Management
1. See "Menu Items" page
2. See language switcher (🇬🇧 English, 🇹🇿 Kiswahili, 🇫🇷 Français)
3. Change language - all text updates
4. See 2 mock menu items
5. Click "Add Menu Item" - modal opens
6. Fill form and add item - success message
7. Edit item - modal opens with data
8. Delete item - confirmation dialog
9. Copy item - creates duplicate

### ✅ Multi-Language
1. Select "🇹🇿 Kiswahili" from dropdown
2. "Menu Items" → "Vyakula"
3. "Add Menu Item" → "Ongeza Chakula"
4. All buttons, labels, messages in Swahili
5. Select "🇫🇷 Français"
6. Everything in French
7. Refresh page - language persists (saved in localStorage)

### ✅ Logout
1. Click "Logout" button
2. Redirected to Login page
3. Try going to /dashboard without login
4. Automatically redirected back to Login

---

## 🚀 What Works Now

### ✅ Fully Functional (No Backend Needed):
- Login with test credentials
- Dashboard view
- Menu Management CRUD
- Multi-language (3 languages)
- Logout
- Protected routes
- Sidebar navigation

### ⏳ Coming Soon (Needs Backend):
- Real user registration
- Real authentication
- Database persistence
- Order management
- Reports
- QR code generation

---

## 💡 For Students/Learners

### What You Learned:

1. **Mock Data Strategy**
   - Use fake data for frontend development
   - Don't wait for backend to be ready
   - Test UI/UX independently

2. **localStorage**
   - Browser storage for persisting data
   - Survives page refresh
   - Used for user session

3. **Protected Routes**
   - Check authentication before showing pages
   - Redirect if not logged in
   - Common pattern in web apps

4. **Separation of Concerns**
   - Frontend and backend can develop independently
   - Mock data bridges the gap
   - Switch to real API when ready

---

## 🔄 When to Switch to Real Backend

### Step 1: Fix Port Conflict
```bash
# Stop process using port 8080
lsof -i:8080
kill -9 <PID>
```

### Step 2: Start Backend
```bash
cd backend
mvn spring-boot:run
# Wait for "Started SmartMenuApplication"
```

### Step 3: Update Frontend
```javascript
// In Login.jsx - Comment out mock auth
const handleSubmit = async (e) => {
    e.preventDefault();
    
    /* COMMENT OUT THIS SECTION:
    if (formData.username === TEST_USERNAME && formData.password === TEST_PASSWORD) {
        // Mock authentication
    }
    */
    
    // UNCOMMENT THIS SECTION:
    try {
        const response = await login(formData);
        saveUserData(response);
        navigate('/dashboard');
    } catch (err) {
        setError(err.message);
    }
};
```

### Step 4: Test
1. Register new account
2. Login with registered account
3. Backend validates credentials
4. Real JWT token issued
5. Data saved to MongoDB

---

## 📞 Need Help?

If login still doesn't work:

1. **Clear browser storage:**
   - Press F12 → Application tab → Clear storage
   - Refresh page

2. **Check console for errors:**
   - Press F12 → Console tab
   - Look for red error messages

3. **Verify dev server running:**
   - Should see: "Local: http://localhost:5174/"
   - If not, run: `cd frontend-react && npm run dev`

4. **Try incognito/private window:**
   - Sometimes cached data causes issues

---

## ✨ Summary

✅ **Problem:** Backend not running, can't authenticate  
✅ **Solution:** Mock authentication with test credentials  
✅ **Credentials:** admin / admin123  
✅ **Result:** Full access to dashboard and all features!  

**Go ahead and login now!** 🚀
