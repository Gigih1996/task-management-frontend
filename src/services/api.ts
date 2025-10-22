import axios, { AxiosInstance } from 'axios'
import type {
  TasksListResponse,
  TaskResponse,
  TaskDeleteResponse,
  TaskCreateInput,
  TaskUpdateInput,
  TaskFilterParams,
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
  UserResponse,
} from '../types'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to false for token-based auth (not cookie-based)
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>('/login', credentials),

  logout: () =>
    api.post<LogoutResponse>('/logout'),

  getUser: () =>
    api.get<UserResponse>('/me'),
}

// Tasks API
export const tasksAPI = {
  getAll: (params?: TaskFilterParams) =>
    api.get<TasksListResponse>('/tasks', { params }),

  getOne: (id: number) =>
    api.get<TaskResponse>(`/tasks/${id}`),

  create: (data: TaskCreateInput) =>
    api.post<TaskResponse>('/tasks', data),

  update: (id: number, data: TaskUpdateInput) =>
    api.put<TaskResponse>(`/tasks/${id}`, data),

  delete: (id: number) =>
    api.delete<TaskDeleteResponse>(`/tasks/${id}`),
}

export default api
