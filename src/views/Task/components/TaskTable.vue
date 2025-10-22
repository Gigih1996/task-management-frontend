<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import Table from '../../../components/ui/Table.vue'
import Button from '../../../components/ui/Button.vue'
import Badge from '../../../components/ui/Badge.vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: String,
    default: 'created_at'
  },
  sortOrder: {
    type: String,
    default: 'desc'
  },
  paginationMeta: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['edit', 'delete', 'sort', 'page-change'])

const columns = [
  { key: 'title', label: 'Title', cellClass: 'text-sm font-medium text-gray-900', sortable: true },
  { key: 'description', label: 'Description', cellClass: 'text-sm text-gray-500', sortable: true },
  { key: 'status', label: 'Status', cellClass: 'text-sm', sortable: true },
  { key: 'priority', label: 'Priority', cellClass: 'text-sm', sortable: true },
  { key: 'due_date', label: 'Due Date', cellClass: 'text-sm text-gray-500', sortable: true },
  { key: 'actions', label: 'Actions', cellClass: 'text-sm', headerClass: 'text-right', sortable: false }
]

function handleSort(field, order) {
  emit('sort', field, order)
}

function handlePageChange(page) {
  emit('page-change', page)
}

function getStatusVariant(status) {
  const variants = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success'
  }
  return variants[status] || 'default'
}

function getPriorityVariant(priority) {
  const variants = {
    low: 'default',
    medium: 'warning',
    high: 'danger'
  }
  return variants[priority] || 'default'
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatStatus(status) {
  return status.replace('_', ' ').split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}
</script>

<template>
  <Table
    :columns="columns"
    :data="tasks"
    :loading="loading"
    :sortable="true"
    :sort-by="sortBy"
    :sort-order="sortOrder"
    :show-pagination="true"
    :pagination-meta="paginationMeta"
    @sort="handleSort"
    @page-change="handlePageChange"
    empty-message="No tasks found. Create your first task!"
  >
    <!-- Title Column -->
    <template #cell-title="{ row }">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:clipboard-text-outline" width="18" class="text-gray-400" />
        <span class="font-medium text-gray-900">{{ row.title }}</span>
      </div>
    </template>

    <!-- Description Column -->
    <template #cell-description="{ row }">
      <div class="max-w-xs">
        <p class="text-sm text-gray-500 truncate">
          {{ row.description || '-' }}
        </p>
      </div>
    </template>

    <!-- Status Column -->
    <template #cell-status="{ row }">
      <Badge :variant="getStatusVariant(row.status)">
        {{ formatStatus(row.status) }}
      </Badge>
    </template>

    <!-- Priority Column -->
    <template #cell-priority="{ row }">
      <Badge :variant="getPriorityVariant(row.priority)">
        <Icon
          :icon="row.priority === 'high' ? 'mdi:alert-circle' : row.priority === 'medium' ? 'mdi:alert' : 'mdi:minus-circle'"
          width="14"
          class="mr-1"
        />
        {{ row.priority.charAt(0).toUpperCase() + row.priority.slice(1) }}
      </Badge>
    </template>

    <!-- Due Date Column -->
    <template #cell-due_date="{ row }">
      <div class="flex items-center gap-1 text-gray-500">
        <Icon icon="mdi:calendar-outline" width="16" />
        <span>{{ formatDate(row.due_date) }}</span>
      </div>
    </template>

    <!-- Actions Column -->
    <template #cell-actions="{ row }">
      <div class="flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          icon="mdi:pencil"
          @click="emit('edit', row)"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon="mdi:delete"
          class="text-red-600 hover:text-red-700 hover:bg-red-50"
          @click="emit('delete', row)"
        >
          Delete
        </Button>
      </div>
    </template>
  </Table>
</template>
