import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, isLoggedIn } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';
import './Settings.css';

function Settings() {
    const { t, language, changeLanguage } = useLanguage();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Profile settings
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        restaurantName: '',
        address: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Restaurant settings
    const [restaurantSettings, setRestaurantSettings] = useState({
        currency: 'TSH',
        timezone: 'Africa/Dar_es_Salaam',
        openingTime: '08:00',
        closingTime: '22:00',
        serviceCharge: 0,
        vatRate: 18,
        receiptFooter: 'Thank you for dining with us!',
        allowOnlineOrders: true,
        autoAcceptOrders: false
    });

    // System preferences
    const [systemPreferences, setSystemPreferences] = useState({
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        emailNotifications: true,
        smsNotifications: false,
        orderNotifications: true,
        feedbackNotifications: true
    });

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
            return;
        }

        const userData = getUserData();
        setUser(userData);
        loadSettings();
    }, [navigate]);

    const loadSettings = async () => {
        setLoading(true);
        try {
            // Load user profile (in a real app, fetch from API)
            const userData = getUserData();
            setProfileData({
                ...profileData,
                fullName: userData.username || '',
                email: userData.email || '',
                restaurantName: userData.restaurantName || ''
            });

            // Set system language to match user preference
            setSystemPreferences({
                ...systemPreferences,
                language: language
            });

        } catch (err) {
            console.error('Error loading settings:', err);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleRestaurantChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setRestaurantSettings({
            ...restaurantSettings,
            [e.target.name]: value
        });
    };

    const handlePreferenceChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSystemPreferences({
            ...systemPreferences,
            [e.target.name]: value
        });

        // If language changed, apply it immediately
        if (e.target.name === 'language') {
            changeLanguage(value);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Validate passwords if changing
            if (profileData.newPassword) {
                if (profileData.newPassword !== profileData.confirmPassword) {
                    setError('New passwords do not match');
                    setLoading(false);
                    return;
                }
                if (profileData.newPassword.length < 6) {
                    setError('New password must be at least 6 characters');
                    setLoading(false);
                    return;
                }
            }

            // In a real app, call API to update profile
            // await api.put('/users/profile', profileData);

            setSuccess('Profile updated successfully!');
            
            // Clear password fields
            setProfileData({
                ...profileData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleRestaurantSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // In a real app, call API to update restaurant settings
            // await api.put('/settings/restaurant', restaurantSettings);

            setSuccess('Restaurant settings updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update restaurant settings');
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handlePreferencesSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // In a real app, call API to update preferences
            // await api.put('/settings/preferences', systemPreferences);

            setSuccess('Preferences updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update preferences');
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="admin-container">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
            <div className="main-wrapper">
                <Navbar onToggleSidebar={toggleSidebar} />
                <main className="main-content">
                    <div className="page-header">
                        <div className="header-content">
                            <h1>
                                <i className="fas fa-cog"></i> {t('settings') || 'Settings'}
                            </h1>
                            <p className="subtitle">Manage your account and application preferences</p>
                        </div>
                    </div>

                    {success && (
                        <div className="alert alert-success">
                            <i className="fas fa-check-circle"></i>
                            <span>{success}</span>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="settings-container">
                        <div className="settings-tabs">
                            <button
                                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <i className="fas fa-user"></i>
                                <span>Profile</span>
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'restaurant' ? 'active' : ''}`}
                                onClick={() => setActiveTab('restaurant')}
                            >
                                <i className="fas fa-store"></i>
                                <span>Restaurant</span>
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
                                onClick={() => setActiveTab('system')}
                            >
                                <i className="fas fa-sliders-h"></i>
                                <span>System</span>
                            </button>
                        </div>

                        <div className="settings-content">
                            {/* Profile Settings */}
                            {activeTab === 'profile' && (
                                <div className="settings-section">
                                    <h2>Profile Information</h2>
                                    <form onSubmit={handleProfileSubmit}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label htmlFor="fullName">Full Name</label>
                                                <input
                                                    type="text"
                                                    id="fullName"
                                                    name="fullName"
                                                    value={profileData.fullName}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter your full name"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="email">Email Address</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={profileData.email}
                                                    onChange={handleProfileChange}
                                                    placeholder="your@email.com"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="phone">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={profileData.phone}
                                                    onChange={handleProfileChange}
                                                    placeholder="+255 XXX XXX XXX"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="restaurantName">Restaurant Name</label>
                                                <input
                                                    type="text"
                                                    id="restaurantName"
                                                    name="restaurantName"
                                                    value={profileData.restaurantName}
                                                    onChange={handleProfileChange}
                                                    placeholder="Your restaurant name"
                                                />
                                            </div>

                                            <div className="form-group full-width">
                                                <label htmlFor="address">Restaurant Address</label>
                                                <textarea
                                                    id="address"
                                                    name="address"
                                                    value={profileData.address}
                                                    onChange={handleProfileChange}
                                                    placeholder="Full address"
                                                    rows="3"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="section-divider"></div>

                                        <h3>Change Password</h3>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label htmlFor="currentPassword">Current Password</label>
                                                <input
                                                    type="password"
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    value={profileData.currentPassword}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter current password"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="newPassword">New Password</label>
                                                <input
                                                    type="password"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    value={profileData.newPassword}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter new password"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={profileData.confirmPassword}
                                                    onChange={handleProfileChange}
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button type="submit" className="btn-primary" disabled={loading}>
                                                <i className="fas fa-save"></i>
                                                {loading ? 'Saving...' : 'Save Profile'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Restaurant Settings */}
                            {activeTab === 'restaurant' && (
                                <div className="settings-section">
                                    <h2>Restaurant Configuration</h2>
                                    <form onSubmit={handleRestaurantSubmit}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label htmlFor="currency">Currency</label>
                                                <select
                                                    id="currency"
                                                    name="currency"
                                                    value={restaurantSettings.currency}
                                                    onChange={handleRestaurantChange}
                                                >
                                                    <option value="TSH">TSH (Tanzanian Shilling)</option>
                                                    <option value="USD">USD (US Dollar)</option>
                                                    <option value="EUR">EUR (Euro)</option>
                                                    <option value="GBP">GBP (British Pound)</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="timezone">Timezone</label>
                                                <select
                                                    id="timezone"
                                                    name="timezone"
                                                    value={restaurantSettings.timezone}
                                                    onChange={handleRestaurantChange}
                                                >
                                                    <option value="Africa/Dar_es_Salaam">Africa/Dar es Salaam</option>
                                                    <option value="Africa/Nairobi">Africa/Nairobi</option>
                                                    <option value="UTC">UTC</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="openingTime">Opening Time</label>
                                                <input
                                                    type="time"
                                                    id="openingTime"
                                                    name="openingTime"
                                                    value={restaurantSettings.openingTime}
                                                    onChange={handleRestaurantChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="closingTime">Closing Time</label>
                                                <input
                                                    type="time"
                                                    id="closingTime"
                                                    name="closingTime"
                                                    value={restaurantSettings.closingTime}
                                                    onChange={handleRestaurantChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="serviceCharge">Service Charge (%)</label>
                                                <input
                                                    type="number"
                                                    id="serviceCharge"
                                                    name="serviceCharge"
                                                    value={restaurantSettings.serviceCharge}
                                                    onChange={handleRestaurantChange}
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="vatRate">VAT Rate (%)</label>
                                                <input
                                                    type="number"
                                                    id="vatRate"
                                                    name="vatRate"
                                                    value={restaurantSettings.vatRate}
                                                    onChange={handleRestaurantChange}
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                />
                                            </div>

                                            <div className="form-group full-width">
                                                <label htmlFor="receiptFooter">Receipt Footer Text</label>
                                                <textarea
                                                    id="receiptFooter"
                                                    name="receiptFooter"
                                                    value={restaurantSettings.receiptFooter}
                                                    onChange={handleRestaurantChange}
                                                    placeholder="Thank you message for receipts"
                                                    rows="3"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="section-divider"></div>

                                        <h3>Order Management</h3>
                                        <div className="form-group-checkbox">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="allowOnlineOrders"
                                                    checked={restaurantSettings.allowOnlineOrders}
                                                    onChange={handleRestaurantChange}
                                                />
                                                <span>Allow Online Orders</span>
                                            </label>
                                            <p className="help-text">Enable customers to place orders online</p>
                                        </div>

                                        <div className="form-group-checkbox">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="autoAcceptOrders"
                                                    checked={restaurantSettings.autoAcceptOrders}
                                                    onChange={handleRestaurantChange}
                                                />
                                                <span>Auto-Accept Orders</span>
                                            </label>
                                            <p className="help-text">Automatically accept orders without manual confirmation</p>
                                        </div>

                                        <div className="form-actions">
                                            <button type="submit" className="btn-primary" disabled={loading}>
                                                <i className="fas fa-save"></i>
                                                {loading ? 'Saving...' : 'Save Restaurant Settings'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* System Preferences */}
                            {activeTab === 'system' && (
                                <div className="settings-section">
                                    <h2>System Preferences</h2>
                                    <form onSubmit={handlePreferencesSubmit}>
                                        <h3>Localization</h3>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label htmlFor="language">Language</label>
                                                <select
                                                    id="language"
                                                    name="language"
                                                    value={systemPreferences.language}
                                                    onChange={handlePreferenceChange}
                                                >
                                                    <option value="en">English</option>
                                                    <option value="sw">Swahili</option>
                                                    <option value="fr">French</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="dateFormat">Date Format</label>
                                                <select
                                                    id="dateFormat"
                                                    name="dateFormat"
                                                    value={systemPreferences.dateFormat}
                                                    onChange={handlePreferenceChange}
                                                >
                                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="timeFormat">Time Format</label>
                                                <select
                                                    id="timeFormat"
                                                    name="timeFormat"
                                                    value={systemPreferences.timeFormat}
                                                    onChange={handlePreferenceChange}
                                                >
                                                    <option value="24h">24 Hour</option>
                                                    <option value="12h">12 Hour (AM/PM)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="section-divider"></div>

                                        <h3>Notifications</h3>
                                        <div className="form-group-checkbox">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="emailNotifications"
                                                    checked={systemPreferences.emailNotifications}
                                                    onChange={handlePreferenceChange}
                                                />
                                                <span>Email Notifications</span>
                                            </label>
                                            <p className="help-text">Receive notifications via email</p>
                                        </div>

                                        <div className="form-group-checkbox">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="smsNotifications"
                                                    checked={systemPreferences.smsNotifications}
                                                    onChange={handlePreferenceChange}
                                                />
                                                <span>SMS Notifications</span>
                                            </label>
                                            <p className="help-text">Receive notifications via SMS</p>
                                        </div>

                                        <div className="form-group-checkbox">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="orderNotifications"
                                                    checked={systemPreferences.orderNotifications}
                                                    onChange={handlePreferenceChange}
                                                />
                                                <span>Order Notifications</span>
                                            </label>
                                            <p className="help-text">Get notified when new orders are placed</p>
                                        </div>

                                        <div className="form-group-checkbox">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="feedbackNotifications"
                                                    checked={systemPreferences.feedbackNotifications}
                                                    onChange={handlePreferenceChange}
                                                />
                                                <span>Feedback Notifications</span>
                                            </label>
                                            <p className="help-text">Get notified when customers leave feedback</p>
                                        </div>

                                        <div className="form-actions">
                                            <button type="submit" className="btn-primary" disabled={loading}>
                                                <i className="fas fa-save"></i>
                                                {loading ? 'Saving...' : 'Save Preferences'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Settings;
