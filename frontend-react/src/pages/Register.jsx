import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: ''
    });
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ text: '', className: '' });
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Check password strength
        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        if (password.length === 0) {
            setPasswordStrength({ text: '', className: '' });
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;

        if (strength <= 1) {
            setPasswordStrength({ text: '⚠️ Weak password', className: 'weak' });
        } else if (strength === 2 || strength === 3) {
            setPasswordStrength({ text: '⚡ Medium password', className: 'medium' });
        } else {
            setPasswordStrength({ text: '✅ Strong password', className: 'strong' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await register(formData);
            setSuccess(response.message + ' Redirecting to login...');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2>Create Account</h2>

                {/* 🎓 TEACHING: Development Mode Notice */}
                {/* <div className="info-box">
                    <h4>📝 For Development/Testing</h4>
                    <p><strong>Use these test credentials to login:</strong></p>
                    <ul style={{textAlign: 'left', margin: '10px 0'}}>
                        <li><strong>Username:</strong> admin</li>
                        <li><strong>Password:</strong> admin123</li>
                    </ul>
                    <p style={{fontSize: '0.85rem', color: '#666'}}>
                        <em>Note: Backend authentication is under development. 
                        Use the test credentials above to access the dashboard.</em>
                    </p>
                </div> */}

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName">Full Name:</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Choose a strong password"
                                required
                                disabled={loading}
                            />
                            <i
                                className={`fas fa-eye${showPassword ? '-slash' : ''} password-toggle`}
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>
                        {passwordStrength.text && (
                            <div className={`password-strength ${passwordStrength.className}`}>
                                {passwordStrength.text}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>

                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Creating account...</p>
                        </div>
                    )}
                </form>

                <div className="login-link">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
