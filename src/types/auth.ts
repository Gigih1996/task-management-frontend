// User Entity
export interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

// Auth Input Types
export interface LoginCredentials {
  email: string
  password: string
}

// API Response Types
export interface LoginResponse {
  success: boolean
  data: {
    token: string
    user: User
  }
}

export interface LogoutResponse {
  success: boolean
  message: string
}

export interface UserResponse {
  success: boolean
  data: User
}
