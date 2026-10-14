<script setup>
import { useSignup } from '@/Script/Signup';
import AuthIllustration from './AuthIllustration.vue';

const emit = defineEmits(['switch-view', 'signup-success']);
const {
  fullName,
  email,
  password,
  agreeTerms,
  showPassword,
  isEmailVerified,
  isVerifyingEmail,
  verificationCode,
  countdown,
  isLoading,
  errorMessage,
  infoMessage,
  passwordStrength,
  togglePassword,
  sendVerificationCode,
  verifyEmailCode,
  goToLogin,
  handleSignup
} = useSignup(emit);
</script>

<template>
  <div class="auth-card-container">
    <!-- Top Half: Coins & Savings Vault Vector Artwork -->
    <AuthIllustration variant="coins" />

    <!-- Bottom Half: Dark Olive Card (6px border radius) -->
    <div class="auth-card-bottom">
      <!-- Title & Subtitle -->
      <div class="card-header">
        <h2 class="card-title">Create your account</h2>
        <p class="card-subtitle">
          Start tracking your income, expenses, and monthly budget with BudgetByte.
        </p>
      </div>

      <!-- Alerts -->
      <div v-if="errorMessage" class="alert-box alert-error">
        {{ errorMessage }}
      </div>
      <div v-if="infoMessage" class="alert-box alert-info">
        {{ infoMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSignup" class="auth-form">
        <!-- Full Name -->
        <div class="input-group">
          <label for="fullname" class="input-label">Full Name<span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="fullname"
              type="text"
              v-model="fullName"
              placeholder="e.g. Alex Morgan"
              autocomplete="name"
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- Email Address with Verification Action -->
        <div class="input-group">
          <div class="label-row">
            <label for="signup-email" class="input-label">Email Address<span class="required">*</span></label>
            <span v-if="isEmailVerified" class="badge-verified">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Verified
            </span>
            <button
              v-else
              type="button"
              class="verify-trigger-btn"
              @click="sendVerificationCode"
              :disabled="!email || isLoading"
            >
              Verify Email
            </button>
          </div>
          <div class="input-wrapper">
            <input
              id="signup-email"
              type="email"
              v-model="email"
              placeholder="alex@example.com"
              autocomplete="email"
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- Verification Code Row (If verifying email) -->
        <div v-if="isVerifyingEmail && !isEmailVerified" class="verification-step-box">
          <div class="label-row">
            <span class="sub-label">Enter 6-digit code sent to your email:</span>
            <button
              type="button"
              class="resend-btn"
              :disabled="countdown > 0"
              @click="sendVerificationCode"
            >
              {{ countdown > 0 ? `${countdown}s` : 'Resend' }}
            </button>
          </div>
          <div class="otp-row">
            <input
              type="text"
              maxlength="6"
              v-model="verificationCode"
              placeholder="123456"
              autocomplete="one-time-code"
              class="form-input code-input"
            />
            <button
              type="button"
              class="code-verify-btn"
              @click="verifyEmailCode"
              :disabled="isLoading || !verificationCode"
            >
              Confirm
            </button>
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
              autocomplete="new-password"
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
          <!-- Password Strength Indicator -->
          <div v-if="password" class="strength-bar-container">
            <div class="strength-bar">
              <div
                class="strength-fill"
                :style="{
                  width: passwordStrength.score === 1 ? '33%' : passwordStrength.score === 2 ? '66%' : '100%',
                  backgroundColor: passwordStrength.color
                }"
              ></div>
            </div>
            <span class="strength-text" :style="{ color: passwordStrength.color }">
              {{ passwordStrength.text }}
            </span>
          </div>
        </div>

        <!-- Terms Agreement -->
        <div class="terms-row">
          <label class="terms-label">
            <input type="checkbox" v-model="agreeTerms" required class="custom-checkbox" />
            <span class="terms-text">I agree to the Terms of Service & Privacy Policy</span>
          </label>
        </div>

        <!-- Submit Button (6px border radius) -->
        <button type="submit" class="primary-btn" :disabled="isLoading">
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="btn-spinner"></span>
        </button>

        <!-- Switch to Login -->
        <div class="switch-container">
          <span class="switch-text">Already have an account?</span>
          <button type="button" class="switch-btn" @click="goToLogin">
            Log In
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
  padding: 24px 24px 22px;
  display: flex;
  flex-direction: column;
  color: #f8fafc;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.card-header {
  margin-bottom: 18px;
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

/* Alert Boxes with 6px border radius */
.alert-box {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 12.5px;
  margin-bottom: 14px;
  line-height: 1.4;
}

.alert-error {
  background: rgba(239, 68, 68, 0.18);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
}

.alert-info {
  background: rgba(132, 204, 22, 0.16);
  border: 1px solid rgba(132, 204, 22, 0.35);
  color: #bef264;
}

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #cbd5e1;
}

.sub-label {
  font-size: 11.5px;
  color: #a3b899;
}

.required {
  color: #84cc16;
  margin-left: 2px;
}

.verify-trigger-btn {
  background: transparent;
  border: none;
  color: #a3e635;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.verify-trigger-btn:hover {
  text-decoration: underline;
}

.badge-verified {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  font-weight: 700;
  color: #84cc16;
}

.resend-btn {
  background: transparent;
  border: none;
  color: #a3e635;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
}

.resend-btn:disabled {
  color: #64748b;
  cursor: not-allowed;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

/* Inputs with 6px border radius */
.form-input {
  width: 100%;
  height: 42px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 2px;
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
  border-color: #fcfff8;
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
}

.eye-toggle-btn:hover {
  color: #84cc16;
}

/* OTP Code Box */
.verification-step-box {
  background: rgba(132, 204, 22, 0.08);
  border: 1px dashed rgba(132, 204, 22, 0.3);
  border-radius: 6px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.otp-row {
  display: flex;
  gap: 8px;
}

.code-input {
  flex: 1;
  font-family: monospace;
  font-size: 15px;
  letter-spacing: 3px;
  font-weight: 700;
  height: 38px;
}

.code-verify-btn {
  background: #84cc16;
  color: #143209;
  border: none;
  border-radius: 6px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  height: 38px;
  transition: background 0.15s ease;
}

.code-verify-btn:hover:not(:disabled) {
  background: #a3e635;
}

/* Password strength */
.strength-bar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-text {
  font-size: 11px;
  font-weight: 600;
}

/* Terms Row */
.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
}

.terms-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox {
  accent-color: #84cc16;
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.terms-text {
  color: #cbd5e1;
}

/* Primary Button with 6px border radius */
.primary-btn {
  width: 100%;
  height: 45px;
  background: #84cc16;
  color: #143209;
  border: none;
  border-radius: 23px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
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

/* Switch Container */
.switch-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
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
}

.switch-btn:hover {
  color: #a3e635;
  text-decoration: underline;
}
</style>