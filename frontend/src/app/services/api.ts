import axios from 'axios';
import { getCsrfToken, fetchCsrfToken } from '../utils/csrf';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Send cookies with requests
});

// Request interceptor to add auth token and CSRF token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token for state-changing requests
    const isStateChanging = ['post', 'put', 'delete', 'patch'].includes(
      config.method?.toLowerCase() || ''
    );

    // Skip CSRF for login/register endpoints
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');

    if (isStateChanging && !isAuthEndpoint && token) {
      let csrfToken = await getCsrfToken();

      // Retry once if token fetch failed (e.g., expired token)
      if (!csrfToken) {
        csrfToken = await fetchCsrfToken();
      }

      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      } else {
        return Promise.reject(new Error('Unable to obtain CSRF token. Please refresh the page and try again.'));
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect for auth endpoints - 401 is expected for invalid credentials
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');

      if (!isAuthEndpoint) {
        // Dispatch event so React can handle logout gracefully (via AuthContext)
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
