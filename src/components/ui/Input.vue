<script setup>
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// Password visibility toggle
const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

const isPasswordField = computed(() => props.type === 'password')

const inputClasses = computed(() => {
  const base = 'block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'

  if (props.error) {
    return `${base} border-red-300 focus:border-red-500 focus:ring-red-500`
  }

  return `${base} border-gray-300 focus:border-indigo-500 focus:ring-indigo-500`
})

function handleInput(event) {
  emit('update:modelValue', event.target.value)
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <!-- Left Icon -->
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon :icon="icon" class="text-gray-400" width="20" />
      </div>

      <!-- Input Field -->
      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          inputClasses,
          icon ? 'pl-10' : '',
          isPasswordField ? 'pr-10' : ''
        ]"
        @input="handleInput"
      />

      <!-- Password Toggle Button -->
      <button
        v-if="isPasswordField"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-indigo-600 focus:outline-none transition-colors"
        tabindex="-1"
      >
        <Icon
          v-if="showPassword"
          icon="mdi:eye-off-outline"
          class="text-gray-400 hover:text-indigo-600 transition-colors"
          width="20"
        />
        <Icon
          v-else
          icon="mdi:eye-outline"
          class="text-gray-400 hover:text-indigo-600 transition-colors"
          width="20"
        />
      </button>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>
