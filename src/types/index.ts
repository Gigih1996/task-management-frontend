// Export all types from a single entry point
export * from './task'
export * from './auth'

// Common API Response Type
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
