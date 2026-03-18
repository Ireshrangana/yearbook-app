import axios from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

axios.defaults.baseURL = apiBaseUrl;

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
