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
import DailyMenu from './pages/DailyMenu';
import Orders from './pages/Orders';
import Feedback from './pages/Feedback';
import Reports from './pages/Reports';
import QRCodes from './pages/QRCodes';
import Settings from './pages/Settings';
import CustomerMenu from './pages/CustomerMenu';
import OrderTracking from './pages/OrderTracking';
import CustomerFeedback from './pages/CustomerFeedback';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Customer Menu - Public route for QR code scans (no auth required) */}
        <Route path="/customer-menu" element={<CustomerMenu />} />
        
        {/* Order Tracking - Public route for customers to track their orders */}
        <Route path="/order-tracking" element={<OrderTracking />} />
        
        {/* Customer Feedback - Public route for customers to give feedback */}
        <Route path="/feedback-form" element={<CustomerFeedback />} />
        
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
        
        {/* Daily Menu Route - Manage menu items for specific dates */}
        <Route path="/daily-menu" element={<DailyMenu />} />
        
        {/* Orders Route - Manage customer orders and payments */}
        <Route path="/orders" element={<Orders />} />
        
        {/* Feedback Route - View and analyze customer feedback */}
        <Route path="/feedback" element={<Feedback />} />
  {/* Reports Route - Sales Reports */}
  <Route path="/reports" element={<Reports />} />
        {/* QR Codes Route - Manage QR codes for tables/rooms */}
        <Route path="/qr-codes" element={<QRCodes />} />
        
        {/* Settings Route - Manage account and application settings */}
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
    </LanguageProvider>
  );
}

export default App;
