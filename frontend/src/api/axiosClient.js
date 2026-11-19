import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  isLocalhost
    ? 'http://localhost:8080/api'
    : 'https://northwind-management-system-production.up.railway.app/api'
);

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for uniform error formatting
axiosClient.interceptors.response.use(
  (response) => {
    // Return backend ApiResponse payload directly if present
    return response.data;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response && error.response.data) {
      const data = error.response.data;
      if (typeof data.message === 'string') {
        errorMessage = data.message;
      }
      // If validation error map was returned
      if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        const fieldErrors = Object.values(data.data).join(', ');
        if (fieldErrors) {
          errorMessage = `${errorMessage}: ${fieldErrors}`;
        }
      }
    } else if (error.request) {
      errorMessage = 'Cannot connect to backend server. Please verify the backend service is running and API URL is reachable.';
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.original = error;
    return Promise.reject(enhancedError);
  }
);

export default axiosClient;
