import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenuItems, getUserData, clearUserData, isLoggedIn } from '../services/api';
import './Dashboard.css';

function Dashboard() {
    const [user, setUser] = useState({});
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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

        // Load menu items
        loadMenuItems();
    }, [navigate]);

    const loadMenuItems = async () => {
        setLoading(true);
        setError('');
        
        try {
            const items = await getMenuItems();
            setMenuItems(items);
        } catch (err) {
            setError('Failed to load menu items');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearUserData();
        navigate('/login');
    };

    return (
        <div className="dashboard-page">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-brand">
                    <i className="fas fa-utensils"></i> Smart Menu
                </div>
                <div className="navbar-user">
                    <div className="user-info">
                        <div className="user-name">{user.username || 'User'}</div>
                        <div className="user-role">{user.role || 'Loading...'}</div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container">
                {/* Welcome Card */}
                <div className="welcome-card">
                    <h1>Welcome to Your Dashboard!</h1>
                    <p>You are successfully authenticated with JWT token.</p>
                    
                    <div className="token-info">
                        <h3><i className="fas fa-key"></i> Your JWT Token (VIP Wristband)</h3>
                        <p>This token is sent with every API request to prove you're logged in:</p>
                        <div className="token-display">
                            {user.token?.substring(0, 100)}...
                            <br /><br />
                            (Full token stored in localStorage)
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <i className="fas fa-user card-blue"></i>
                        <h3>User ID</h3>
                        <p>{user.id || 'Loading...'}</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-envelope card-green"></i>
                        <h3>Email</h3>
                        <p>{user.email || 'Loading...'}</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-shield-alt card-orange"></i>
                        <h3>Role</h3>
                        <p>{user.role || 'Loading...'}</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-clock card-red"></i>
                        <h3>Session Status</h3>
                        <p>Active</p>
                    </div>
                </div>

                {/* Menu Items Section */}
                <div className="menu-items-section">
                    <div className="section-header">
                        <h2><i className="fas fa-list"></i> Menu Items</h2>
                        <button className="btn btn-refresh" onClick={loadMenuItems}>
                            <i className="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="loading-center">
                            <i className="fas fa-spinner fa-spin" style={{fontSize: '30px'}}></i>
                            <p>Loading menu items...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : menuItems.length === 0 ? (
                        <div className="loading-center">
                            <p>No menu items yet. Create your first menu item!</p>
                        </div>
                    ) : (
                        <ul className="menu-items-list">
                            {menuItems.map((item) => (
                                <li key={item.id} className="menu-item">
                                    <div>
                                        <div className="menu-item-name">{item.name}</div>
                                        <div className="menu-item-desc">
                                            {item.description || 'No description'}
                                        </div>
                                    </div>
                                    <div className="menu-item-price">
                                        ${item.price.toFixed(2)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
