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
    sort_by: 'created_at',
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

  async function fetchTask(id: number) {
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
      // Handle Laravel validation errors (422)
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {}
        // Transform Laravel errors format { field: ['message'] } to { field: 'message' }
        const transformedErrors: Record<string, string> = {}
        for (const [field, messages] of Object.entries(validationErrors)) {
          transformedErrors[field] = Array.isArray(messages) ? messages[0] : messages
        }
        error.value = err.response?.data?.message || 'Validation failed'
        return { success: false, error: error.value, errors: transformedErrors }
      }

      error.value = err.response?.data?.message || 'Failed to create task'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: number, taskData: TaskUpdateInput) {
    loading.value = true
    error.value = null

    try {
      const response = await tasksAPI.update(id, taskData)

      if (response.data.success) {
        await fetchTasks() // Refresh the list
        return { success: true, data: response.data.data }
      }
    } catch (err: any) {
      // Handle Laravel validation errors (422)
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors || {}
        // Transform Laravel errors format { field: ['message'] } to { field: 'message' }
        const transformedErrors: Record<string, string> = {}
        for (const [field, messages] of Object.entries(validationErrors)) {
          transformedErrors[field] = Array.isArray(messages) ? messages[0] : messages
        }
        error.value = err.response?.data?.message || 'Validation failed'
        return { success: false, error: error.value, errors: transformedErrors }
      }

      error.value = err.response?.data?.message || 'Failed to update task'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: number) {
    loading.value = true
    error.value = null

    try {
      const response = await tasksAPI.delete(id)

      if (response.data.success) {
        await fetchTasks() // Refresh the list
        return { success: true }
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
      sort_by: 'created_at',
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
