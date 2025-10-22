<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/auth'
import Button from '../../components/ui/Button.vue'
import Input from '../../components/ui/Input.vue'
import Card from '../../components/ui/Card.vue'
import LoadingModal from '../../components/ui/LoadingModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({})
const loading = ref(false)
const showLoadingModal = ref(false)

async function handleLogin() {
  errors.value = {}

  if (!form.value.email) {
    errors.value.email = 'Email is required'
    return
  }

  if (!form.value.password) {
    errors.value.password = 'Password is required'
    return
  }

  if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    return
  }

  loading.value = true
  showLoadingModal.value = true

  const result = await authStore.login(form.value)

  loading.value = false
  showLoadingModal.value = false

  if (result.success) {
    router.push('/tasks')
  } else {
    errors.value.general = result.error || 'Login failed'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="bg-indigo-600 p-3 rounded-full">
            <Icon icon="mdi:checkbox-marked-circle-outline" class="text-white" width="40" />
          </div>
        </div>
        <h2 class="text-3xl font-extrabold text-gray-900">
          Task Management System
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Sign in to manage your tasks efficiently
        </p>
      </div>

      <!-- Login Card -->
      <Card>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Error Alert -->
          <div
            v-if="errors.general"
            class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2"
          >
            <Icon icon="mdi:alert-circle" width="20" class="mt-0.5" />
            <span class="text-sm">{{ errors.general }}</span>
          </div>

          <!-- Email Input -->
          <Input
            v-model="form.email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            icon="mdi:email-outline"
            :error="errors.email"
            required
            autocomplete="email"
          />

          <!-- Password Input -->
          <Input
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            icon="mdi:lock-outline"
            :error="errors.password"
            required
            autocomplete="current-password"
          />

          <!-- Submit Button -->
          <Button
            type="submit"
            variant="primary"
            size="lg"
            class="w-full"
            icon="mdi:login"
            :loading="loading"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </Button>

          <!-- Demo Info -->
          <div class="text-center space-y-2 pt-4 border-t border-gray-200">
            <p class="text-sm text-gray-600 font-medium">Demo Credentials</p>
            <div class="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1">
              <p class="flex items-center justify-center gap-2">
                <Icon icon="mdi:email" width="16" />
                <span>Email: <code class="bg-white px-2 py-0.5 rounded">test@example.com</code></span>
              </p>
              <p class="flex items-center justify-center gap-2">
                <Icon icon="mdi:key" width="16" />
                <span>Password: <code class="bg-white px-2 py-0.5 rounded">password123</code></span>
              </p>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              (Any valid email and password with 6+ characters will work)
            </p>
          </div>
        </form>
      </Card>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500">
        <p>Built with Laravel & Vue.js</p>
        <p>© 2023 Gigih Satriono</p>
      </div>
    </div>

    <!-- Loading Modal -->
    <LoadingModal
      :show="showLoadingModal"
      message="Signing in..."
    />
  </div>
</template>
