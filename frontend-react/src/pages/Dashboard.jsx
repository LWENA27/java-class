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
import { useLanguage } from '../i18n/LanguageContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './Dashboard.css';

function Dashboard() {
    const { t } = useLanguage();
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
                    <h1>{t('dashboard')}</h1>
                </div>

                {loading ? (
                    <div className="loading-center">
                        <i className="fas fa-spinner fa-spin" style={{fontSize: '40px'}}></i>
                        <p>{t('loadingDashboard')}</p>
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
                                    <h3>{t('todaysOrders')}</h3>
                                    <p className="stat-number">{stats.totalOrders}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div className="stat-details">
                                    <h3>{t('todaysSales')}</h3>
                                    <p className="stat-number">{formatCurrency(stats.totalSales)}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-clipboard-list"></i>
                                </div>
                                <div className="stat-details">
                                    <h3>{t('pendingOrders')}</h3>
                                    <p className="stat-number">{stats.pendingOrders}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-utensils"></i>
                                </div>
                                <div className="stat-details">
                                    <h3>{t('activeMenuItems')}</h3>
                                    <p className="stat-number">{stats.activeItems}</p>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-chair"></i>
                                </div>
                                <div className="stat-details">
                                    <h3>{t('tablesRooms')}</h3>
                                    <p className="stat-number">{stats.tablesCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Grid - Recent Orders, Top Items, Feedback */}
                        <div className="dashboard-grid">
                            {/* Recent Orders */}
                            <div className="dashboard-card">
                                <div className="card-header">
                                    <h2>{t('recentOrders')}</h2>
                                    <a href="/orders" className="view-all">{t('viewAll')}</a>
                                </div>
                                <div className="card-content">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>{t('orderNumber')}</th>
                                                <th>{t('tableRoom')}</th>
                                                <th>{t('amount')}</th>
                                                <th>{t('status')}</th>
                                                <th>{t('payment')}</th>
                                                <th>{t('time')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="no-data">{t('noRecentOrders')}</td>
                                                </tr>
                                            ) : (
                                                recentOrders.map(order => (
                                                    <tr key={order.id}>
                                                        <td>{order.orderNumber}</td>
                                                        <td>{order.tableNumber}</td>
                                                        <td>{formatCurrency(order.amount)}</td>
                                                        <td>
                                                            <span className={`status-badge status-${order.status}`}>
                                                                {t(order.status)}
                                                            </span>
                                                        </td>
                                                        <td>{t(order.paymentStatus)}</td>
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
                                    <h2>{t('topSellingItems')}</h2>
                                    <a href="/reports" className="view-all">{t('viewReports')}</a>
                                </div>
                                <div className="card-content">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>{t('item')}</th>
                                                <th>{t('unitsSold')}</th>
                                                <th>{t('totalRevenue')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="no-data">{t('noSalesData')}</td>
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
                                    <h2>{t('customerFeedback')}</h2>
                                    <a href="/feedback" className="view-all">{t('viewAll')}</a>
                                </div>
                                <div className="card-content">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>{t('orderNumber')}</th>
                                                <th>{t('tableRoom')}</th>
                                                <th>{t('rating')}</th>
                                                <th>{t('comments')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentFeedback.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="no-data">{t('noFeedback')}</td>
                                                </tr>
                                            ) : (
                                                recentFeedback.map(feedback => (
                                                    <tr key={feedback.id}>
                                                        <td>{feedback.orderNumber}</td>
                                                        <td>{feedback.tableNumber}</td>
                                                        <td className="rating-stars">{renderStars(feedback.rating)}</td>
                                                        <td>{feedback.comments || t('noComments')}</td>
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
                            <h2>{t('quickActions')}</h2>
                            <div className="action-buttons">
                                <a href="/menu" className="action-btn">
                                    <i className="fas fa-utensils"></i>
                                    <span>{t('manageMenu')}</span>
                                </a>
                                <a href="/daily-menu" className="action-btn">
                                    <i className="fas fa-calendar-day"></i>
                                    <span>{t('todaysMenu')}</span>
                                </a>
                                <a href="/orders" className="action-btn">
                                    <i className="fas fa-shopping-cart"></i>
                                    <span>{t('processOrders')}</span>
                                </a>
                                <a href="/qr-codes" className="action-btn">
                                    <i className="fas fa-qrcode"></i>
                                    <span>{t('qrCodes')}</span>
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
