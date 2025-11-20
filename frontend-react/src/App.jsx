/**
 * Main App Component
 * 
 * TEACHING MOMENT FOR BEGINNERS:
 * This is the root component of our React app.
 * It sets up routing (different pages/URLs):
 * - /login → Login page
 * - /register → Register page
 * - /dashboard → Dashboard (protected, requires JWT)
 * - / → Redirect to login
 * 
 * React Router is like a traffic cop - directs users to different pages
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MenuManagement from './pages/MenuManagement';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login page */}
        <Route path="/login" element={<Login />} />
        
        {/* Register page */}
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard (protected) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 🎓 LESSON: Menu Management Route
         * When user clicks "Menu Items" in sidebar,
         * they go to /menu and see MenuManagement component
         */}
        <Route path="/menu" element={<MenuManagement />} />
      </Routes>
    </Router>
    </LanguageProvider>
  );
}

export default App;
