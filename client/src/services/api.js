import axios from 'axios';

// Initialize the core communication terminal
const API = axios.create({
  baseURL: '/api',
});

/**
 * REQUEST INTERCEPTOR
 * Automatically injects the Bearer Token into every outgoing request
 * if the user is authenticated.
 */
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

  if (userInfo?.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * RESPONSE INTERCEPTOR
 * Monitors incoming data for security breaches or expired sessions.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401, the token is likely expired or invalid
    if (error.response && error.response.status === 401) {
      console.warn('Security Protocol: Session Expired. Terminating local access.');
      
      // Clear the vault and force a re-authentication
      localStorage.removeItem('userInfo');
      
      // Only redirect if we aren't already on the login page to avoid loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;