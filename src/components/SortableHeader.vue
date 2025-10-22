<template>
  <th
    :class="[
      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors',
      className
    ]"
    @click="handleSort"
  >
    <div class="flex items-center gap-2">
      <span>{{ label }}</span>
      <div class="flex flex-col">
        <svg
          v-if="sortOrder === 'asc' && isActive"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
        </svg>
        <svg
          v-else-if="sortOrder === 'desc' && isActive"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SortableField, SortOrder } from '../types'

interface Props {
  label: string
  field: SortableField
  currentSortBy?: SortableField
  currentSortOrder?: SortOrder
  className?: string
}

interface Emits {
  (e: 'sort', field: SortableField, order: SortOrder): void
}

const props = withDefaults(defineProps<Props>(), {
  currentSortBy: undefined,
  currentSortOrder: 'desc',
  className: ''
})

const emit = defineEmits<Emits>()

const isActive = computed(() => props.currentSortBy === props.field)

const sortOrder = computed(() => {
  if (!isActive.value) return props.currentSortOrder
  return props.currentSortOrder
})

const handleSort = () => {
  let newOrder: SortOrder = 'asc'

  if (isActive.value) {
    // Toggle between asc and desc
    newOrder = props.currentSortOrder === 'asc' ? 'desc' : 'asc'
  } else {
    // Default to desc for new sort
    newOrder = 'desc'
  }

  emit('sort', props.field, newOrder)
}
</script>
