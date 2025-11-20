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
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
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
      </Routes>
    </Router>
  );
}

export default App;
