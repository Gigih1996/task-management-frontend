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
  RegisterInput,
  RegisterResponse,
  LogoutResponse,
  UserResponse,
} from '../types'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
  register: (data: RegisterInput) =>
    api.post<RegisterResponse>('/auth/register', data),

  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>('/auth/login', credentials),

  logout: (): Promise<{ data: LogoutResponse }> => {
    // Client-side logout - just clear local storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    return Promise.resolve({
      data: {
        success: true,
        message: 'Logged out successfully'
      }
    })
  },

  getUser: () =>
    api.get<UserResponse>('/auth/me'),
}

// Tasks API
export const tasksAPI = {
  getAll: (params?: TaskFilterParams) =>
    api.get<TasksListResponse>('/tasks', { params }),

  getOne: (id: string) =>
    api.get<TaskResponse>(`/tasks/${id}`),

  create: (data: TaskCreateInput) =>
    api.post<TaskResponse>('/tasks', data),

  update: (id: string, data: TaskUpdateInput) =>
    api.put<TaskResponse>(`/tasks/${id}`, data),

  delete: (id: string) =>
    api.delete<TaskDeleteResponse>(`/tasks/${id}`),
}

export default api
