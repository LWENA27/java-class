import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './CustomerMenu.css';

function CustomerMenu() {
    const [searchParams] = useSearchParams();
    const tableId = searchParams.get('table');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tableInfo, setTableInfo] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [deviceId, setDeviceId] = useState('');
    const [session, setSession] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [showWelcome, setShowWelcome] = useState(false);

    // Generate or retrieve device ID
    useEffect(() => {
        let storedDeviceId = localStorage.getItem('deviceId');
        if (!storedDeviceId) {
            storedDeviceId = 'device-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', storedDeviceId);
        }
        setDeviceId(storedDeviceId);
        
        // Retrieve cart from localStorage
        const storedCart = localStorage.getItem(`cart-${tableId}`);
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, [tableId]);

    // Load menu and check session
    useEffect(() => {
        if (!tableId) {
            setError('No table ID provided. Please scan a valid QR code.');
            setLoading(false);
            return;
        }
        
        if (!deviceId) return;
        
        loadMenuAndSession();
    }, [tableId, deviceId]);

    const loadMenuAndSession = async () => {
        try {
            setLoading(true);
            
            // Load menu
            const menuResponse = await axios.get(
                `http://localhost:8080/api/public/menu/${tableId}?deviceId=${deviceId}`
            );
            
            setTableInfo({
                tableId: menuResponse.data.tableId,
                tableNumber: menuResponse.data.tableNumber
            });
            setMenuItems(menuResponse.data.menuItems || []);
            
            // Check existing session
            const sessionResponse = await axios.get(
                `http://localhost:8080/api/public/session/${deviceId}`
            );
            
            if (sessionResponse.data.isReturningCustomer) {
                setSession(sessionResponse.data);
                setShowWelcome(true);
                setTimeout(() => setShowWelcome(false), 5000);
            }
            
        } catch (err) {
            console.error('Error loading menu:', err);
            setError('Failed to load menu. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (item, quantity = 1, specialInstructions = '') => {
        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: quantity,
            specialInstructions: specialInstructions
        };
        
        const existingIndex = cart.findIndex(i => 
            i.id === item.id && i.specialInstructions === specialInstructions
        );
        
        let newCart;
        if (existingIndex >= 0) {
            newCart = [...cart];
            newCart[existingIndex].quantity += quantity;
        } else {
            newCart = [...cart, cartItem];
        }
        
        setCart(newCart);
        localStorage.setItem(`cart-${tableId}`, JSON.stringify(newCart));
        setShowCart(true);
    };

    const removeFromCart = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
        localStorage.setItem(`cart-${tableId}`, JSON.stringify(newCart));
    };

    const updateCartQuantity = (index, quantity) => {
        if (quantity <= 0) {
            removeFromCart(index);
            return;
        }
        
        const newCart = [...cart];
        newCart[index].quantity = quantity;
        setCart(newCart);
        localStorage.setItem(`cart-${tableId}`, JSON.stringify(newCart));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price) + ' TSH';
    };

    const handleOrder = async () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        if (!customerName.trim()) {
            alert('Please enter your name to place an order.');
            return;
        }
        
        try {
            // Track session with customer name
            await axios.post('http://localhost:8080/api/public/session', {
                deviceId: deviceId,
                tableId: tableId,
                customerName: customerName
            });
            
            // TODO: Create order endpoint
            alert(`Thank you ${customerName}! Your order has been placed. Order total: ${formatPrice(calculateTotal())}`);
            
            // Clear cart
            setCart([]);
            localStorage.removeItem(`cart-${tableId}`);
            setShowCart(false);
            
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="customer-menu-container">
                <div className="loading-center">
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                    <p>Loading menu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="customer-menu-container">
                <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="customer-menu-container">
            {/* Welcome Message for Returning Customers */}
            {showWelcome && session && session.customerName && (
                <div className="welcome-banner">
                    <i className="fas fa-star"></i>
                    Welcome back, {session.customerName}! This is visit #{session.visitCount}
                </div>
            )}

            {/* Header */}
            <header className="customer-header">
                <div className="header-content">
                    <h1><i className="fas fa-utensils"></i> Smart Menu</h1>
                    <p className="table-number">Table #{tableInfo?.tableNumber}</p>
                </div>
                <button 
                    className="cart-button" 
                    onClick={() => setShowCart(!showCart)}
                >
                    <i className="fas fa-shopping-cart"></i>
                    <span className="cart-count">{cart.length}</span>
                </button>
            </header>

            {/* Menu Items */}
            <div className="menu-grid">
                {menuItems.length === 0 ? (
                    <div className="empty-menu">
                        <i className="fas fa-utensils"></i>
                        <p>No menu items available at the moment.</p>
                    </div>
                ) : (
                    menuItems.map(item => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            onAddToCart={addToCart}
                        />
                    ))
                )}
            </div>

            {/* Cart Sidebar */}
            <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2><i className="fas fa-shopping-cart"></i> Your Order</h2>
                    <button className="close-cart" onClick={() => setShowCart(false)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="cart-content">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <i className="fas fa-shopping-cart"></i>
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cart.map((item, index) => (
                                    <div key={index} className="cart-item">
                                        <div className="cart-item-info">
                                            <h4>{item.name}</h4>
                                            {item.specialInstructions && (
                                                <p className="special-note">{item.specialInstructions}</p>
                                            )}
                                            <p className="item-price">{formatPrice(item.price)} × {item.quantity}</p>
                                        </div>
                                        <div className="cart-item-controls">
                                            <button onClick={() => updateCartQuantity(index, item.quantity - 1)}>
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateCartQuantity(index, item.quantity + 1)}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                            <button 
                                                className="remove-btn"
                                                onClick={() => removeFromCart(index)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-footer">
                                <div className="customer-name-input">
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                    />
                                </div>
                                <div className="cart-total">
                                    <span>Total:</span>
                                    <span className="total-amount">{formatPrice(calculateTotal())}</span>
                                </div>
                                <button className="order-button" onClick={handleOrder}>
                                    <i className="fas fa-check"></i> Place Order
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Overlay */}
            {showCart && <div className="overlay" onClick={() => setShowCart(false)}></div>}
        </div>
    );
}

// Menu Item Component
function MenuItem({ item, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price) + ' TSH';
    };

    const handleAdd = () => {
        onAddToCart(item, quantity, specialInstructions);
        setQuantity(1);
        setSpecialInstructions('');
        setShowInstructions(false);
    };

    return (
        <div className="menu-item-card">
            {/* Food Image - Traditional Menu Book Style */}
            <div className="menu-item-image">
                {item.imageUrl ? (
                    <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                        }}
                    />
                ) : (
                    <div className="image-placeholder">
                        <i className="fas fa-utensils"></i>
                        <span>{item.name}</span>
                    </div>
                )}
            </div>

            <div className="menu-item-content">
                <h3>{item.name}</h3>
                {item.description && <p className="description">{item.description}</p>}
                <p className="price">{formatPrice(item.price)}</p>

                <div className="quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                        <i className="fas fa-minus"></i>
                    </button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>
                        <i className="fas fa-plus"></i>
                    </button>
                </div>

                <button 
                    className="special-instructions-toggle"
                    onClick={() => setShowInstructions(!showInstructions)}
                >
                    <i className="fas fa-edit"></i> Special Instructions
                </button>

                {showInstructions && (
                    <textarea
                        className="special-instructions-input"
                        placeholder="e.g., No onions, extra spicy..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                    />
                )}

                <button className="add-to-cart-btn" onClick={handleAdd}>
                    <i className="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    );
}

export default CustomerMenu;
