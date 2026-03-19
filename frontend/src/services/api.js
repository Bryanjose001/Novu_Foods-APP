import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_URL,
})

export const restaurantService = {
  getAll: () => api.get('/api/restaurants'),
  getById: (id) => api.get(`/api/restaurants/${id}`),
  getMenu: (id) => api.get(`/api/restaurants/${id}/menu`),
  search: (query) => api.get(`/api/restaurants/search/${query}`),
  create: (data) => api.post('/api/restaurants/signup', data),
  update: (id, data) => api.put(`/api/restaurants/${id}`, data),
  remove: (id) => api.delete(`/api/restaurants/${id}`),
}

export const orderService = {
  create: (data) => api.post('/api/orders', data),
  getById: (id) => api.get(`/api/orders/${id}`),
  getAll: () => api.get('/api/orders'),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
  remove: (id) => api.delete(`/api/orders/${id}`),
}

export const menuService = {
  create: (data) => api.post('/api/menu-items', data),
  remove: (id) => api.delete(`/api/menu-items/${id}`),
}

export const adminService = {
  verify: (password) => api.post('/api/admin/verify', { password }),
}
