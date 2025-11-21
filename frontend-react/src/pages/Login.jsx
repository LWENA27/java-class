/**
 * Login Page Component
 * 
 * TEACHING MOMENT FOR BEGINNERS:
 * React Component = Reusable piece of UI
 * This is the login form that users see
 * 
 * React Hooks used:
 * - useState: Store form data (username, password, errors)
 * - useNavigate: Redirect to dashboard after login
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, saveUserData } from '../services/api';
import './Login.css';

function Login() {
    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    
    /**
     * TEACHING MOMENT:
     * useState creates a "state variable" that triggers re-render when changed
     * 
     * Example:
     * const [username, setUsername] = useState('');
     * - username: current value
     * - setUsername: function to change it
     * - '': initial value
     */
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate(); // For redirecting after login

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================
    
    /**
     * Handle input changes
     * Updates formData state as user types
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,  // Keep existing fields
            [e.target.name]: e.target.value  // Update changed field
        });
    };

    /**
     * Handle form submission
     * 1. Prevent page reload
     * 2. Send credentials to backend
     * 3. Store JWT token
     * 4. Redirect to dashboard
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Call API to login
            const response = await login({
                username: formData.username,
                password: formData.password
            });

            // Save user data to localStorage
            saveUserData(response);

            // Show success message
            setSuccess(`Welcome back, ${response.username}! Redirecting...`);

            // Redirect to dashboard after 1 second
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (err) {
            // Handle errors
            setError(err.response?.data?.message || 'Invalid username or password');
            setLoading(false);
        }
    };

    // ========================================================================
    // RENDER UI
    // ========================================================================
    
    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Admin Login</h2>
                

                {/* Error Message */}
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                            />
                            <i
                                className={`fas fa-eye${showPassword ? '-slash' : ''} password-toggle`}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Loading Spinner */}
                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Logging in...</p>
                        </div>
                    )}
                </form>

                {/* Register Link */}
                <div className="register-link">
                    <p>
                        Not registered?{' '}
                        <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
