// User Entity
export interface User {
  _id?: string
  id?: string // For backward compatibility
  name: string
  email: string
  role: 'user' | 'admin'
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

// Auth Input Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

// API Response Types
export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
    token: string
  }
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
    token: string
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
