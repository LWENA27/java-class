/**
 * DAILY MENU COMPONENT - React Version
 * Based on smart-menu-qr admin/daily-menu.php
 * 
 * Features:
 * - Select specific date to manage menu
 * - Add menu items to daily menu with special pricing
 * - Toggle item availability
 * - Remove items from daily menu
 * - View all items for selected date
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, isLoggedIn } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './DailyMenu.css';

function DailyMenu() {
    const { t } = useLanguage();
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    
    // Sidebar toggle
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Selected date
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // All menu items (for dropdown)
    const [allMenuItems, setAllMenuItems] = useState([]);
    
    // Daily menu items
    const [dailyMenuItems, setDailyMenuItems] = useState([]);
    
    // Loading states
    const [loading, setLoading] = useState(true);
    
    // Messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Form data for adding/editing
    const [formData, setFormData] = useState({
        id: null,
        menu_item_id: '',
        special_price: '',
        is_available: true
    });

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
            return;
        }
        
        const userData = getUserData();
        setUser(userData);
        
        loadAllMenuItems();
    }, [navigate]);

    useEffect(() => {
        loadDailyMenuItems();
    }, [selectedDate]);

    // Load all menu items for dropdown
    const loadAllMenuItems = async () => {
        try {
            // TODO: Replace with real API call
            // const response = await api.get('/api/menu-items');
            
            // Mock data
            const mockData = [
                { id: 1, name: 'Ugali & Fish', category_name: 'Main Dishes', category_id: 1, price: 15000 },
                { id: 2, name: 'Chips Mayai', category_name: 'Main Dishes', category_id: 1, price: 6000 },
                { id: 3, name: 'Pilau & Chicken', category_name: 'Main Dishes', category_id: 1, price: 12000 },
                { id: 4, name: 'Rice', category_name: 'Sides', category_id: 2, price: 2000 },
                { id: 5, name: 'Chapati', category_name: 'Sides', category_id: 2, price: 1000 },
                { id: 6, name: 'Soda', category_name: 'Drinks', category_id: 3, price: 1500 },
                { id: 7, name: 'Juice', category_name: 'Drinks', category_id: 3, price: 3000 }
            ];
            
            setAllMenuItems(mockData);
        } catch (err) {
            console.error('Error loading menu items:', err);
            setError('Failed to load menu items');
        }
    };

    // Load daily menu items for selected date
    const loadDailyMenuItems = async () => {
        try {
            setLoading(true);
            
            // TODO: Replace with real API call
            // const response = await api.get(`/api/daily-menu?date=${selectedDate}`);
            
            // Mock data - only if today's date
            const today = new Date().toISOString().split('T')[0];
            let mockData = [];
            
            if (selectedDate === today) {
                mockData = [
                    {
                        id: 1,
                        menu_item_id: 1,
                        item_name: 'Ugali & Fish',
                        category_name: 'Main Dishes',
                        original_price: 15000,
                        special_price: 13000,
                        is_available: true,
                        photo: null,
                        category_id: 1
                    },
                    {
                        id: 2,
                        menu_item_id: 2,
                        item_name: 'Chips Mayai',
                        category_name: 'Main Dishes',
                        original_price: 6000,
                        special_price: null,
                        is_available: true,
                        photo: null,
                        category_id: 1
                    }
                ];
            }
            
            setDailyMenuItems(mockData);
            setError('');
        } catch (err) {
            console.error('Error loading daily menu:', err);
            setError('Failed to load daily menu');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleAddClick = () => {
        setIsEditMode(false);
        resetForm();
        setIsModalOpen(true);
    };

    const handleEditClick = (item) => {
        setIsEditMode(true);
        setFormData({
            id: item.id,
            menu_item_id: item.menu_item_id,
            special_price: item.special_price || '',
            is_available: item.is_available
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.menu_item_id) {
            setError(t('menuItem') + ' ' + t('required'));
            return;
        }
        
        if (formData.special_price && formData.special_price < 0) {
            setError(t('priceRequired'));
            return;
        }
        
        try {
            // TODO: Replace with real API call
            
            if (isEditMode) {
                // Update existing daily menu item
                setDailyMenuItems(prev => prev.map(item =>
                    item.id === formData.id
                        ? {
                            ...item,
                            special_price: formData.special_price ? parseFloat(formData.special_price) : null,
                            is_available: formData.is_available
                        }
                        : item
                ));
                setSuccess(t('itemUpdatedInDailyMenu'));
            } else {
                // Add new item to daily menu
                const menuItem = allMenuItems.find(item => item.id === parseInt(formData.menu_item_id));
                if (!menuItem) {
                    setError('Menu item not found');
                    return;
                }
                
                const newItem = {
                    id: Date.now(),
                    menu_item_id: parseInt(formData.menu_item_id),
                    item_name: menuItem.name,
                    category_name: menuItem.category_name,
                    category_id: menuItem.category_id,
                    original_price: menuItem.price,
                    special_price: formData.special_price ? parseFloat(formData.special_price) : null,
                    is_available: formData.is_available,
                    photo: null
                };
                
                setDailyMenuItems(prev => [...prev, newItem]);
                setSuccess(t('itemAddedToDailyMenu'));
            }
            
            handleCloseModal();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error saving:', err);
            setError('Failed to save item');
        }
    };

    const handleToggleAvailability = async (id) => {
        try {
            // TODO: Replace with real API call
            
            setDailyMenuItems(prev => prev.map(item =>
                item.id === id
                    ? { ...item, is_available: !item.is_available }
                    : item
            ));
        } catch (err) {
            console.error('Error updating availability:', err);
            setError('Failed to update availability');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('removeDailyMenuConfirm'))) {
            return;
        }
        
        try {
            // TODO: Replace with real API call
            
            setDailyMenuItems(prev => prev.filter(item => item.id !== id));
            setSuccess(t('itemRemovedFromDailyMenu'));
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting:', err);
            setError('Failed to remove item');
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            menu_item_id: '',
            special_price: '',
            is_available: true
        });
    };

    const getCategoryName = (categoryId) => {
        const categories = {
            1: t('mainDishes'),
            2: t('sides'),
            3: t('drinks'),
            4: t('desserts')
        };
        return categories[categoryId] || 'Unknown';
    };

    const formatPrice = (price) => {
        return price ? `${parseFloat(price).toLocaleString()} TSH` : 'N/A';
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
                            <h1>{t('dailyMenu')}</h1>
                            <p className="subtitle">{t('dailyMenuSubtitle')}</p>
                        </div>
                    </div>

                    {success && (
                        <div className="success-message">
                            <i className="fas fa-check-circle"></i>
                            <p>{success}</p>
                        </div>
                    )}

                    {error && !isModalOpen && (
                        <div className="error-container">
                            <p className="error-message">{error}</p>
                        </div>
                    )}

                    {/* Date Selector */}
                    <div className="content-card">
                        <div className="card-header">
                            <h2>{t('selectDate')}</h2>
                        </div>
                        <div className="date-selector">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="date-input"
                            />
                            <button 
                                className="btn btn-primary"
                                onClick={handleAddClick}
                            >
                                <i className="fas fa-plus"></i>
                                {t('addToDailyMenu')}
                            </button>
                        </div>
                    </div>

                    {/* Daily Menu Table */}
                    <div className="content-card">
                        <div className="card-header">
                            <h2>{t('dailyMenu')} ({selectedDate})</h2>
                        </div>
                        
                        {loading ? (
                            <div className="loading-center">
                                <i className="fas fa-spinner fa-spin fa-2x"></i>
                                <p>{t('loading')}</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>{t('category')}</th>
                                            <th>{t('name')}</th>
                                            <th>{t('originalPrice')}</th>
                                            <th>{t('specialPrice')}</th>
                                            <th>{t('status')}</th>
                                            <th>{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyMenuItems.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="no-data">
                                                    {t('noDailyMenuItems')}
                                                </td>
                                            </tr>
                                        ) : (
                                            dailyMenuItems.map(item => (
                                                <tr key={item.id}>
                                                    <td>{getCategoryName(item.category_id)}</td>
                                                    <td className="font-weight-bold">{item.item_name}</td>
                                                    <td>{formatPrice(item.original_price)}</td>
                                                    <td className="special-price">
                                                        {item.special_price ? (
                                                            <span className="badge badge-success">
                                                                {formatPrice(item.special_price)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted">N/A</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <label className="toggle-switch">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.is_available}
                                                                onChange={() => handleToggleAvailability(item.id)}
                                                            />
                                                            <span className="toggle-slider"></span>
                                                        </label>
                                                        <span className={`status-text ${item.is_available ? 'available' : 'unavailable'}`}>
                                                            {item.is_available ? t('available') : t('notAvailable')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="actions">
                                                            <button
                                                                className="btn-icon btn-edit"
                                                                onClick={() => handleEditClick(item)}
                                                                title={t('edit')}
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                className="btn-icon btn-delete"
                                                                onClick={() => handleDelete(item.id)}
                                                                title={t('delete')}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Add/Edit Modal */}
                    {isModalOpen && (
                        <div className="modal-overlay" onClick={handleCloseModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>
                                        {isEditMode ? t('edit') : t('addToDailyMenu')}
                                    </h2>
                                    <button
                                        className="modal-close"
                                        onClick={handleCloseModal}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>

                                {error && (
                                    <div className="error-container">
                                        <p className="error-message">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="modal-form">
                                    {!isEditMode && (
                                        <div className="form-group">
                                            <label htmlFor="menu_item_id">
                                                {t('menuItem')} <span className="required">*</span>
                                            </label>
                                            <select
                                                id="menu_item_id"
                                                name="menu_item_id"
                                                value={formData.menu_item_id}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">{t('selectItem')}</option>
                                                {allMenuItems.map(item => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.category_name} - {item.name} ({formatPrice(item.price)})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="special_price">
                                            {t('specialPriceOptional')}
                                        </label>
                                        <input
                                            type="number"
                                            id="special_price"
                                            name="special_price"
                                            value={formData.special_price}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 12000"
                                            min="0"
                                            step="100"
                                        />
                                    </div>

                                    <div className="checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="is_available"
                                                checked={formData.is_available}
                                                onChange={handleInputChange}
                                            />
                                            <span>{t('availableLabel')}</span>
                                        </label>
                                    </div>

                                    <div className="modal-actions">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleCloseModal}
                                        >
                                            {t('cancel')}
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            <i className="fas fa-save"></i>
                                            {isEditMode ? t('updateItem') : t('addItem')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
}

export default DailyMenu;
