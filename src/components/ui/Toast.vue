<script setup>
import { Icon } from '@iconify/vue'
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 4000  // Changed to 4 seconds
  }
})

const emit = defineEmits(['close'])

const typeConfig = {
  success: {
    icon: 'mdi:check-circle',
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: 'text-green-600',
    textColor: 'text-green-800',
    progressBg: 'bg-green-500'
  },
  error: {
    icon: 'mdi:alert-circle',
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-red-600',
    textColor: 'text-red-800',
    progressBg: 'bg-red-500'
  },
  warning: {
    icon: 'mdi:alert',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-800',
    progressBg: 'bg-yellow-500'
  },
  info: {
    icon: 'mdi:information',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800',
    progressBg: 'bg-blue-500'
  }
}

// Countdown state
const countdown = ref(Math.ceil(props.duration / 1000))
const progressWidth = ref(100)

let countdownInterval = null
let closeTimeout = null
let progressInterval = null

// Auto close with countdown
const startCountdown = () => {
  // Clear any existing timers
  clearTimers()

  // Reset countdown and progress
  countdown.value = Math.ceil(props.duration / 1000)
  progressWidth.value = 100

  if (props.duration > 0) {
    // Countdown timer (updates every second)
    countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownInterval)
      }
    }, 1000)

    // Progress bar animation (smooth)
    const progressStep = 100 / (props.duration / 50)
    progressInterval = setInterval(() => {
      progressWidth.value -= progressStep
      if (progressWidth.value <= 0) {
        clearInterval(progressInterval)
      }
    }, 50)

    // Close timeout
    closeTimeout = setTimeout(() => {
      emit('close')
    }, props.duration)
  }
}

const clearTimers = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (closeTimeout) clearTimeout(closeTimeout)
  if (progressInterval) clearInterval(progressInterval)
}

// Watch for show prop changes
watch(() => props.show, (newValue) => {
  if (newValue) {
    startCountdown()
  } else {
    clearTimers()
  }
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  clearTimers()
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="show"
        class="fixed top-4 right-4 z-50 max-w-md"
      >
        <div
          :class="[
            'relative overflow-hidden flex flex-col gap-2 p-4 rounded-lg shadow-lg border',
            typeConfig[type].bg,
            typeConfig[type].border
          ]"
        >
          <!-- Main content -->
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <Icon
              :icon="typeConfig[type].icon"
              :class="typeConfig[type].iconColor"
              width="24"
              class="shrink-0"
            />

            <!-- Message -->
            <p :class="['flex-1 text-sm font-medium', typeConfig[type].textColor]">
              {{ message }}
            </p>

            <!-- Countdown & Close Button -->
            <div class="flex items-center gap-2 shrink-0">
              <!-- Countdown Timer -->
              <span
                :class="['text-xs font-semibold tabular-nums', typeConfig[type].iconColor]"
                :title="`Auto-close in ${countdown} seconds`"
              >
                {{ countdown }}s
              </span>

              <!-- Close Button -->
              <button
                type="button"
                :class="['hover:opacity-70 transition-opacity', typeConfig[type].iconColor]"
                @click="emit('close')"
                title="Close"
              >
                <Icon icon="mdi:close" width="20" />
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="h-1 bg-gray-200 rounded-full overflow-hidden -mb-2 -mx-4">
            <div
              :class="['h-full transition-all duration-50 ease-linear', typeConfig[type].progressBg]"
              :style="{ width: `${progressWidth}%` }"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
