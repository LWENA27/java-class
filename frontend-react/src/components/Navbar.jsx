/**
 * NAVBAR COMPONENT - Reusable Top Navigation Bar
 * 
 * Features:
 * - Brand logo and name
 * - User welcome message
 * - Language switcher (accessible from any page)
 * - Logout button
 * - Mobile menu toggle
 */

import { useNavigate } from 'react-router-dom';
import { getUserData } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import './Navbar.css';

function Navbar({ onToggleSidebar }) {
    const navigate = useNavigate();
    const user = getUserData();
    const { language, changeLanguage, languages } = useLanguage();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <button className="mobile-menu-btn" onClick={onToggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
                <div className="navbar-brand">
                    <i className="fas fa-utensils"></i> Smart Menu
                </div>
            </div>
            
            <div className="navbar-right">
                {/* Language Switcher - Available on ALL pages */}
                <select 
                    className="language-switcher"
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    title="Change Language"
                    aria-label="Select Language"
                >
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                        </option>
                    ))}
                </select>
                
                <div className="navbar-user">
                    <div className="user-info">
                        <span>Welcome, {user.username || 'Admin'}</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
