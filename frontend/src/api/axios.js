import axios from 'axios';

const API = axios.create({
  // Append /api to the end of your backend URL
  baseURL: process.env.REACT_APP_API_URL || 'https://wagebee-backend.onrender.com//i', 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
