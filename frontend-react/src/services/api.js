/**
 * API Service for Backend Communication
 * 
 * TEACHING MOMENT FOR BEGINNERS:
 * This file handles ALL communication with the Spring Boot backend.
 * Think of it as the "phone operator" - it knows how to call the backend.
 * 
 * Using Axios instead of fetch() because:
 * 1. Automatically handles JSON
 * 2. Better error handling
 * 3. Interceptors (we can add JWT token automatically)
 */

import axios from 'axios';

// Base URL for API
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * TEACHING MOMENT:
 * Axios Interceptor = Middleware
 * Automatically adds JWT token to EVERY request
 * Like showing your VIP wristband at every door automatically
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * TEACHING MOMENT:
 * Response interceptor handles errors globally
 * If token expires (401), automatically logout
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============================================================================
// AUTHENTICATION SERVICES
// ============================================================================

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

/**
 * Login user
 * POST /api/auth/login
 * Returns: { token, id, username, email, role }
 */
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

/**
 * Get current user info
 * GET /api/auth/me
 */
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

// ============================================================================
// MENU ITEM SERVICES
// ============================================================================

/**
 * Get all menu items
 * GET /api/menu-items
 */
export const getMenuItems = async () => {
    const response = await api.get('/menu-items');
    return response.data;
};

/**
 * Get single menu item
 * GET /api/menu-items/:id
 */
export const getMenuItem = async (id) => {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
};

/**
 * Create new menu item
 * POST /api/menu-items
 */
export const createMenuItem = async (menuItem) => {
    const response = await api.post('/menu-items', menuItem);
    return response.data;
};

/**
 * Update menu item
 * PUT /api/menu-items/:id
 */
export const updateMenuItem = async (id, menuItem) => {
    const response = await api.put(`/menu-items/${id}`, menuItem);
    return response.data;
};

/**
 * Delete menu item
 * DELETE /api/menu-items/:id
 */
export const deleteMenuItem = async (id) => {
    const response = await api.delete(`/menu-items/${id}`);
    return response.data;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Save user data to localStorage
 */
export const saveUserData = (data) => {
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user_id', data.id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);
};

/**
 * Clear user data from localStorage (logout)
 */
export const clearUserData = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = () => {
    return !!localStorage.getItem('jwt_token');
};

/**
 * Get stored user info
 */
export const getUserData = () => {
    return {
        id: localStorage.getItem('user_id'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        role: localStorage.getItem('role'),
        token: localStorage.getItem('jwt_token')
    };
};

export default api;
