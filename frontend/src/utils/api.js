import axios from 'axios';

// Set default baseURL for all axios requests
axios.defaults.baseURL = 'http://localhost:5001';

// Add a request interceptor to include the token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
