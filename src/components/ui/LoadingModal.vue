<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: 'Processing...'
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="show"
            class="bg-white rounded-2xl shadow-2xl p-8 text-center"
          >
            <!-- Animated Icon -->
            <div class="relative w-20 h-20 mx-auto mb-4">
              <div class="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
              <div class="relative bg-indigo-600 rounded-full w-20 h-20 flex items-center justify-center">
                <Icon
                  icon="svg-spinners:ring-resize"
                  class="text-white"
                  width="40"
                />
              </div>
            </div>

            <!-- Message -->
            <p class="text-lg font-semibold text-gray-900 mb-1">
              {{ message }}
            </p>
            <p class="text-sm text-gray-500">
              Please wait a moment
            </p>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
