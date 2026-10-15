import axios from 'axios';
 
// Resolve API base URL dynamically:
// 1. If VITE_API_BASE_URL is explicitly set (e.g. Render/Railway URL), use it
// 2. In production on Vercel (same-origin), default to '/api'
// 3. In local development, default to '/api' (proxied by Vite) or 'http://localhost:5000/api'
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor to attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthenticated errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on a protected route, remove stored token
      const isAuthRoute = error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/register');
      if (!isAuthRoute && localStorage.getItem('fitmate_token')) {
        localStorage.removeItem('fitmate_token');
        localStorage.removeItem('fitmate_user');
        // Let the state handler handle redirection smoothly
      }
    }
    return Promise.reject(error);
  }
);

export default api;
