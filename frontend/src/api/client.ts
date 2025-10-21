/**
 * API client for DreamSpace backend.
 * Handles authentication, requests, and error handling.
 */
import axios, { AxiosError } from 'axios'
import type { 
  LoginCredentials, 
  RegisterData, 
  User, 
  Project, 
  DesignVariant,
  ItemInstance 
} from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/token/', credentials)
    return response.data
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/users/register/', data)
    return response.data
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile/')
    return response.data
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/users/profile/', data)
    return response.data
  },
}

// Projects API
export const projectsAPI = {
  list: async (): Promise<Project[]> => {
    const response = await api.get('/projects/')
    return response.data.results || response.data
  },

  get: async (id: number): Promise<Project> => {
    const response = await api.get(`/projects/${id}/`)
    return response.data
  },

  create: async (name: string): Promise<Project> => {
    const response = await api.post('/projects/', { name })
    return response.data
  },

  update: async (id: number, data: Partial<Project>): Promise<Project> => {
    const response = await api.patch(`/projects/${id}/`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}/`)
  },

  uploadImage: async (projectId: number, file: File, type: string = 'original') => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', type)

    const response = await api.post(`/projects/${projectId}/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  generateVariant: async (projectId: number, prompt: string = '') => {
    const response = await api.post(`/projects/${projectId}/generate/`, { prompt })
    return response.data
  },

  getVariants: async (projectId: number): Promise<DesignVariant[]> => {
    const response = await api.get(`/projects/${projectId}/variants/`)
    return response.data
  },

  getVersions: async (projectId: number) => {
    const response = await api.get(`/projects/${projectId}/versions/`)
    return response.data
  },
}

// Variants API
export const variantsAPI = {
  addItem: async (variantId: number, item: Partial<ItemInstance>) => {
    const response = await api.post(`/projects/variants/${variantId}/items/`, item)
    return response.data
  },

  updateItem: async (itemId: number, data: Partial<ItemInstance>) => {
    const response = await api.patch(`/projects/items/${itemId}/`, data)
    return response.data
  },

  deleteItem: async (itemId: number) => {
    await api.delete(`/projects/items/${itemId}/`)
  },
}

export default api

