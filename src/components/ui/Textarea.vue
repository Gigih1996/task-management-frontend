<script setup>
const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  rows: { type: Number, default: 3 },
  error: String,
  disabled: Boolean,
  required: Boolean
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :required="required"
      :class="[
        'block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none',
        error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
        disabled && 'bg-gray-100 cursor-not-allowed'
      ]"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
