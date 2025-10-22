// Task Entity
export interface Task {
  _id: string
  id?: string // For backward compatibility
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string // ISO 8601 format
  createdAt: string
  updatedAt: string
}

// Enums
export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'
export type SortableField = '_id' | 'title' | 'description' | 'status' | 'priority' | 'due_date' | 'createdAt' | 'updatedAt'
export type SortOrder = 'asc' | 'desc'

// CRUD Input Types
export interface TaskCreateInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string // YYYY-MM-DD format
}

export interface TaskUpdateInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string // YYYY-MM-DD format
}

// Filter & Query Params
export interface TaskFilterParams {
  status?: TaskStatus | ''
  priority?: TaskPriority | ''
  search?: string
  due_date_from?: string // YYYY-MM-DD
  due_date_to?: string // YYYY-MM-DD
  sort_by?: SortableField
  sort_order?: SortOrder
  per_page?: number
  page?: number
}

// Pagination
export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface PaginationLinks {
  first: number | null
  last: number | null
  prev: number | null
  next: number | null
}

// API Response Types
export interface TasksListResponse {
  success: boolean
  data: Task[]
  meta: PaginationMeta
  links: PaginationLinks
}

export interface TaskResponse {
  success: boolean
  message?: string
  data: Task
}

export interface TaskDeleteResponse {
  success: boolean
  message: string
}

// Error Response
export interface ErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]> // Laravel validation errors
}
