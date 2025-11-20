/**
 * ADMIN DASHBOARD - React Version
 * Based on smart-menu-qr admin/index.php
 * 
 * Features:
 * - Today's stats (orders, sales, pending, active items, tables)
 * - Recent orders list
 * - Top selling items
 * - Customer feedback
 * - Quick actions
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, clearUserData, isLoggedIn } from '../services/api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './Dashboard.css';

function Dashboard() {
    const [user, setUser] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSales: 0,
        pendingOrders: 0,
        activeItems: 0,
        tablesCount: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [recentFeedback, setRecentFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication
        if (!isLoggedIn()) {
            navigate('/login');
            return;
        }

        // Load user data
        const userData = getUserData();
        setUser(userData);

        // Load dashboard data
        loadDashboardData();
    }, [navigate]);

    const loadDashboardData = async () => {
        setLoading(true);
        
        try {
            // Simulate API calls (replace with real API when backend endpoints are ready)
            // For now, using mock data
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock stats
            setStats({
                totalOrders: 45,
                totalSales: 1250000.00,
                pendingOrders: 8,
                activeItems: 32,
                tablesCount: 15
            });

            // Mock recent orders
            setRecentOrders([
                { id: 1, orderNumber: 'ORD-001', tableNumber: 'Table 5', amount: 45000, status: 'delivered', paymentStatus: 'completed', createdAt: new Date() },
                { id: 2, orderNumber: 'ORD-002', tableNumber: 'Room 2', amount: 78000, status: 'preparing', paymentStatus: 'pending', createdAt: new Date() },
                { id: 3, orderNumber: 'ORD-003', tableNumber: 'Table 1', amount: 32000, status: 'confirmed', paymentStatus: 'pending', createdAt: new Date() }
            ]);

            // Mock top items
            setTopItems([
                { name: 'Ugali & Fish', totalSold: 45, totalRevenue: 675000 },
                { name: 'Pilau & Chicken', totalSold: 38, totalRevenue: 570000 },
                { name: 'Chips Mayai', totalSold: 52, totalRevenue: 312000 }
            ]);

            // Mock feedback
            setRecentFeedback([
                { id: 1, orderNumber: 'ORD-001', tableNumber: 'Table 5', rating: 5, comments: 'Excellent service and food!' },
                { id: 2, orderNumber: 'ORD-004', tableNumber: 'Table 3', rating: 4, comments: 'Good food, fast delivery' }
            ]);

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearUserData();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount) + ' TSH';
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className="admin-container">
            {/* Sidebar Navigation */}
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content Wrapper */}
            <div className="main-wrapper">
                {/* Navigation Bar with Language Switcher */}
                <Navbar onToggleSidebar={toggleSidebar} />

                {/* Main Content */}
                <main className="main-content">
                <div className="header">
                    <h1>Dashboard</h1>
                </div>

                {loading ? (
                    <div className="loading-center">
                        <i className="fas fa-spinner fa-spin" style={{fontSize: '40px'}}></i>
                        <p>Loading dashboard...</p>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="stats-container">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <div className="stat-details">
                                    <h3>Today's Orders</h3>
                                    <p className="stat-number">{stats.totalOrders}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div className="stat-details">
                                    <h3>Today's Sales</h3>
                                    <p className="stat-number">{formatCurrency(stats.totalSales)}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-clipboard-list"></i>
                                </div>
                                <div className="stat-details">
                                    <h3>Pending Orders</h3>
                                    <p className="stat-number">{stats.pendingOrders}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-utensils"></i>
                                </div>
                                <div className="stat-details">
                                    <h3>Active Menu Items</h3>
                                    <p className="stat-number">{stats.activeItems}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-chair"></i>
                                </div>
                                <div className="stat-details">
                                    <h3>Tables/Rooms</h3>
                                    <p className="stat-number">{stats.tablesCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Grid - Recent Orders, Top Items, Feedback */}
                        <div className="dashboard-grid">
                            {/* Recent Orders */}
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>Recent Orders</h2>
                                    <a href="/orders" className="view-all">View All</a>
                                </div>
                                <div className="card-content">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Table/Room</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Payment</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="no-data">No recent orders</td>
                                                </tr>
                                            ) : (
                                                recentOrders.map(order => (
                                                    <tr key={order.id}>
                                                        <td>{order.orderNumber}</td>
                                                        <td>{order.tableNumber}</td>
                                                        <td>{formatCurrency(order.amount)}</td>
                                                        <td>
                                                            <span className={`status-badge status-${order.status}`}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td>{order.paymentStatus}</td>
                                                        <td>{formatTime(order.createdAt)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Top Selling Items */}
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>Top Selling Items</h2>
                                    <a href="/reports" className="view-all">View Reports</a>
                                </div>
                                <div className="card-content">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Units Sold</th>
                                                <th>Total Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="no-data">No sales data available</td>
                                                </tr>
                                            ) : (
                                                topItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{item.totalSold}</td>
                                                        <td>{formatCurrency(item.totalRevenue)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Customer Feedback */}
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>Customer Feedback</h2>
                                    <a href="/feedback" className="view-all">View All</a>
                                </div>
                                <div className="card-content">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Table/Room</th>
                                                <th>Rating</th>
                                                <th>Comments</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentFeedback.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="no-data">No feedback available</td>
                                                </tr>
                                            ) : (
                                                recentFeedback.map(feedback => (
                                                    <tr key={feedback.id}>
                                                        <td>{feedback.orderNumber}</td>
                                                        <td>{feedback.tableNumber}</td>
                                                        <td className="rating-stars">{renderStars(feedback.rating)}</td>
                                                        <td>{feedback.comments || 'No comments'}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="action-buttons">
                                <a href="/menu" className="action-btn">
                                    <i className="fas fa-utensils"></i>
                                    <span>Manage Menu</span>
                                </a>
                                <a href="/daily-menu" className="action-btn">
                                    <i className="fas fa-calendar-day"></i>
                                    <span>Today's Menu</span>
                                </a>
                                <a href="/orders" className="action-btn">
                                    <i className="fas fa-shopping-cart"></i>
                                    <span>Process Orders</span>
                                </a>
                                <a href="/qr-codes" className="action-btn">
                                    <i className="fas fa-qrcode"></i>
                                    <span>QR Codes</span>
                                </a>
                            </div>
                        </div>
                    </>
                )}
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div 
                    className="sidebar-overlay" 
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
}

export default Dashboard;
