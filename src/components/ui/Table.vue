<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No data available'
  },
  sortable: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: String,
    default: undefined
  },
  sortOrder: {
    type: String,
    default: 'desc'
  }
})

const emit = defineEmits(['sort'])

function handleSort(column) {
  if (!props.sortable || !column.sortable) return

  let newOrder = 'asc'
  if (props.sortBy === column.key) {
    newOrder = props.sortOrder === 'asc' ? 'desc' : 'asc'
  } else {
    newOrder = 'desc'
  }

  emit('sort', column.key, newOrder)
}

function isSortActive(columnKey) {
  return props.sortBy === columnKey
}
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
              column.headerClass,
              { 'cursor-pointer select-none hover:bg-gray-100 transition-colors': sortable && column.sortable }
            ]"
            @click="handleSort(column)"
          >
            <div class="flex items-center gap-2">
              <span>{{ column.label }}</span>
              <div v-if="sortable && column.sortable" class="flex flex-col">
                <!-- Ascending Icon -->
                <svg
                  v-if="isSortActive(column.key) && sortOrder === 'asc'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                <!-- Descending Icon -->
                <svg
                  v-else-if="isSortActive(column.key) && sortOrder === 'desc'"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                <!-- Both Direction Icon (inactive) -->
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <!-- Loading State -->
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-6 py-12 text-center">
            <div class="flex items-center justify-center gap-2 text-gray-500">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="!data || data.length === 0">
          <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
            {{ emptyMessage }}
          </td>
        </tr>

        <!-- Data Rows -->
        <tr
          v-else
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="hover:bg-gray-50 transition-colors"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="['px-6 py-4 whitespace-nowrap', column.cellClass]"
          >
            <slot
              :name="`cell-${column.key}`"
              :row="row"
              :value="row[column.key]"
              :index="rowIndex"
            >
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
