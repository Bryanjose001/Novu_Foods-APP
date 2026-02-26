import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers['x-admin-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const adminService = {
  verify: (password) => api.post('/admin/verify', { password }),
};

export const restaurantService = {
  getAll: () => api.get('/restaurants'),
  getById: (id) => api.get(`/restaurants/${id}`),
  getMenu: (id) => api.get(`/restaurants/${id}/menu`),
  search: (query) => api.get(`/restaurants/search/${query}`),
  signup: (data) => api.post('/restaurants/signup', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
};

export const orderService = {
  create: (orderData) => api.post('/orders', orderData),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  getAll: () => api.get('/orders'),
};

export const menuService = {
  getById: (id) => api.get(`/menu-items/${id}`),
  create: (data) => api.post('/menu-items', data),
  delete: (id) => api.delete(`/menu-items/${id}`),
};

export default api;
