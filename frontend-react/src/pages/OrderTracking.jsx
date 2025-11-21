import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderTracking.css';

function OrderTracking() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderNumber = searchParams.get('order');
    const tableId = searchParams.get('table');
    
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (orderNumber) {
            loadOrderStatus();
            // Refresh every 10 seconds
            const interval = setInterval(loadOrderStatus, 10000);
            return () => clearInterval(interval);
        } else {
            setError('Namba ya oda haijatumwa. / Order number not provided.');
            setLoading(false);
        }
    }, [orderNumber]);

    const loadOrderStatus = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/public/order/${orderNumber}`
            );
            setOrder(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading order:', err);
            setError('Hitilafu katika kupakia oda. / Error loading order status.');
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return '⏳';
            case 'CONFIRMED': return '✅';
            case 'PREPARING': return '👨‍🍳';
            case 'READY': return '🔔';
            case 'SERVED': return '✅';
            case 'CANCELLED': return '❌';
            default: return '📋';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Inasubiri / Pending';
            case 'CONFIRMED': return 'Imethibitishwa / Confirmed';
            case 'PREPARING': return 'Inaandaliwa / Preparing';
            case 'READY': return 'Imemaliza / Ready';
            case 'SERVED': return 'Imetolewa / Served';
            case 'CANCELLED': return 'Imefutwa / Cancelled';
            default: return status;
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('sw-TZ').format(price) + ' TSH';
    };

    if (loading) {
        return (
            <div className="order-tracking-container">
                <div className="loading-center">
                    <div className="spinner"></div>
                    <p>Inapakia oda... / Loading order...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-tracking-container">
                <div className="error-center">
                    <i className="fas fa-exclamation-circle"></i>
                    <h3>{error}</h3>
                    <button 
                        className="back-button"
                        onClick={() => navigate(`/customer-menu?table=${tableId}`)}
                    >
                        ← Rudi Kwenye Menyu / Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="order-tracking-container">
            <div className="tracking-header">
                <button 
                    className="back-btn"
                    onClick={() => navigate(`/customer-menu?table=${tableId}`)}
                >
                    ← Rudi / Back
                </button>
                <h1>🍽️ Ufuatiliaji wa Oda / Order Tracking</h1>
            </div>

            <div className="order-card">
                <div className="order-header">
                    <div>
                        <h2>Oda #{order.orderNumber}</h2>
                        <p className="table-info">Meza / Table: {order.tableNumber}</p>
                        <p className="order-time">
                            {new Date(order.createdAt).toLocaleString('sw-TZ', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                            })}
                        </p>
                    </div>
                    <div className="status-badge" data-status={order.status}>
                        <span className="status-icon">{getStatusIcon(order.status)}</span>
                        <span className="status-text">{getStatusText(order.status)}</span>
                    </div>
                </div>

                <div className="status-timeline">
                    <div className={`timeline-step ${['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED'].includes(order.status) ? 'active' : ''}`}>
                        <div className="step-icon">⏳</div>
                        <div className="step-label">Imepokelewa / Received</div>
                    </div>
                    <div className={`timeline-step ${['CONFIRMED', 'PREPARING', 'READY', 'SERVED'].includes(order.status) ? 'active' : ''}`}>
                        <div className="step-icon">✅</div>
                        <div className="step-label">Imethibitishwa / Confirmed</div>
                    </div>
                    <div className={`timeline-step ${['PREPARING', 'READY', 'SERVED'].includes(order.status) ? 'active' : ''}`}>
                        <div className="step-icon">👨‍🍳</div>
                        <div className="step-label">Inaandaliwa / Preparing</div>
                    </div>
                    <div className={`timeline-step ${['READY', 'SERVED'].includes(order.status) ? 'active' : ''}`}>
                        <div className="step-icon">🔔</div>
                        <div className="step-label">Iko tayari / Ready</div>
                    </div>
                    <div className={`timeline-step ${order.status === 'SERVED' ? 'active' : ''}`}>
                        <div className="step-icon">✅</div>
                        <div className="step-label">Imetolewa / Served</div>
                    </div>
                </div>

                <div className="order-items">
                    <h3>Vyakula Vilivyoagizwa / Ordered Items</h3>
                    {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                            <div className="item-details">
                                <span className="item-name">{item.itemName}</span>
                                {item.specialInstructions && (
                                    <span className="item-note">📝 {item.specialInstructions}</span>
                                )}
                            </div>
                            <div className="item-quantity">x{item.quantity}</div>
                            <div className="item-price">{formatPrice(item.price * item.quantity)}</div>
                        </div>
                    ))}
                </div>

                <div className="order-total">
                    <span>Jumla / Total:</span>
                    <span className="total-amount">{formatPrice(order.total)}</span>
                </div>

                {order.status === 'SERVED' && (
                    <button 
                        className="feedback-button"
                        onClick={() => navigate(`/feedback?order=${order.orderNumber}&table=${tableId}`)}
                    >
                        ⭐ Toa Maoni / Give Feedback
                    </button>
                )}
            </div>
        </div>
    );
}

export default OrderTracking;
