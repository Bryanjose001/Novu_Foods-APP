import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'Network error — check your connection and try again.'
    }
    return Promise.reject(error)
  }
)

const adminHeaders = () => ({
  headers: {
    'x-admin-token': localStorage.getItem('adminToken') || '',
  },
})

export const restaurantService = {
  getAll: () => api.get('/api/restaurants'),
  getById: (id) => api.get(`/api/restaurants/${id}`),
  getMenu: (id) => api.get(`/api/restaurants/${id}/menu`),
  search: (query) => api.get(`/api/restaurants/search/${query}`),
  create: (data) => api.post('/api/restaurants/signup', data, adminHeaders()),
  update: (id, data) => api.put(`/api/restaurants/${id}`, data, adminHeaders()),
  remove: (id) => api.delete(`/api/restaurants/${id}`, adminHeaders()),
}

export const orderService = {
  create: (data) => api.post('/api/orders', data),
  getById: (id) => api.get(`/api/orders/${id}`),
  getAll: () => api.get('/api/orders', adminHeaders()),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }, adminHeaders()),
  remove: (id) => api.delete(`/api/orders/${id}`, adminHeaders()),
}

export const menuService = {
  create: (data) => api.post('/api/menu-items', data, adminHeaders()),
  update: (id, data) => api.put(`/api/menu-items/${id}`, data, adminHeaders()),
  remove: (id) => api.delete(`/api/menu-items/${id}`, adminHeaders()),
}

export const adminService = {
  verify: async (password) => {
    const res = await api.post('/api/admin/verify', { password })
    if (res.data?.token) {
      localStorage.setItem('adminToken', res.data.token)
    }
    return res
  },
  logout: () => {
    localStorage.removeItem('adminToken')
  },
}
