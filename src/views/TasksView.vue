<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTasksStore } from '../stores/tasks'

const router = useRouter()
const authStore = useAuthStore()
const tasksStore = useTasksStore()

const showTaskDialog = ref(false)
const editingTask = ref(null)
const taskForm = ref({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
})

const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

onMounted(async () => {
  await tasksStore.fetchTasks()
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function openCreateDialog() {
  editingTask.value = null
  taskForm.value = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
  }
  showTaskDialog.value = true
}

function openEditDialog(task) {
  editingTask.value = task
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    due_date: task.due_date || '',
  }
  showTaskDialog.value = true
}

async function handleSubmit() {
  const data = { ...taskForm.value }

  if (editingTask.value) {
    await tasksStore.updateTask(editingTask.value.id, data)
  } else {
    await tasksStore.createTask(data)
  }

  showTaskDialog.value = false
  taskForm.value = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
  }
}

async function handleDelete(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    await tasksStore.deleteTask(taskId)
  }
}

async function applyFilters() {
  tasksStore.setFilters({
    search: searchQuery.value,
    status: statusFilter.value,
    priority: priorityFilter.value,
    page: 1,
  })
  await tasksStore.fetchTasks()
}

async function changePage(page) {
  tasksStore.setFilters({ page })
  await tasksStore.fetchTasks()
}

function getStatusBadgeClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getPriorityBadgeClass(priority) {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Task Management</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ authStore.user?.email }}</span>
          <button
            @click="handleLogout"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters and Actions -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tasks..."
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @input="applyFilters"
          />

          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @change="applyFilters"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            v-model="priorityFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @change="applyFilters"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            @click="openCreateDialog"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            + New Task
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="tasksStore.loading" class="text-center py-12">
        <p class="text-gray-500">Loading tasks...</p>
      </div>

      <!-- Tasks List -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="task in tasksStore.tasks" :key="task.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-medium text-gray-900 truncate">
                  {{ task.title }}
                </h3>
                <p v-if="task.description" class="mt-1 text-sm text-gray-500">
                  {{ task.description }}
                </p>
                <div class="mt-2 flex items-center gap-2">
                  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusBadgeClass(task.status)]">
                    {{ task.status.replace('_', ' ') }}
                  </span>
                  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getPriorityBadgeClass(task.priority)]">
                    {{ task.priority }}
                  </span>
                  <span v-if="task.due_date" class="text-xs text-gray-500">
                    Due: {{ new Date(task.due_date).toLocaleDateString() }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="openEditDialog(task)"
                  class="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(task.id)"
                  class="px-3 py-1 text-sm text-red-600 hover:text-red-900 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>

        <!-- Empty State -->
        <div v-if="!tasksStore.tasks.length" class="text-center py-12">
          <p class="text-gray-500">No tasks found. Create your first task!</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="tasksStore.meta && tasksStore.meta.last_page > 1" class="mt-6 flex justify-between items-center">
        <p class="text-sm text-gray-700">
          Showing {{ tasksStore.meta.from }} to {{ tasksStore.meta.to }} of {{ tasksStore.meta.total }} tasks
        </p>
        <div class="flex gap-2">
          <button
            v-for="page in tasksStore.meta.last_page"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium',
              page === tasksStore.meta.current_page
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </main>

    <!-- Task Dialog -->
    <div v-if="showTaskDialog" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingTask ? 'Edit Task' : 'Create New Task' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="taskForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="taskForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="taskForm.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                v-model="taskForm.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              v-model="taskForm.due_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="showTaskDialog = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              {{ editingTask ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
