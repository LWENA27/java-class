/**
 * 🎓 LESSON: Orders Management Component
 * 
 * PURPOSE:
 * This component allows restaurant staff to:
 * - View all customer orders
 * - Update order status (pending → confirmed → preparing → ready → delivered)
 * - Mark orders as paid/unpaid
 * - View detailed order information (items, customizations, notes)
 * 
 * KEY FEATURES:
 * - Real-time order management
 * - Status dropdown with instant update
 * - Payment checkbox toggle
 * - Modal popup for order details
 * - Multi-language support
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUserData, isLoggedIn } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import './Orders.css';

function Orders() {
    const { t } = useLanguage();
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    
    // Sidebar toggle for mobile
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // List of all orders
    const [orders, setOrders] = useState([]);
    
    // Loading state
    const [loading, setLoading] = useState(true);
    
    // Error and success messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Modal state for viewing order details
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    
    // Select all checkbox
    const [selectAll, setSelectAll] = useState(false);

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
        
        // Load orders
        loadOrders();
    }, [navigate]);

    // Load orders from server
    const loadOrders = async () => {
        try {
            setLoading(true);
            
            // Real API call to get orders
            const response = await api.get('/orders');
            
            // Transform the data to match the expected format
            const transformedOrders = response.data.map(order => ({
                id: order.id,
                order_number: order.orderNumber || `ORD-${order.id.substring(0, 8)}`,
                table_number: order.tableNumber || 'N/A',
                is_room: false, // Can be extended later
                location: 'Restaurant',
                total_amount: order.total,
                status: order.status ? order.status.toLowerCase() : 'pending',
                payment_status: 'pending', // Can be added to Order model later
                notes: order.customerNotes,
                created_at: order.createdAt,
                items: order.items || []
            }));
            
            setOrders(transformedOrders);
            setError('');
        } catch (err) {
            setError('Failed to load orders. Please try again.');
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update order status
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Real API call to update order status
            await api.put(`/orders/${orderId}`, { 
                status: newStatus.toUpperCase() 
            });
            
            // Update local state
            setOrders(prev => prev.map(order => 
                order.id === orderId 
                    ? { ...order, status: newStatus }
                    : order
            ));
            
            setSuccess(t('orderStatusUpdated'));
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(t('failedToUpdateStatus'));
            console.error('Status update error:', err);
            setTimeout(() => setError(''), 3000);
        }
    };

    // Toggle payment status (local only for now - can be added to backend later)
    const handlePaymentToggle = async (orderId, isPaid) => {
        try {
            // Note: Payment status can be added to the Order model in the backend
            // For now, we'll just update local state
            
            // Update local state
            setOrders(prev => prev.map(order => 
                order.id === orderId 
                    ? { ...order, payment_status: isPaid ? 'completed' : 'pending' }
                    : order
            ));
            
            setSuccess(t('paymentStatusUpdated'));
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(t('failedToUpdateStatus'));
            console.error('Payment update error:', err);
            setTimeout(() => setError(''), 3000);
        }
    };

    // View order details
    const handleViewOrder = async (orderId) => {
        try {
            // Real API call to get order details
            const response = await api.get(`/orders/${orderId}`);
            const order = response.data;
            
            // Set selected order
            setSelectedOrder({
                id: order.id,
                order_number: order.orderNumber || `ORD-${order.id.substring(0, 8)}`,
                table_number: order.tableNumber || 'N/A',
                is_room: false,
                location: 'Restaurant',
                total_amount: order.total,
                status: order.status ? order.status.toLowerCase() : 'pending',
                notes: order.customerNotes,
                created_at: order.createdAt
            });
            
            // Transform order items
            const transformedItems = order.items.map((item, index) => ({
                id: index + 1,
                item_name: item.menuItemName,
                quantity: item.quantity,
                unit_price: item.price,
                special_instructions: item.specialInstructions,
                customizations: [] // Can be extended later
            }));
            
            setOrderItems(transformedItems);
            setIsModalOpen(true);
        } catch (err) {
            setError(t('orderNotFound'));
            console.error('View order error:', err);
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setOrderItems([]);
    };

    // Handle select all checkbox
    const handleSelectAll = (checked) => {
        setSelectAll(checked);
        // In a real app, you would update selected orders here
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

    // Helper: Get status badge class
    const getStatusClass = (status) => {
        const statusClasses = {
            'pending': 'status-pending',
            'confirmed': 'status-confirmed',
            'preparing': 'status-preparing',
            'ready': 'status-ready',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return statusClasses[status] || 'status-pending';
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
                            <h1>{t('manageOrders')}</h1>
                            <p className="subtitle">{t('ordersSubtitle')}</p>
                        </div>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="success-message">
                            <i className="fas fa-check-circle"></i>
                            <p>{success}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="error-container">
                            <p className="error-message">{error}</p>
                        </div>
                    )}

                    {/* Orders Table */}
                    <div className="content-card">
                        {loading ? (
                            <div className="loading-center">
                                <i className="fas fa-spinner fa-spin fa-2x"></i>
                                <p>{t('loadingOrders')}</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectAll}
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                    title={t('selectAll')}
                                                />
                                            </th>
                                            <th>{t('orderNumber')}</th>
                                            <th>{t('tableRoom')}</th>
                                            <th>{t('totalAmount')}</th>
                                            <th>{t('status')}</th>
                                            <th>{t('orderDate')}</th>
                                            <th>{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="no-data">
                                                    {t('noOrders')}
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map(order => (
                                                <tr key={order.id}>
                                                    <td>
                                                        <input 
                                                            type="checkbox" 
                                                            name="order_ids[]"
                                                            value={order.id}
                                                        />
                                                    </td>
                                                    <td className="font-weight-bold">{order.order_number}</td>
                                                    <td>
                                                        {order.table_number} 
                                                        <span className="table-type">
                                                            ({order.is_room ? t('room') : t('table')})
                                                        </span>
                                                    </td>
                                                    <td className="font-weight-bold">{formatPrice(order.total_amount)}</td>
                                                    <td>
                                                        <select 
                                                            className={`status-select ${getStatusClass(order.status)}`}
                                                            value={order.status}
                                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        >
                                                            <option value="pending">{t('pending')}</option>
                                                            <option value="confirmed">{t('confirmed')}</option>
                                                            <option value="preparing">{t('preparing')}</option>
                                                            <option value="ready">{t('ready')}</option>
                                                            <option value="delivered">{t('delivered')}</option>
                                                            <option value="cancelled">{t('cancelled')}</option>
                                                        </select>
                                                    </td>
                                                    <td>{formatDateTime(order.created_at)}</td>
                                                    <td>
                                                        <div className="actions">
                                                            <label className="paid-checkbox-label">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={order.payment_status === 'completed'}
                                                                    onChange={(e) => handlePaymentToggle(order.id, e.target.checked)}
                                                                />
                                                                <span>{t('paid')}</span>
                                                            </label>
                                                            <button 
                                                                className="btn btn-primary btn-small"
                                                                onClick={() => handleViewOrder(order.id)}
                                                                title={t('view')}
                                                            >
                                                                <i className="fas fa-eye"></i> {t('view')}
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

                    {/* Order Details Modal */}
                    {isModalOpen && selectedOrder && (
                        <div className="modal-overlay" onClick={handleCloseModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                {/* Modal Header */}
                                <div className="modal-header">
                                    <h2>{t('orderDetails')}</h2>
                                    <button 
                                        className="modal-close"
                                        onClick={handleCloseModal}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>

                                {/* Order Information */}
                                <div className="order-info">
                                    <div className="info-row">
                                        <strong>{t('orderNumber')}:</strong>
                                        <span>{selectedOrder.order_number}</span>
                                    </div>
                                    <div className="info-row">
                                        <strong>{t('tableRoom')}:</strong>
                                        <span>
                                            {selectedOrder.table_number} 
                                            ({selectedOrder.is_room ? t('room') : t('table')})
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <strong>{t('location')}:</strong>
                                        <span>{selectedOrder.location}</span>
                                    </div>
                                    <div className="info-row">
                                        <strong>{t('totalAmount')}:</strong>
                                        <span className="amount-highlight">{formatPrice(selectedOrder.total_amount)}</span>
                                    </div>
                                    <div className="info-row">
                                        <strong>{t('status')}:</strong>
                                        <span className={`badge ${getStatusClass(selectedOrder.status)}`}>
                                            {t(selectedOrder.status)}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <strong>{t('notes')}:</strong>
                                        <span>{selectedOrder.notes || t('none')}</span>
                                    </div>
                                    <div className="info-row">
                                        <strong>{t('orderDate')}:</strong>
                                        <span>{formatDateTime(selectedOrder.created_at)}</span>
                                    </div>
                                </div>

                                {/* Order Items Table */}
                                <h3>{t('items')}</h3>
                                <div className="table-container">
                                    <table className="data-table modal-table">
                                        <thead>
                                            <tr>
                                                <th>{t('name')}</th>
                                                <th>{t('quantity')}</th>
                                                <th>{t('unitPrice')}</th>
                                                <th>{t('subtotal')}</th>
                                                <th>{t('specialInstructions')}</th>
                                                <th>{t('customizations')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="no-data">
                                                        {t('noItemsInOrder')}
                                                    </td>
                                                </tr>
                                            ) : (
                                                orderItems.map(item => (
                                                    <tr key={item.id}>
                                                        <td>{item.item_name}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{formatPrice(item.unit_price)}</td>
                                                        <td className="font-weight-bold">
                                                            {formatPrice(item.quantity * item.unit_price)}
                                                        </td>
                                                        <td>{item.special_instructions || t('none')}</td>
                                                        <td>
                                                            {item.customizations && item.customizations.length > 0 ? (
                                                                <ul className="customizations-list">
                                                                    {item.customizations.map((custom, index) => (
                                                                        <li key={index}>
                                                                            {custom.option_name} 
                                                                            (+{formatPrice(custom.price_adjustment)})
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                t('none')
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
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

export default Orders;
