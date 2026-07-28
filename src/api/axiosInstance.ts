import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', errorMessage);
    return Promise.reject(errorMessage);
  }
);

export default api;