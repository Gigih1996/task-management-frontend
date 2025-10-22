import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '../services/api'
import type { User, LoginCredentials, RegisterInput } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token') || null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null

    try {
      const response = await authAPI.login(credentials)

      if (response.data.success) {
        token.value = response.data.data.token
        user.value = response.data.data.user as User

        // Store token in localStorage
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))

        return { success: true }
      }
    } catch (err: any) {
      // Handle different error response formats
      let errorMessage = 'Login failed. Please try again.'

      if (err.response?.data) {
        const errorData = err.response.data

        // Handle validation errors (array format)
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map((e: any) => e.msg || e.message).join(', ')
        }
        // Handle single error message
        else if (errorData.message) {
          errorMessage = errorData.message
        }
        // Handle Express validator format
        else if (errorData.errors && typeof errorData.errors === 'object') {
          const errors = Object.values(errorData.errors).flat()
          errorMessage = errors.join(', ')
        }
      } else if (err.message) {
        errorMessage = err.message
      }

      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterInput) {
    loading.value = true
    error.value = null

    try {
      const response = await authAPI.register(data)

      if (response.data.success) {
        token.value = response.data.data.token
        user.value = response.data.data.user as User

        // Store token in localStorage
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))

        return { success: true }
      }
    } catch (err: any) {
      // Handle different error response formats
      let errorMessage = 'Registration failed. Please try again.'

      if (err.response?.data) {
        const errorData = err.response.data

        // Handle validation errors (array format)
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map((e: any) => e.msg || e.message).join(', ')
        }
        // Handle single error message
        else if (errorData.message) {
          errorMessage = errorData.message
        }
        // Handle Express validator format
        else if (errorData.errors && typeof errorData.errors === 'object') {
          const errors = Object.values(errorData.errors).flat()
          errorMessage = errors.join(', ')
        }
      } else if (err.message) {
        errorMessage = err.message
      }

      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear local state regardless of API call success
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  function initializeFromStorage() {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Failed to parse stored user:', err)
        localStorage.removeItem('user')
      }
    }
  }

  // Initialize on store creation
  initializeFromStorage()

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
