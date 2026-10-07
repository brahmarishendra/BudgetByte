<script setup>
import { useLogin } from '@/Script/Login.js';

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
  <div class="login-container">
    <!-- Header Section with Dark Green Gradient -->
    <div class="brand-header">
      <div class="logo-wrapper">
        <h1 class="logo-title">Sendme.</h1>
        <span class="logo-subtitle">by mailbox</span>
      </div>
    </div>

    <!-- White Card Sheet with Curved Top -->
    <div class="form-sheet">
      <!-- Illustration -->
      <div class="illustration-container">
        <div class="illustration-badge">
          <svg width="68" height="64" viewBox="0 0 68 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Computer outline -->
            <rect x="14" y="10" width="40" height="28" rx="5" stroke="#10b981" stroke-width="2.2" fill="#ecfdf5"/>
            <!-- Screen header bar -->
            <path d="M14 17H54" stroke="#10b981" stroke-width="1.5"/>
            <circle cx="18" cy="13.5" r="1.2" fill="#10b981"/>
            <circle cx="22" cy="13.5" r="1.2" fill="#10b981"/>
            <circle cx="26" cy="13.5" r="1.2" fill="#10b981"/>
            
            <!-- User Icon on Screen -->
            <circle cx="34" cy="24" r="4" fill="#047857"/>
            <path d="M27 34C27 30.5 30 29 34 29C38 29 41 30.5 41 34" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
            
            <!-- Computer Stand -->
            <path d="M34 38V44" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M26 44H42" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
            
            <!-- Accent Sparkles / Rays -->
            <path d="M10 12L7 9" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
            <path d="M58 12L61 9" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 22H5" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
            <path d="M63 22H60" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      <!-- Main Titles -->
      <div class="header-text">
        <h2 class="title">Login in to Sendme.</h2>
        <p class="subtitle">Securely access your email, calendar, and files – all in one place.</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email Field -->
        <div class="input-group">
          <label for="email" class="input-label">Email Address<span class="required">*</span></label>
          <div class="input-wrapper">
            <input 
              id="email" 
              type="email" 
              v-model="email" 
              placeholder="johnlennon@Sendme.com" 
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="input-group">
          <label for="password" class="input-label">Password<span class="required">*</span></label>
          <div class="input-wrapper">
            <input 
              id="password" 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="••••••••••••" 
              required
              class="form-input password-input"
            />
            <button type="button" class="eye-toggle" @click="togglePassword" aria-label="Toggle password visibility">
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Controls Row -->
        <div class="controls-row">
          <label class="remember-label">
            <input type="checkbox" v-model="rememberMe" class="custom-checkbox" />
            <span class="checkbox-text">Remember Me</span>
          </label>
          <a href="/forgot-password" class="forgot-link" @click.prevent="forgotPassword">Forgot your Password?</a>
        </div>

        <!-- Error Alert if any -->
        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <!-- Log In Action Button -->
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Log In</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <!-- Create Account Switcher -->
        <div class="switch-view-container">
          <span class="switch-text">Don't have an account?</span>
          <button type="button" class="switch-btn" @click="goToSignup">
            Create an account
          </button>
        </div>
      </form>

      <!-- Footer Links -->
      <footer class="sheet-footer">
        <p>© 2025 Sendme. • Privacy • Security • Terms</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 90%;
  background: linear-gradient(165deg, #092014 0%, #0e341f 45%, #0a2516 100%);
  color: #1e293b;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}

/* Brand Header */
.brand-header {
  padding: 36px 24px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 70%);
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-title {
  color: #ffffff;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
  line-height: 1.1;
}

.logo-subtitle {
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  font-weight: 500;
  margin-top: 2px;
  letter-spacing: 0.2px;
}

/* White Form Sheet */
.form-sheet {
  flex: 1;
  background: #ffffff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 28px 24px 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0.9;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Illustration */
.illustration-container {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.illustration-badge {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Header Text */
.header-text {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px 0;
  letter-spacing: -0.4px;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.45;
  padding: 0 8px;
}

/* Form Styling */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #0f172a;
  font-family: inherit;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
}

.password-input {
  padding-right: 48px;
}

.eye-toggle {
  position: absolute;
  right: 14px;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.2s;
}

.eye-toggle:hover {
  color: #0f172a;
}

/* Controls Row */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
  margin-bottom: 4px;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  margin: 0;
  background: #ffffff;
}

.custom-checkbox:checked {
  background-color: #10b981;
  border-color: #10b981;
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  font-size: 13px;
  color: #334155;
  font-weight: 600;
}

.forgot-link {
  font-size: 13px;
  color: #059669;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #047857;
  text-decoration: underline;
}

.error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 500;
}

/* Submit Button */
.submit-btn {
  margin-top: 6px;
  height: 50px;
  width: 100%;
  background: #090d16;
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(9, 13, 22, 0.25);
}

.submit-btn:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(9, 13, 22, 0.35);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Switcher container */
.switch-view-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}

.switch-text {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.switch-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  font-weight: 700;
  color: #059669;
  cursor: pointer;
  font-family: inherit;
}

.switch-btn:hover {
  color: #047857;
  text-decoration: underline;
}

/* Sheet Footer */
.sheet-footer {
  margin-top: auto;
  padding-top: 24px;
  text-align: center;
}

.sheet-footer p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
}
</style>