<script setup>
import { ref, watch } from 'vue'
import Modal from '../../../components/ui/Modal.vue'
import Input from '../../../components/ui/Input.vue'
import Textarea from '../../../components/ui/Textarea.vue'
import Select from '../../../components/ui/Select.vue'
import Button from '../../../components/ui/Button.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  task: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: ''
})

const errors = ref({})

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

// Watch for task changes (edit mode)
watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = {
      title: newTask.title || '',
      description: newTask.description || '',
      status: newTask.status || 'pending',
      priority: newTask.priority || 'medium',
      due_date: newTask.due_date || ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.value = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: ''
  }
  errors.value = {}
}

function validate() {
  errors.value = {}

  if (!form.value.title) {
    errors.value.title = 'Title is required'
    return false
  }

  if (form.value.title.length > 255) {
    errors.value.title = 'Title cannot exceed 255 characters'
    return false
  }

  return true
}

function handleSubmit() {
  if (!validate()) return

  emit('submit', { ...form.value })
}

function handleClose() {
  resetForm()
  emit('close')
}

function setErrors(apiErrors) {
  errors.value = apiErrors
}

// Expose methods for parent component
defineExpose({
  resetForm,
  setErrors
})
</script>

<template>
  <Modal
    :show="show"
    :title="task ? 'Edit Task' : 'Create New Task'"
    max-width="lg"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Title Input -->
      <Input
        v-model="form.title"
        label="Title"
        placeholder="Enter task title"
        icon="mdi:format-title"
        :error="errors.title"
        required
      />

      <!-- Description Textarea -->
      <Textarea
        v-model="form.description"
        label="Description"
        placeholder="Enter task description (optional)"
        :rows="4"
        :error="errors.description"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Status Select -->
        <Select
          v-model="form.status"
          label="Status"
          :options="statusOptions"
          :error="errors.status"
        />

        <!-- Priority Select -->
        <Select
          v-model="form.priority"
          label="Priority"
          :options="priorityOptions"
          :error="errors.priority"
        />
      </div>

      <!-- Due Date Input -->
      <Input
        v-model="form.due_date"
        type="date"
        label="Due Date"
        icon="mdi:calendar"
        :error="errors.due_date"
      />
    </form>

    <!-- Modal Footer -->
    <template #footer="{ close }">
      <div class="flex justify-end gap-3">
        <Button
          variant="ghost"
          icon="mdi:close"
          @click="close"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          :icon="task ? 'mdi:content-save' : 'mdi:plus'"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ task ? 'Update Task' : 'Create Task' }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
