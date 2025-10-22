<script setup>
import { Icon } from '@iconify/vue'
import Button from './Button.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  type: {
    type: String,
    default: 'warning',
    validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const typeConfig = {
  warning: {
    icon: 'mdi:alert-circle-outline',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    confirmVariant: 'secondary'
  },
  danger: {
    icon: 'mdi:alert-octagon-outline',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    confirmVariant: 'danger'
  },
  info: {
    icon: 'mdi:information-outline',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    confirmVariant: 'primary'
  },
  success: {
    icon: 'mdi:check-circle-outline',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    confirmVariant: 'success'
  }
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  if (!props.loading) {
    emit('cancel')
  }
}
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
        @click.self="handleCancel"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="show"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div class="p-6">
              <!-- Icon -->
              <div class="flex justify-center mb-4">
                <div :class="[
                  'p-4 rounded-full',
                  typeConfig[type].iconBg
                ]">
                  <Icon
                    :icon="typeConfig[type].icon"
                    :class="typeConfig[type].iconColor"
                    width="48"
                  />
                </div>
              </div>

              <!-- Title -->
              <h3 class="text-xl font-bold text-gray-900 text-center mb-2">
                {{ title }}
              </h3>

              <!-- Message -->
              <p class="text-gray-600 text-center mb-6">
                {{ message }}
              </p>

              <!-- Actions -->
              <div class="flex gap-3">
                <Button
                  variant="outline"
                  class="flex-1"
                  icon="mdi:close"
                  :disabled="loading"
                  @click="handleCancel"
                >
                  {{ cancelText }}
                </Button>
                <Button
                  :variant="typeConfig[type].confirmVariant"
                  class="flex-1"
                  :icon="loading ? null : 'mdi:check'"
                  :loading="loading"
                  @click="handleConfirm"
                >
                  {{ confirmText }}
                </Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
