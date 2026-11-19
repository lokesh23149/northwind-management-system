import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
      errorMessage = 'Cannot connect to backend server. Make sure Spring Boot is running on port 8080.';
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.original = error;
    return Promise.reject(enhancedError);
  }
);

export default axiosClient;
