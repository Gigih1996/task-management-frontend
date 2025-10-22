import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tasksAPI } from '../services/api'
import type {
  Task,
  TaskCreateInput,
  TaskUpdateInput,
  TaskFilterParams,
  PaginationMeta,
  PaginationLinks,
} from '../types'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref<PaginationMeta | null>(null)
  const links = ref<PaginationLinks | null>(null)

  // Filter and sort state
  const filters = ref<TaskFilterParams>({
    status: '',
    priority: '',
    search: '',
    due_date_from: '',
    due_date_to: '',
    sort_by: 'createdAt',
    sort_order: 'desc',
    per_page: 10,
    page: 1,
  })

  async function fetchTasks(params: TaskFilterParams = {}) {
    loading.value = true
    error.value = null

    try {
      const queryParams = { ...filters.value, ...params }
      const response = await tasksAPI.getAll(queryParams)

      if (response.data.success) {
        tasks.value = response.data.data
        meta.value = response.data.meta
        links.value = response.data.links
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      console.error('Fetch tasks error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTask(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await tasksAPI.getOne(id)

      if (response.data.success) {
        currentTask.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch task'
      console.error('Fetch task error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createTask(taskData: TaskCreateInput) {
    loading.value = true
    error.value = null

    try {
      const response = await tasksAPI.create(taskData)

      if (response.data.success) {
        await fetchTasks() // Refresh the list
        return { success: true, data: response.data.data }
      }
    } catch (err: any) {
      // Handle Express validation errors (400)
      if (err.response?.status === 400) {
        const errorData = err.response.data

        // Handle validation errors array format
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const transformedErrors: Record<string, string> = {}
          errorData.errors.forEach((e: any) => {
            if (e.path) {
              transformedErrors[e.path] = e.msg || e.message
            }
          })
          error.value = 'Validation failed'
          return { success: false, error: error.value, errors: transformedErrors }
        }

        error.value = errorData.message || 'Validation failed'
        return { success: false, error: error.value }
      }

      error.value = err.response?.data?.message || 'Failed to create task'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: string, taskData: TaskUpdateInput) {
    loading.value = true
    error.value = null

    try {
      const response = await tasksAPI.update(id, taskData)

      if (response.data.success) {
        await fetchTasks() // Refresh the list
        return { success: true, data: response.data.data }
      }
    } catch (err: any) {
      // Handle Express validation errors (400)
      if (err.response?.status === 400) {
        const errorData = err.response.data

        // Handle validation errors array format
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const transformedErrors: Record<string, string> = {}
          errorData.errors.forEach((e: any) => {
            if (e.path) {
              transformedErrors[e.path] = e.msg || e.message
            }
          })
          error.value = 'Validation failed'
          return { success: false, error: error.value, errors: transformedErrors }
        }

        error.value = errorData.message || 'Validation failed'
        return { success: false, error: error.value }
      }

      error.value = err.response?.data?.message || 'Failed to update task'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: string) {
    loading.value = true
    error.value = null

    try {
      const response = await tasksAPI.delete(id)

      if (response.data.success) {
        await fetchTasks() // Refresh the list
        return { success: true, message: response.data.message }
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<TaskFilterParams>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      status: '',
      priority: '',
      search: '',
      due_date_from: '',
      due_date_to: '',
      sort_by: 'createdAt',
      sort_order: 'desc',
      per_page: 10,
      page: 1,
    }
  }

  return {
    tasks,
    currentTask,
    loading,
    error,
    meta,
    links,
    filters,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    resetFilters,
  }
})
