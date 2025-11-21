/**
 * 🎓 LESSON: Menu Management Component - MODAL UI/UX VERSION
 * 
 * WHAT'S NEW IN THIS IMPROVED VERSION?
 * - Page shows Menu Items list FIRST (cleaner design)
 * - "Add Menu Item" button at top opens a MODAL (popup dialog)
 * - Edit also opens in modal (consistent user experience)
 * - Modal can be closed by clicking X, Cancel, or outside the modal
 * - Better organization: View and Add/Edit are separate
 * 
 * 🎓 WHAT IS A MODAL?
 * A modal is a popup dialog box that appears over the page.
 * Examples you've seen:
 * - "Are you sure you want to delete?" popup
 * - Login forms that pop up
 * - Image viewers that appear on top of page
 * 
 * WHY USE A MODAL?
 * - Focuses user attention on one task
 * - Keeps the page clean (form not always visible)
 * - Modern, professional UI
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, isLoggedIn } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './MenuManagement.css';

function MenuManagement() {
    // 🎓 LESSON: useLanguage Hook - Get translation function
    const { t } = useLanguage(); // Language switcher now in Navbar component
    // 🎓 LESSON: useState Hook - React's way to store changing data
    
    // User authentication
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    
    // Sidebar toggle for mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // List of all menu items
    const [menuItems, setMenuItems] = useState([]);
    
    // Loading state
    const [loading, setLoading] = useState(true);
    
    // Error and success messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // 🎓 NEW: Modal state (is the popup open or closed?)
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 🎓 NEW: Edit mode (are we editing or adding new?)
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Form data
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        description: '',
        price: '',
        category_id: '',
        stock: 0,
        is_available: true,
        photo: null
    });

    // 🎓 LESSON: useEffect - Runs when page loads
    useEffect(() => {
        // Check if user is logged in
        if (!isLoggedIn()) {
            navigate('/login');
            return;
        }
        
        // Get user data
        const userData = getUserData();
        setUser(userData);
        
        // Load menu items
        loadMenuItems();
    }, [navigate]);

    // Load menu items from server
    const loadMenuItems = async () => {
        try {
            setLoading(true);
            
            // Real API call to get menu items
            const api = (await import('../services/api')).default;
            const response = await api.get('/menu-items');
            setMenuItems(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load menu items. Please try again.');
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 🎓 LESSON: Open modal for ADDING new item
    const handleAddClick = () => {
        setIsEditMode(false);  // We're adding, not editing
        resetForm();           // Clear the form
        setIsModalOpen(true);  // Open the modal popup
    };

    // 🎓 LESSON: Open modal for EDITING existing item
    const handleEditClick = (item) => {
        setIsEditMode(true);   // We're editing, not adding
        setFormData({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category_id: item.category_id,
            stock: item.stock,
            is_available: item.is_available,
            photo: null  // Keep existing photo
        });
        setIsModalOpen(true);  // Open the modal popup
    };

    // 🎓 LESSON: Close modal and reset form
    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
        setError('');
    };

    // 🎓 LESSON: Handle input changes in form
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 🎓 LESSON: Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setError(t('fileTooLarge'));
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError(t('invalidFileType'));
                return;
            }
            
            setFormData(prev => ({ ...prev, photo: file }));
            setError('');
        }
    };

    // 🎓 LESSON: Submit form (add or edit)
    const handleSubmit = async (e) => {
        e.preventDefault();  // Don't reload page
        
        // Validate
        if (!formData.name.trim()) {
            setError(t('nameRequired'));
            return;
        }
        
        if (!formData.price || formData.price <= 0) {
            setError(t('priceRequired'));
            return;
        }
        
        if (!formData.category_id) {
            setError(t('categoryRequired'));
            return;
        }
        
        try {
            // TODO: Replace with real API call
            // const formDataToSend = new FormData();
            // formDataToSend.append('name', formData.name);
            // ... etc
            
            if (isEditMode) {
                // Update existing item
                setMenuItems(prev => prev.map(item => 
                    item.id === formData.id 
                        ? { ...item, ...formData, price: parseFloat(formData.price) }
                        : item
                ));
                setSuccess(t('itemUpdated'));
            } else {
                // Add new item
                const newItem = {
                    ...formData,
                    id: Date.now(), // Mock ID
                    price: parseFloat(formData.price)
                };
                setMenuItems(prev => [...prev, newItem]);
                setSuccess(t('itemAdded'));
            }
            
            handleCloseModal();  // Close popup
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to save menu item. Please try again.');
            console.error('Save error:', err);
        }
    };

    // 🎓 LESSON: Delete item with confirmation
    const handleDelete = async (id) => {
        if (!window.confirm(t('deleteConfirm'))) {
            return;
        }
        
        try {
            // TODO: Replace with real API call
            // await api.delete(`/api/menu-items/${id}`);
            
            setMenuItems(prev => prev.filter(item => item.id !== id));
            setSuccess(t('itemDeleted'));
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete item. Please try again.');
            console.error('Delete error:', err);
        }
    };

    // 🎓 LESSON: Copy/duplicate item
    const handleCopy = (item) => {
        setIsEditMode(false);
        setFormData({
            id: null,
            name: `${item.name} (Copy)`,
            description: item.description,
            price: item.price,
            category_id: item.category_id,
            stock: item.stock,
            is_available: item.is_available,
            photo: null
        });
        setIsModalOpen(true);
    };

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            id: null,
            name: '',
            description: '',
            price: '',
            category_id: '',
            stock: 0,
            is_available: true,
            photo: null
        });
    };

    // Helper: Get category name by ID
    const getCategoryName = (categoryId) => {
        const categories = {
            1: t('mainDishes'),
            2: t('sides'),
            3: t('drinks'),
            4: t('desserts')
        };
        return categories[categoryId] || 'Unknown';
    };

    // Helper: Format price
    const formatPrice = (price) => {
        return `${parseFloat(price).toLocaleString()} TSH`;
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
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
                {/* Page Header (Title and Add Button) */}
                <div className="page-header">
                    <div className="header-content">
                        <h1>{t('menuItems')}</h1>
                        <p className="subtitle">{t('menuSubtitle')}</p>
                    </div>
                    
                    {/* Add Menu Item Button */}
                    <button 
                        className="btn btn-primary"
                        onClick={handleAddClick}
                    >
                        <i className="fas fa-plus"></i>
                        {t('addMenuItem')}
                    </button>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="success-message">
                        <i className="fas fa-check-circle"></i>
                        <p>{success}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && !isModalOpen && (
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                    </div>
                )}

                {/* Menu Items Table */}
                <div className="content-card">
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
                                        <th>{t('id')}</th>
                                        <th>{t('name')}</th>
                                        <th>{t('description')}</th>
                                        <th>{t('price')}</th>
                                        <th>{t('category')}</th>
                                        <th>{t('stock')}</th>
                                        <th>{t('status')}</th>
                                        <th>{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menuItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="no-data">
                                                {t('noData')}
                                            </td>
                                        </tr>
                                    ) : (
                                        menuItems.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td className="font-weight-bold">{item.name}</td>
                                                <td>{item.description}</td>
                                                <td className="font-weight-bold">{formatPrice(item.price)}</td>
                                                <td>{getCategoryName(item.category_id)}</td>
                                                <td>{item.stock}</td>
                                                <td>
                                                    <span className={`badge ${item.is_available ? 'badge-success' : 'badge-danger'}`}>
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
                                                            className="btn-icon btn-copy"
                                                            onClick={() => handleCopy(item)}
                                                            title={t('copy')}
                                                        >
                                                            <i className="fas fa-copy"></i>
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

                {/* 🎓 NEW: MODAL DIALOG for Add/Edit */}
                {/* This appears as a popup over the page */}
                {isModalOpen && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="modal-header">
                                <h2>
                                    {isEditMode ? t('editMenuItem') : t('addMenuItem')}
                                </h2>
                                <button 
                                    className="modal-close"
                                    onClick={handleCloseModal}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Error in Modal */}
                            {error && (
                                <div className="error-container">
                                    <p className="error-message">{error}</p>
                                </div>
                            )}

                            {/* Modal Form */}
                            <form onSubmit={handleSubmit} className="modal-form">
                                {/* Name */}
                                <div className="form-group">
                                    <label htmlFor="name">
                                        {t('nameLabel')} <span className="required">{t('required')}</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder={t('namePlaceholder')}
                                    />
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label htmlFor="description">{t('descriptionLabel')}</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder={t('descriptionPlaceholder')}
                                        rows="3"
                                    ></textarea>
                                </div>

                                {/* Price and Category */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="price">
                                            {t('priceLabel')} <span className="required">{t('required')}</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder={t('pricePlaceholder')}
                                            min="0"
                                            step="100"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category_id">
                                            {t('categoryLabel')} <span className="required">{t('required')}</span>
                                        </label>
                                        <select
                                            id="category_id"
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">{t('selectCategory')}</option>
                                            <option value="1">{t('mainDishes')}</option>
                                            <option value="2">{t('sides')}</option>
                                            <option value="3">{t('drinks')}</option>
                                            <option value="4">{t('desserts')}</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Stock */}
                                <div className="form-group">
                                    <label htmlFor="stock">{t('stockLabel')}</label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder={t('stockPlaceholder')}
                                        min="0"
                                    />
                                </div>

                                {/* Photo Upload */}
                                <div className="form-group">
                                    <label htmlFor="photo">{t('photoLabel')}</label>
                                    <input
                                        type="file"
                                        id="photo"
                                        name="photo"
                                        onChange={handleFileChange}
                                        accept="image/jpeg,image/png,image/jpg"
                                    />
                                    <small className="form-text">
                                        {t('fileHint')}
                                    </small>
                                </div>

                                {/* Available Checkbox */}
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

                                {/* Modal Actions */}
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

export default MenuManagement;
