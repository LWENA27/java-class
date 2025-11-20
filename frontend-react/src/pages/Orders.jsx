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
import { getUserData, isLoggedIn } from '../services/api';
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

    // 🎓 LESSON: Load orders from server (mock data for now)
    const loadOrders = async () => {
        try {
            setLoading(true);
            
            // TODO: Replace with real API call
            // const response = await api.get('/api/orders');
            // setOrders(response.data);
            
            // Mock data for teaching
            const mockData = [
                {
                    id: 1,
                    order_number: 'ORD-001',
                    table_number: 'Table 5',
                    is_room: false,
                    location: 'Indoor',
                    total_amount: 45000,
                    status: 'delivered',
                    payment_status: 'completed',
                    notes: 'Extra spicy',
                    created_at: '2024-11-20 14:30:00'
                },
                {
                    id: 2,
                    order_number: 'ORD-002',
                    table_number: 'Room 2',
                    is_room: true,
                    location: 'Second Floor',
                    total_amount: 78000,
                    status: 'preparing',
                    payment_status: 'pending',
                    notes: null,
                    created_at: '2024-11-20 15:00:00'
                },
                {
                    id: 3,
                    order_number: 'ORD-003',
                    table_number: 'Table 1',
                    is_room: false,
                    location: 'Outdoor',
                    total_amount: 32000,
                    status: 'confirmed',
                    payment_status: 'pending',
                    notes: 'No onions',
                    created_at: '2024-11-20 15:15:00'
                }
            ];
            
            setOrders(mockData);
            setError('');
        } catch (err) {
            setError('Failed to load orders. Please try again.');
            console.error('Load error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 🎓 LESSON: Update order status
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // TODO: Replace with real API call
            // await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
            
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

    // 🎓 LESSON: Toggle payment status
    const handlePaymentToggle = async (orderId, isPaid) => {
        try {
            // TODO: Replace with real API call
            // await api.put(`/api/orders/${orderId}/payment`, { paid: isPaid });
            
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

    // 🎓 LESSON: View order details
    const handleViewOrder = async (orderId) => {
        try {
            // TODO: Replace with real API call
            // const response = await api.get(`/api/orders/${orderId}`);
            // setSelectedOrder(response.data.order);
            // setOrderItems(response.data.items);
            
            // Mock data for teaching
            const order = orders.find(o => o.id === orderId);
            if (order) {
                setSelectedOrder(order);
                
                // Mock order items
                const mockItems = [
                    {
                        id: 1,
                        item_name: 'Ugali & Fish',
                        quantity: 2,
                        unit_price: 15000,
                        special_instructions: 'Extra spicy',
                        customizations: [
                            { option_name: 'Extra sauce', price_adjustment: 1000 }
                        ]
                    },
                    {
                        id: 2,
                        item_name: 'Chips Mayai',
                        quantity: 1,
                        unit_price: 6000,
                        special_instructions: null,
                        customizations: []
                    }
                ];
                
                setOrderItems(mockItems);
                setIsModalOpen(true);
            }
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
