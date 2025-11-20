/**
 * SIDEBAR COMPONENT - React Version
 * Based on smart-menu-qr admin/includes/sidebar.php
 * 
 * Features:
 * - Navigation menu with active highlighting
 * - Notification bell for new/pending orders
 * - Role-based access control (future implementation)
 * - Mobile responsive with toggle
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearUserData, getUserData } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import './Sidebar.css';

function Sidebar({ isOpen, onToggle }) {
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [user, setUser] = useState({});

    useEffect(() => {
        // Load user data
        const userData = getUserData();
        setUser(userData);

        // Load new orders count
        loadNewOrdersCount();

        // Set up interval to refresh count every 30 seconds
        const interval = setInterval(loadNewOrdersCount, 30000);

        return () => clearInterval(interval);
    }, []);

    const loadNewOrdersCount = async () => {
        try {
            // TODO: Replace with actual API call when backend endpoint is ready
            // Example: const response = await api.get('/api/orders/pending/count');
            // setNewOrdersCount(response.data.count);
            
            // Mock data for now
            setNewOrdersCount(5);
        } catch (error) {
            console.error('Error loading orders count:', error);
        }
    };

    const handleLogout = () => {
        clearUserData();
        navigate('/login');
    };

    const handleLinkClick = () => {
        // Close sidebar on mobile after clicking a link
        if (window.innerWidth <= 768 && onToggle) {
            onToggle();
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Check if user has access to a feature (for future role-based access)
    const hasFeatureAccess = (feature) => {
        // TODO: Implement proper role-based access control
        // For now, return true for all features
        // Example: return user.features?.includes(feature);
        return true;
    };

    const menuItems = [
        {
            path: '/dashboard',
            icon: 'fas fa-tachometer-alt',
            labelKey: 'dashboard',
            feature: 'dashboard'
        },
        {
            path: '/menu',
            icon: 'fas fa-utensils',
            labelKey: 'manageMenu',
            feature: 'menu'
        },
        {
            path: '/daily-menu',
            icon: 'fas fa-calendar-day',
            labelKey: 'todaysMenu',
            feature: 'daily-menu'
        },
        {
            path: '/orders',
            icon: 'fas fa-shopping-cart',
            labelKey: 'orders',
            feature: 'orders'
        },
        {
            path: '/feedback',
            icon: 'fas fa-comments',
            labelKey: 'customerFeedback',
            feature: 'feedback'
        },
        {
            path: '/reports',
            icon: 'fas fa-chart-bar',
            labelKey: 'reports',
            feature: 'reports'
        },
        {
            path: '/qr-codes',
            icon: 'fas fa-qrcode',
            labelKey: 'qrCodes',
            feature: 'qr-codes'
        },
        {
            path: '/settings',
            icon: 'fas fa-cog',
            labelKey: 'settings',
            feature: 'settings',
            requiresFeature: true // Only show if user has this feature
        }
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'active' : ''}`} id="sidebar">
            <div className="sidebar-header">
                <h2>Smart Menu</h2>
                <div className="header-actions">
                    {/* Notification bell for new orders */}
                    <a 
                        href="/orders" 
                        className="notif-bell" 
                        title="New orders"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/orders');
                            handleLinkClick();
                        }}
                    >
                        <i className="fas fa-bell" aria-hidden="true"></i>
                        {newOrdersCount > 0 && (
                            <span className="notif-badge">{newOrdersCount}</span>
                        )}
                    </a>
                    <button 
                        className="sidebar-toggle" 
                        onClick={onToggle}
                        aria-label="Toggle sidebar"
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </div>

            <nav className="sidebar-nav" aria-label="Admin Navigation">
                <ul>
                    {menuItems.map((item) => {
                        // Skip items that require specific features if user doesn't have access
                        if (item.requiresFeature && !hasFeatureAccess(item.feature)) {
                            return null;
                        }

                        return (
                            <li key={item.path}>
                                <a
                                    href={item.path}
                                    className={isActive(item.path) ? 'active' : ''}
                                    aria-current={isActive(item.path) ? 'page' : 'false'}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(item.path);
                                        handleLinkClick();
                                    }}
                                >
                                    <i className={item.icon}></i> {t(item.labelKey)}
                                </a>
                            </li>
                        );
                    })}

                    {/* Logout */}
                    <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                            }}
                        >
                            <i className="fas fa-sign-out-alt"></i> {t('logout')}
                        </a>
                    </li>
                </ul>
            </nav>

            {/* User Info at Bottom */}
            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="user-details">
                        <div className="user-name">{user.username || 'Admin'}</div>
                        <div className="user-role">{user.role || 'Administrator'}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
