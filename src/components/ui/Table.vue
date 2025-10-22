<script setup>
import { Icon } from '@iconify/vue'
import Button from './Button.vue'

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
  },
  // Pagination props
  showPagination: {
    type: Boolean,
    default: false
  },
  paginationMeta: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['sort', 'page-change'])

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

function changePage(page) {
  if (page < 1 || page > props.paginationMeta.last_page) return
  emit('page-change', page)
}

function getPageNumbers() {
  if (!props.paginationMeta) return []

  const currentPage = props.paginationMeta.current_page
  const lastPage = props.paginationMeta.last_page
  const maxVisiblePages = 5
  const pages = []

  // If total pages is less than max visible, show all
  if (lastPage <= maxVisiblePages) {
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i)
    }
    return pages
  }

  // Always show first page
  pages.push(1)

  // Calculate start and end of visible page range
  let startPage = Math.max(2, currentPage - 1)
  let endPage = Math.min(lastPage - 1, currentPage + 1)

  // Adjust if we're near the start
  if (currentPage <= 3) {
    endPage = Math.min(lastPage - 1, 4)
  }

  // Adjust if we're near the end
  if (currentPage >= lastPage - 2) {
    startPage = Math.max(2, lastPage - 3)
  }

  // Add ellipsis after first page if needed
  if (startPage > 2) {
    pages.push('...')
  }

  // Add visible page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // Add ellipsis before last page if needed
  if (endPage < lastPage - 1) {
    pages.push('...')
  }

  // Always show last page
  if (lastPage > 1) {
    pages.push(lastPage)
  }

  return pages
}
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Desktop Table View (lg and above) -->
    <div class="hidden lg:block overflow-x-auto">
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

    <!-- Mobile/Tablet Card View (below lg) -->
    <div class="lg:hidden">
      <!-- Loading State -->
      <div v-if="loading" class="px-4 py-12 text-center">
        <div class="flex items-center justify-center gap-2 text-gray-500">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!data || data.length === 0" class="px-4 py-12 text-center text-gray-500">
        {{ emptyMessage }}
      </div>

      <!-- Card Items -->
      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <slot name="mobile-card" :row="row" :index="rowIndex">
            <!-- Default Card Layout -->
            <div class="space-y-3">
              <div
                v-for="column in columns.filter(col => col.key !== 'actions')"
                :key="column.key"
                class="flex flex-col"
              >
                <span class="text-xs font-medium text-gray-500 uppercase mb-1">
                  {{ column.label }}
                </span>
                <div :class="column.cellClass">
                  <slot
                    :name="`cell-${column.key}`"
                    :row="row"
                    :value="row[column.key]"
                    :index="rowIndex"
                  >
                    {{ row[column.key] }}
                  </slot>
                </div>
              </div>
              <!-- Actions at bottom -->
              <div
                v-if="columns.find(col => col.key === 'actions')"
                class="pt-3 border-t border-gray-200"
              >
                <slot
                  name="cell-actions"
                  :row="row"
                  :value="row['actions']"
                  :index="rowIndex"
                />
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- Pagination Section -->
    <div
      v-if="showPagination && paginationMeta && paginationMeta.total > 0"
      class="border-t border-gray-200 bg-white px-4 sm:px-6 py-4"
    >
      <!-- Desktop Layout -->
      <div class="hidden sm:flex items-center justify-between">
        <!-- Info Text -->
        <div class="text-sm text-gray-700">
          Showing
          <span class="font-semibold text-gray-900">{{ paginationMeta.from || 0 }}</span>
          to
          <span class="font-semibold text-gray-900">{{ paginationMeta.to || 0 }}</span>
          of
          <span class="font-semibold text-gray-900">{{ paginationMeta.total || 0 }}</span>
          results
        </div>

        <!-- Navigation Buttons -->
        <nav class="flex items-center gap-1" aria-label="Pagination">
          <!-- First Page Button -->
          <Button
            variant="outline"
            size="sm"
            :disabled="!paginationMeta || paginationMeta.current_page === 1"
            @click="changePage(1)"
            title="First Page"
            class="shrink-0"
          >
            <Icon icon="mdi:chevron-double-left" width="18" />
          </Button>

          <!-- Previous Page Button -->
          <Button
            variant="outline"
            size="sm"
            :disabled="!paginationMeta || paginationMeta.current_page === 1"
            @click="changePage(paginationMeta.current_page - 1)"
            title="Previous Page"
            class="shrink-0"
          >
            <Icon icon="mdi:chevron-left" width="18" />
          </Button>

          <!-- Page Numbers -->
          <div class="flex items-center gap-1 mx-2">
            <Button
              v-for="page in getPageNumbers()"
              :key="page"
              :variant="page === paginationMeta.current_page ? 'primary' : 'outline'"
              size="sm"
              @click="page !== '...' && changePage(page)"
              :disabled="page === '...'"
              class="min-w-[40px] h-[40px]"
            >
              {{ page }}
            </Button>
          </div>

          <!-- Next Page Button -->
          <Button
            variant="outline"
            size="sm"
            :disabled="!paginationMeta || paginationMeta.current_page === paginationMeta.last_page"
            @click="changePage(paginationMeta.current_page + 1)"
            title="Next Page"
            class="shrink-0"
          >
            <Icon icon="mdi:chevron-right" width="18" />
          </Button>

          <!-- Last Page Button -->
          <Button
            variant="outline"
            size="sm"
            :disabled="!paginationMeta || paginationMeta.current_page === paginationMeta.last_page"
            @click="changePage(paginationMeta.last_page)"
            title="Last Page"
            class="shrink-0"
          >
            <Icon icon="mdi:chevron-double-right" width="18" />
          </Button>
        </nav>
      </div>

      <!-- Mobile Layout -->
      <div class="sm:hidden space-y-3">
        <!-- Info Text -->
        <div class="text-sm text-gray-700 text-center">
          Showing
          <span class="font-semibold text-gray-900">{{ paginationMeta.from || 0 }}</span>
          -
          <span class="font-semibold text-gray-900">{{ paginationMeta.to || 0 }}</span>
          of
          <span class="font-semibold text-gray-900">{{ paginationMeta.total || 0 }}</span>
        </div>

        <!-- Navigation Buttons -->
        <nav class="flex flex-col gap-2" aria-label="Pagination">
          <!-- Top Row: First and Last -->
          <div class="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="!paginationMeta || paginationMeta.current_page === 1"
              @click="changePage(1)"
              title="First Page"
              class="flex-1"
            >
              <Icon icon="mdi:chevron-double-left" width="18" />
              <span class="ml-1">First</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              :disabled="!paginationMeta || paginationMeta.current_page === paginationMeta.last_page"
              @click="changePage(paginationMeta.last_page)"
              title="Last Page"
              class="flex-1"
            >
              <span class="mr-1">Last</span>
              <Icon icon="mdi:chevron-double-right" width="18" />
            </Button>
          </div>

          <!-- Middle Row: Page Numbers -->
          <div class="flex items-center justify-center gap-1">
            <Button
              v-for="page in getPageNumbers()"
              :key="page"
              :variant="page === paginationMeta.current_page ? 'primary' : 'outline'"
              size="sm"
              @click="page !== '...' && changePage(page)"
              :disabled="page === '...'"
              class="min-w-[40px] h-[40px]"
            >
              {{ page }}
            </Button>
          </div>

          <!-- Bottom Row: Prev and Next -->
          <div class="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="!paginationMeta || paginationMeta.current_page === 1"
              @click="changePage(paginationMeta.current_page - 1)"
              title="Previous Page"
              class="flex-1"
            >
              <Icon icon="mdi:chevron-left" width="18" />
              <span class="ml-1">Previous</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              :disabled="!paginationMeta || paginationMeta.current_page === paginationMeta.last_page"
              @click="changePage(paginationMeta.current_page + 1)"
              title="Next Page"
              class="flex-1"
            >
              <span class="mr-1">Next</span>
              <Icon icon="mdi:chevron-right" width="18" />
            </Button>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
