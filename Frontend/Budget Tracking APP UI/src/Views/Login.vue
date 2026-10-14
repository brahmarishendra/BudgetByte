<script setup>
import { useLogin } from '@/Script/Login.js';
import AuthIllustration from './AuthIllustration.vue';

const emit = defineEmits(['switch-view', 'login-success']);
const {
  email,
  password,
  showPassword,
  rememberMe,
  errorMessage,
  isLoading,
  handleLogin,
  togglePassword,
  goToSignup,
  forgotPassword,
} = useLogin(emit);
</script>

<template>
  <div class="auth-card-container">
    <!-- Top Half: Fintech Illustration (Hand holding phone, coins, savings box) -->
    <AuthIllustration variant="payment" />

    <!-- Bottom Half: Dark Olive Green Auth Fields (6px border radius) -->
    <div class="auth-card-bottom">
      <!-- Title & Subtitle matching image layout -->
      <div class="card-header">
        <h2 class="card-title">Easy payment process</h2>
        <p class="card-subtitle">
          Sign in to your BudgetByte account to track dues, expenses, and savings seamlessly.
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="alert-box alert-error">
        {{ errorMessage }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="auth-form">
        <!-- Email Field -->
        <div class="input-group">
          <label for="login-email" class="input-label">Email Address<span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="login-email"
              type="email"
              v-model="email"
              placeholder="name@example.com"
              autocomplete="email"
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="input-group">
          <label for="login-password" class="input-label">Password<span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="login-password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="••••••••••••"
              autocomplete="current-password"
              required
              class="form-input password-input"
            />
            <button
              type="button"
              class="eye-toggle-btn"
              @click="togglePassword"
              aria-label="Toggle password visibility"
            >
              <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Controls Row: Remember me + Forgot Password -->
        <div class="controls-row">
          <label class="remember-label">
            <input type="checkbox" v-model="rememberMe" class="custom-checkbox" />
            <span class="checkbox-text">Remember Me</span>
          </label>
          <a href="/forgot-password" class="forgot-link" @click.prevent="forgotPassword">
            Forgot Password?
          </a>
        </div>

        <!-- Submit Button (6px border radius) -->
        <button type="submit" class="primary-btn" :disabled="isLoading">
          <span v-if="!isLoading">Log In</span>
          <span v-else class="btn-spinner"></span>
        </button>

        <!-- Switch to Signup -->
        <div class="switch-container">
          <span class="switch-text">Don't have an account?</span>
          <button type="button" class="switch-btn" @click="goToSignup">
            Create an account
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Card Container with 6px border radius */
.auth-card-container {
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  background: #142714;
}

/* Bottom Half Dark Olive Card */
.auth-card-bottom {
  background: #152814;
  padding: 26px 24px 24px;
  display: flex;
  flex-direction: column;
  color: #f8fafc;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.card-header {
  margin-bottom: 20px;
}

.card-title {
  color: #ffffff;
  font-size: 23px;
  font-weight: 700;
  letter-spacing: -0.4px;
  margin: 0 0 6px;
  line-height: 1.2;
}

.card-subtitle {
  color: #a3b899;
  font-size: 13.5px;
  line-height: 1.45;
  margin: 0;
}

/* Alert Box with 6px border radius */
.alert-box {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 12.5px;
  margin-bottom: 16px;
  line-height: 1.4;
}

.alert-error {
  background: rgba(239, 68, 68, 0.18);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
}

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #cbd5e1;
}

.required {
  color: #84cc16;
  margin-left: 2px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Inputs with 6px border radius */
.form-input {
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius:20px;
  padding: 0 14px;
  font-size: 14px;
  color: #ffffff;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.password-input {
  padding-right: 42px;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.form-input:focus {
  border-color: #fdfff9;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 2px rgba(132, 204, 22, 0.25);
}

.eye-toggle-btn {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-toggle-btn:hover {
  color: #84cc16;
}

/* Controls Row */
.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
  margin-top: -2px;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #cbd5e1;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox {
  accent-color: #84cc16;
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.forgot-link {
  color: #a3e635;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.15s ease;
}

.forgot-link:hover {
  color: #bef264;
  text-decoration: underline;
}

/* Primary Button with 6px border radius */
.primary-btn {
  width: 100%;
  height: 45px;
  background: #84cc16;
  color: #143209;
  border: none;
  border-radius:0 px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  transition: all 0.2s ease;
}

.primary-btn:hover:not(:disabled) {
  background: #a3e635;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(132, 204, 22, 0.35);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(20, 50, 9, 0.2);
  border-top-color: #143209;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Switch View Container */
.switch-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 13px;
}

.switch-text {
  color: #94a3b8;
}

.switch-btn {
  background: transparent;
  border: none;
  color: #84cc16;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}

.switch-btn:hover {
  color: #a3e635;
  text-decoration: underline;
}
</style>