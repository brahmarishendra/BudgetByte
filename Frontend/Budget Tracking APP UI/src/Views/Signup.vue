<script setup>
import { useSignup } from '@/Script/Signup';

const s = defineEmits(['switch-view', 'signup-success']);
const {
    fullName,
    email,
    password,
    agreeTerms,
    showPassword,
    isLoading,
    errorMessage,
    passwordStrength,
    togglePassword,
    goToLogin,
    handleSignup,
    data
} = useSignup(emit);
</script>

<template>
  <div class="signup-container">
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
            <!-- Shield / User Badge with checkmark -->
            <rect x="16" y="10" width="36" height="36" rx="10" stroke="#10b981" stroke-width="2.2" fill="#ecfdf5"/>
            <!-- Plus / Add User badge -->
            <circle cx="34" cy="24" r="7" stroke="#047857" stroke-width="2" fill="#d1fae5"/>
            <path d="M34 21V27M31 24H37" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
            <path d="M22 39C22 34.5 27 34 34 34C41 34 46 34.5 46 39" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
            
            <!-- Checkmark Icon -->
            <circle cx="46" cy="14" r="6" fill="#10b981"/>
            <path d="M43.5 14L45.5 16L49 12.5" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            
            <!-- Sparkles -->
            <path d="M8 14L11 11" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
            <path d="M57 28L60 25" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      <!-- Main Titles -->
      <div class="header-text">
        <h2 class="title">Create your Account</h2>
        <p class="subtitle">Join Sendme today to manage your mail, calendar, and files in one place.</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSignup" class="signup-form">
        <!-- Full Name Field -->
        <div class="input-group">
          <label for="fullname" class="input-label">Full Name<span class="required">*</span></label>
          <div class="input-wrapper">
            <input 
              id="fullname" 
              type="text" 
              v-model="fullName" 
              placeholder="John Lennon" 
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- Email Field -->
        <div class="input-group">
          <label for="signup-email" class="input-label">Email Address<span class="required">*</span></label>
          <div class="input-wrapper">
            <input 
              id="signup-email" 
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
          <label for="signup-password" class="input-label">Password<span class="required">*</span></label>
          <div class="input-wrapper">
            <input 
              id="signup-password" 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="At least 8 characters" 
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
          <!-- Strength Meter Bar -->
          <div class="strength-meter" v-if="password">
            <div class="meter-bars">
              <div class="bar" :style="{ background: passwordStrength.score >= 1 ? passwordStrength.color : '#e2e8f0' }"></div>
              <div class="bar" :style="{ background: passwordStrength.score >= 2 ? passwordStrength.color : '#e2e8f0' }"></div>
              <div class="bar" :style="{ background: passwordStrength.score >= 3 ? passwordStrength.color : '#e2e8f0' }"></div>
            </div>
            <span class="strength-text" :style="{ color: passwordStrength.color }">{{ passwordStrength.text }}</span>
          </div>
        </div>

        <!-- Terms Agreement Row -->
        <div class="controls-row">
          <label class="remember-label">
            <input type="checkbox" v-model="agreeTerms" class="custom-checkbox" />
            <span class="checkbox-text">I agree to Terms, Privacy & Security</span>
          </label>
        </div>

        <!-- Error Banner -->
        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <!-- Sign Up Action Button -->
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <!-- Log In Switcher -->
        <div class="switch-view-container">
          <span class="switch-text">Already have an account?</span>
          <button type="button" class="switch-btn" @click="goToLogin">
            Log In
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
.signup-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, rgba(5, 150, 105, 0.04) 50%, transparent 70%);
  color: #1e293b;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}

/* Brand Header */
.brand-header {
  padding: 32px 24px 26px;
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
  border-top-left-radius: 36px;
  border-top-right-radius: 36px;
  padding: 24px 24px 20px;
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
  margin-bottom: 8px;
}

.illustration-badge {
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Header Text */
.header-text {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
  letter-spacing: -0.4px;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.45;
  padding: 0 4px;
}

/* Form Styling */
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
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
  height: 46px;
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

/* Strength Meter */
.strength-meter {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.meter-bars {
  display: flex;
  gap: 4px;
  flex: 1;
}

.bar {
  height: 4px;
  flex: 1;
  border-radius: 2px;
  transition: background 0.3s;
}

.strength-text {
  font-size: 11px;
  font-weight: 700;
  min-width: 48px;
  text-align: right;
}

/* Controls Row */
.controls-row {
  display: flex;
  align-items: center;
  margin-top: 2px;
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
  margin-top: 4px;
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
  margin-top: 8px;
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
  padding-top: 20px;
  text-align: center;
}

.sheet-footer p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
}
</style>