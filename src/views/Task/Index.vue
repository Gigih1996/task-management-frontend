<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/auth'
import { useTasksStore } from '../../stores/tasks'
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'
import Input from '../../components/ui/Input.vue'
import Select from '../../components/ui/Select.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'
import LoadingModal from '../../components/ui/LoadingModal.vue'
import Toast from '../../components/ui/Toast.vue'
import TaskTable from './components/TaskTable.vue'
import TaskForm from './components/TaskForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const tasksStore = useTasksStore()

const showTaskForm = ref(false)
const editingTask = ref(null)
const taskFormRef = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// Dialog states
const showLogoutConfirm = ref(false)
const showDeleteConfirm = ref(false)
const taskToDelete = ref(null)
const showLoadingModal = ref(false)
const loadingMessage = ref('')

// Toast states
const showToast = ref(false)
const toastType = ref('success')
const toastMessage = ref('')

onMounted(async () => {
  await tasksStore.fetchTasks()
})

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

const priorityOptions = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

function showLogoutDialog() {
  showLogoutConfirm.value = true
}

async function confirmLogout() {
  showLoadingModal.value = true
  loadingMessage.value = 'Logging out...'

  await authStore.logout()

  showLoadingModal.value = false
  showLogoutConfirm.value = false
  router.push('/login')
}

function openCreateDialog() {
  editingTask.value = null
  showTaskForm.value = true
  // Reset form when opening create dialog
  setTimeout(() => {
    if (taskFormRef.value) {
      taskFormRef.value.resetForm()
    }
  }, 0)
}

function openEditDialog(task) {
  editingTask.value = task
  showTaskForm.value = true
}

function closeTaskForm() {
  showTaskForm.value = false
  editingTask.value = null
}

async function handleTaskSubmit(taskData) {
  showLoadingModal.value = true
  loadingMessage.value = editingTask.value ? 'Updating task...' : 'Creating task...'

  const isEditing = editingTask.value !== null

  const result = isEditing
    ? await tasksStore.updateTask(editingTask.value.id, taskData)
    : await tasksStore.createTask(taskData)

  showLoadingModal.value = false

  if (result.success) {
    // Close modal and reset form on success
    closeTaskForm()
    if (taskFormRef.value) {
      taskFormRef.value.resetForm()
    }

    toastType.value = 'success'
    toastMessage.value = isEditing
      ? 'Task updated successfully!'
      : 'Task created successfully!'
    showToast.value = true
  } else {
    // Keep modal open and show validation errors
    if (result.errors) {
      // Set validation errors from backend
      if (taskFormRef.value) {
        taskFormRef.value.setErrors(result.errors)
      }
    }

    toastType.value = 'error'
    toastMessage.value = result.error || 'Failed to save task'
    showToast.value = true
  }
}

function showDeleteDialog(task) {
  taskToDelete.value = task
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (!taskToDelete.value) return

  showLoadingModal.value = true
  loadingMessage.value = 'Deleting task...'

  const result = await tasksStore.deleteTask(taskToDelete.value.id)

  showLoadingModal.value = false
  showDeleteConfirm.value = false

  if (result.success) {
    toastType.value = 'success'
    toastMessage.value = 'Task deleted successfully!'
    showToast.value = true
  } else {
    toastType.value = 'error'
    toastMessage.value = result.error || 'Failed to delete task'
    showToast.value = true
  }

  taskToDelete.value = null
}

async function applyFilters() {
  tasksStore.setFilters({
    search: searchQuery.value,
    status: statusFilter.value,
    priority: priorityFilter.value,
    page: 1
  })
  await tasksStore.fetchTasks()
}

async function changePage(page) {
  tasksStore.setFilters({ page })
  await tasksStore.fetchTasks()
}

