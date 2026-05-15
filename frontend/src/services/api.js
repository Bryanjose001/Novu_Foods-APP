import axios from 'axios'

<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers['x-admin-token'] = token
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export const adminService = {
  verify: (password) => api.post('/admin/verify', { password }),
}

export const restaurantService = {
  getAll: () => api.get('/restaurants'),
  getById: (id) => api.get(`/restaurants/${id}`),
  getMenu: (id) => api.get(`/restaurants/${id}/menu`),
  search: (query) => api.get(`/restaurants/search/${query}`),
  signup: (data) => api.post('/restaurants/signup', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
}

export const orderService = {
  create: (orderData) => api.post('/orders', orderData),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  getAll: () => api.get('/orders'),
  delete: (id) => api.delete(`/orders/${id}`),
}

export const menuService = {
  getById: (id) => api.get(`/menu-items/${id}`),
  create: (data) => api.post('/menu-items', data),
  delete: (id) => api.delete(`/menu-items/${id}`),
}

export default api
=======
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
>>>>>>> 3c1536b4060b4e85dc5766d52d9fb68df73a7144
