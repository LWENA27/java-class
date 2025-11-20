/**
 * 🎓 LESSON: Customer Feedback Component
 * 
 * PURPOSE:
 * This component allows restaurant staff to:
 * - View all customer feedback entries
 * - Filter by date range, rating, order number
 * - Sort by date or rating
 * - Navigate through paginated results
 * 
 * KEY FEATURES:
 * - Advanced filtering (date range, rating, order number)
 * - Multiple sorting options
 * - Pagination with page navigation
 * - Star rating visualization (★★★★★)
 * - Responsive design with collapsible filter panel
 * - Multi-language support
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, isLoggedIn } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './Feedback.css';

function Feedback() {
    const { t } = useLanguage();
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    
    // Sidebar toggle for mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Feedback entries
    const [feedbackEntries, setFeedbackEntries] = useState([]);
    
    // Loading state
    const [loading, setLoading] = useState(true);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalFeedback, setTotalFeedback] = useState(0);
    const itemsPerPage = 10;
    
    // Filters
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        rating: 0,
        orderNumber: '',
        sortBy: 'date_desc'
    });
    
    // Filter panel visibility (for mobile)
    const [showFilters, setShowFilters] = useState(false);

    // 🎓 LESSON: useEffect - Runs when page loads or filters change
    useEffect(() => {
        // Check if user is logged in
        if (!isLoggedIn()) {
            navigate('/login');
            return;
        }
        
        // Get user data
        const userData = getUserData();
        setUser(userData);
        
        // Load feedback
        loadFeedback();
    }, [navigate, currentPage, filters]);

    // 🎓 LESSON: Load feedback from server (mock data for now)
    const loadFeedback = async () => {
        try {
            setLoading(true);
            
            // TODO: Replace with real API call
            // const response = await api.get('/api/feedback', { params: { ...filters, page: currentPage } });
            // setFeedbackEntries(response.data.entries);
            // setTotalPages(response.data.totalPages);
            // setTotalFeedback(response.data.total);
            
            // Mock data for teaching
            const mockData = [
                {
                    id: 1,
                    order_id: 1,
                    order_number: 'ORD-001',
                    table_number: 'Table 5',
                    total_amount: 45000,
                    rating: 5,
                    comments: 'Excellent service and food! Everything was perfect.',
                    created_at: '2024-11-20 14:45:00'
                },
                {
                    id: 2,
                    order_id: 2,
                    order_number: 'ORD-002',
                    table_number: 'Room 2',
                    total_amount: 78000,
                    rating: 4,
                    comments: 'Good food, fast delivery. Could be a bit warmer.',
                    created_at: '2024-11-20 15:30:00'
                },
                {
                    id: 3,
                    order_id: 3,
                    order_number: 'ORD-003',
                    table_number: 'Table 1',
                    total_amount: 32000,
                    rating: 3,
                    comments: 'Average experience. Food was okay but service was slow.',
                    created_at: '2024-11-20 16:00:00'
                },
                {
                    id: 4,
                    order_id: 4,
                    order_number: 'ORD-004',
                    table_number: 'Table 3',
                    total_amount: 55000,
                    rating: 5,
                    comments: 'Amazing! Will definitely come back.',
                    created_at: '2024-11-19 12:30:00'
                },
                {
                    id: 5,
                    order_id: 5,
                    order_number: 'ORD-005',
                    table_number: 'Room 1',
                    total_amount: 120000,
                    rating: 4,
                    comments: 'Great atmosphere and delicious food.',
                    created_at: '2024-11-19 19:15:00'
                }
            ];
            
            // Apply filters (client-side filtering for mock data)
            let filtered = [...mockData];
            
            if (filters.rating > 0) {
                filtered = filtered.filter(f => f.rating === filters.rating);
            }
            
            if (filters.orderNumber) {
                filtered = filtered.filter(f => 
                    f.order_number.toLowerCase().includes(filters.orderNumber.toLowerCase())
                );
            }
            
            // Apply sorting
            filtered.sort((a, b) => {
                switch (filters.sortBy) {
                    case 'date_asc':
                        return new Date(a.created_at) - new Date(b.created_at);
                    case 'rating_desc':
                        return b.rating - a.rating;
                    case 'rating_asc':
                        return a.rating - b.rating;
                    default: // date_desc
                        return new Date(b.created_at) - new Date(a.created_at);
                }
            });
            
            setTotalFeedback(filtered.length);
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));
            
            // Paginate
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setFeedbackEntries(filtered.slice(startIndex, endIndex));
            
        } catch (err) {
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Apply filters
    const handleApplyFilters = () => {
        setCurrentPage(1);
        loadFeedback();
        setShowFilters(false); // Close filter panel on mobile
    };

    // Reset filters
    const handleResetFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            rating: 0,
            orderNumber: '',
            sortBy: 'date_desc'
        });
        setCurrentPage(1);
    };

    // Toggle filter panel (mobile)
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Helper: Render star rating
    const renderStars = (rating) => {
        const filled = '★'.repeat(rating);
        const empty = '☆'.repeat(5 - rating);
        return filled + empty;
    };

    // Helper: Format price
    const formatPrice = (price) => {
        return `${parseFloat(price).toLocaleString()} TSH`;
    };

    // Helper: Format date/time
    const formatDateTime = (datetime) => {
        return new Date(datetime).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Pagination handlers
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
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
                {/* Navigation Bar */}
                <Navbar onToggleSidebar={toggleSidebar} />

                {/* Main Content */}
                <main className="main-content">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="header-content">
                            <h1>{t('customerFeedbackPage')}</h1>
                            <p className="subtitle">{t('feedbackSubtitle')}</p>
                        </div>
                    </div>

                    {/* Feedback Grid - Main Content + Filter Panel */}
                    <div className="feedback-grid">
                        {/* Main Content */}
                        <div className="content-main">
                            <div className="content-card">
                                <div className="card-header-with-actions">
                                    <h2>
                                        {t('totalFeedback')}: {totalFeedback}
                                    </h2>
                                    <button 
                                        className="btn btn-secondary filter-toggle-btn"
                                        onClick={toggleFilters}
                                    >
                                        <i className="fas fa-filter"></i> {t('filters')}
                                    </button>
                                </div>

                                {/* Feedback Table */}
                                {loading ? (
                                    <div className="loading-center">
                                        <i className="fas fa-spinner fa-spin fa-2x"></i>
                                        <p>{t('loadingFeedback')}</p>
                                    </div>
                                ) : (
                                    <div className="table-container">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>{t('feedbackId')}</th>
                                                    <th>{t('orderNumber')}</th>
                                                    <th>{t('tableRoom')}</th>
                                                    <th>{t('orderTotal')}</th>
                                                    <th>{t('rating')}</th>
                                                    <th>{t('comments')}</th>
                                                    <th>{t('dateSubmitted')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {feedbackEntries.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="no-data">
                                                            {t('noFeedbackMatches')}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    feedbackEntries.map(feedback => (
                                                        <tr key={feedback.id}>
                                                            <td>{feedback.id}</td>
                                                            <td className="font-weight-bold">
                                                                {feedback.order_number}
                                                            </td>
                                                            <td>{feedback.table_number}</td>
                                                            <td className="font-weight-bold">
                                                                {formatPrice(feedback.total_amount)}
                                                            </td>
                                                            <td className="rating-stars">
                                                                {renderStars(feedback.rating)}
                                                            </td>
                                                            <td className="comments-cell">
                                                                {feedback.comments || t('noComments')}
                                                            </td>
                                                            <td>{formatDateTime(feedback.created_at)}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button 
                                            className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                        >
                                            « {t('previousPage')}
                                        </button>
                                        
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                                onClick={() => handlePageClick(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        
                                        <button 
                                            className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                        >
                                            {t('nextPage')} »
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Filter Panel */}
                        <aside className={`filter-aside ${showFilters ? 'open' : ''}`}>
                            <div className="filter-panel">
                                <div className="filter-header">
                                    <h3>{t('filters')}</h3>
                                    <button 
                                        className="close-filters-btn"
                                        onClick={toggleFilters}
                                        aria-label={t('closeFilters')}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="filter-form">
                                    {/* Date Range */}
                                    <div className="form-group">
                                        <label htmlFor="startDate">{t('startDate')}:</label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            value={filters.startDate}
                                            onChange={handleFilterChange}
                                            max={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="endDate">{t('endDate')}:</label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            value={filters.endDate}
                                            onChange={handleFilterChange}
                                            max={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    {/* Rating Filter */}
                                    <div className="form-group">
                                        <label htmlFor="rating">{t('rating')}:</label>
                                        <select
                                            id="rating"
                                            name="rating"
                                            value={filters.rating}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="0">{t('allRatings')}</option>
                                            <option value="1">1 {t('star')}</option>
                                            <option value="2">2 {t('stars')}</option>
                                            <option value="3">3 {t('stars')}</option>
                                            <option value="4">4 {t('stars')}</option>
                                            <option value="5">5 {t('stars')}</option>
                                        </select>
                                    </div>

                                    {/* Order Number Filter */}
                                    <div className="form-group">
                                        <label htmlFor="orderNumber">{t('orderNumber')}:</label>
                                        <input
                                            type="text"
                                            id="orderNumber"
                                            name="orderNumber"
                                            value={filters.orderNumber}
                                            onChange={handleFilterChange}
                                            placeholder="e.g., ORD-001"
                                        />
                                    </div>

                                    {/* Sort By */}
                                    <div className="form-group">
                                        <label htmlFor="sortBy">{t('sortBy')}:</label>
                                        <select
                                            id="sortBy"
                                            name="sortBy"
                                            value={filters.sortBy}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="date_desc">{t('dateNewestFirst')}</option>
                                            <option value="date_asc">{t('dateOldestFirst')}</option>
                                            <option value="rating_desc">{t('ratingHighToLow')}</option>
                                            <option value="rating_asc">{t('ratingLowToHigh')}</option>
                                        </select>
                                    </div>

                                    {/* Filter Actions */}
                                    <div className="filter-actions">
                                        <button 
                                            className="btn btn-primary"
                                            onClick={handleApplyFilters}
                                        >
                                            <i className="fas fa-filter"></i> {t('applyFilters')}
                                        </button>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={handleResetFilters}
                                        >
                                            <i className="fas fa-undo"></i> {t('resetFilters')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
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

export default Feedback;