async function handleSort(field, order) {
  tasksStore.setFilters({
    sort_by: field,
    sort_order: order,
    page: 1 // Reset to first page when sorting
  })
  await tasksStore.fetchTasks()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Desktop & Tablet Layout -->
        <div class="hidden md:flex justify-between items-center py-4">
          <div class="flex items-center gap-3">
            <div class="bg-indigo-600 p-2.5 rounded-lg shadow-md">
              <Icon icon="mdi:checkbox-marked-circle-outline" class="text-white" width="28" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Task Management</h1>
              <p class="text-sm text-gray-500">Manage your tasks efficiently</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <Icon icon="mdi:account-circle" width="20" class="text-gray-600" />
              <span class="text-sm text-gray-700 font-medium">{{ authStore.user?.email }}</span>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon="mdi:logout"
              @click="showLogoutDialog"
            >
              Logout
            </Button>
          </div>
        </div>

        <!-- Mobile Layout -->
        <div class="md:hidden">
          <!-- Top Row -->
          <div class="flex justify-between items-center py-3">
            <div class="flex items-center gap-2.5">
              <div class="bg-indigo-600 p-2 rounded-lg shadow-md">
                <Icon icon="mdi:checkbox-marked-circle-outline" class="text-white" width="24" />
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900">Task Management</h1>
                <p class="text-xs text-gray-500">Manage efficiently</p>
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon="mdi:logout"
              @click="showLogoutDialog"
            />
          </div>

          <!-- Bottom Row: User Info -->
          <div class="pb-3 pt-1">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <Icon icon="mdi:account-circle" width="16" class="text-gray-600" />
              <span class="text-xs text-gray-700 font-medium truncate max-w-[200px]">
                {{ authStore.user?.email }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters Card -->
      <Card class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search Input -->
          <Input
            v-model="searchQuery"
            placeholder="Search tasks..."
            icon="mdi:magnify"
            @input="applyFilters"
          />

          <!-- Status Filter -->
          <Select
            v-model="statusFilter"
            :options="statusOptions"
            placeholder="Filter by status"
            @change="applyFilters"
          />

          <!-- Priority Filter -->
          <Select
            v-model="priorityFilter"
            :options="priorityOptions"
            placeholder="Filter by priority"
            @change="applyFilters"
          />

          <!-- Create Button -->
          <Button
            variant="primary"
            icon="mdi:plus"
            class="w-full"
            @click="openCreateDialog"
          >
            New Task
          </Button>
        </div>
      </Card>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding>
          <div class="flex items-center gap-4">
            <div class="bg-blue-100 p-3 rounded-lg">
              <Icon icon="mdi:clipboard-text-outline" class="text-blue-600" width="24" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Total Tasks</p>
              <p class="text-2xl font-bold text-gray-900">{{ tasksStore.meta?.total || 0 }}</p>
            </div>
          </div>
        </Card>

        <Card padding>
          <div class="flex items-center gap-4">
            <div class="bg-yellow-100 p-3 rounded-lg">
              <Icon icon="mdi:clock-outline" class="text-yellow-600" width="24" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Pending</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ tasksStore.tasks.filter(t => t.status === 'pending').length }}
              </p>
            </div>
          </div>
        </Card>

        <Card padding>
          <div class="flex items-center gap-4">
            <div class="bg-blue-100 p-3 rounded-lg">
              <Icon icon="mdi:progress-clock" class="text-blue-600" width="24" />
            </div>
            <div>
              <p class="text-sm text-gray-600">In Progress</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ tasksStore.tasks.filter(t => t.status === 'in_progress').length }}
              </p>
            </div>
          </div>
        </Card>

        <Card padding>
          <div class="flex items-center gap-4">
            <div class="bg-green-100 p-3 rounded-lg">
              <Icon icon="mdi:check-circle-outline" class="text-green-600" width="24" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ tasksStore.tasks.filter(t => t.status === 'completed').length }}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Tasks Table -->
      <TaskTable
        :tasks="tasksStore.tasks"
        :loading="tasksStore.loading"
        :sort-by="tasksStore.filters.sort_by"
        :sort-order="tasksStore.filters.sort_order"
        :pagination-meta="tasksStore.meta"
        @edit="openEditDialog"
        @delete="showDeleteDialog"
        @sort="handleSort"
        @page-change="changePage"
      />
    </main>

    <!-- Task Form Modal -->
    <TaskForm
      ref="taskFormRef"
      :show="showTaskForm"
      :task="editingTask"
      :loading="tasksStore.loading"
      @close="closeTaskForm"
      @submit="handleTaskSubmit"
    />

    <!-- Logout Confirmation Dialog -->
    <ConfirmDialog
      :show="showLogoutConfirm"
      type="warning"
      title="Confirm Logout"
      message="Are you sure you want to logout? You will need to sign in again to access your tasks."
      confirm-text="Yes, Logout"
      cancel-text="Cancel"
      @confirm="confirmLogout"
      @cancel="showLogoutConfirm = false"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      type="danger"
      title="Delete Task"
      :message="`Are you sure you want to delete '${taskToDelete?.title}'? This action cannot be undone.`"
      confirm-text="Yes, Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <!-- Loading Modal -->
    <LoadingModal
      :show="showLoadingModal"
      :message="loadingMessage"
    />

    <!-- Toast Notification -->
    <Toast
      :show="showToast"
      :type="toastType"
      :message="toastMessage"
      @close="showToast = false"
    />
  </div>
</template>
