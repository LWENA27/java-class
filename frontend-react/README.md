# 🚀 Smart Menu - React Frontend# React + Vite



## 📚 What You're LearningThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



This is a **React.js** frontend connected to Spring Boot backend with **JWT Authentication**.Currently, two official plugins are available:



### Why React.js?- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

- ✅ Component-based (reusable UI pieces)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- ✅ Virtual DOM (fast rendering)

- ✅ Large ecosystem## Expanding the ESLint configuration

- ✅ Used by Facebook, Netflix, Airbnb

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## 🚀 Quick Start

### 1. Start Backend (Terminal 1)
```bash
cd /var/www/html/smart-menu-saas/backend
java -jar target/smartmenu-backend-1.0.0.jar
```

### 2. Start React Frontend (Terminal 2)
```bash
cd /var/www/html/smart-menu-saas/frontend-react
npm run dev
```

### 3. Open Browser
```
http://localhost:5173
```

---

## 🎓 React Concepts

### 1. **Components** - LEGO blocks
```jsx
function Login() {
    return <div>Login Form</div>;
}
```

### 2. **useState** - Store data
```jsx
const [username, setUsername] = useState('');
```

### 3. **useEffect** - Run on load
```jsx
useEffect(() => {
    loadMenuItems();
}, []);
```

### 4. **React Router** - Different pages
```jsx
<Route path="/login" element={<Login />} />
```

### 5. **Axios** - HTTP requests
```jsx
await axios.post('/api/auth/login', { username, password });
```

---

## 🔐 Authentication Flow

```
Login → JWT Token → localStorage → API requests with token → Dashboard
```

---

## 🧪 Test User

- Username: `testuser`
- Password: `Test123!`

**Or create new account at http://localhost:5173/register**

---

**You now have React.js with JWT authentication!** 🎉
