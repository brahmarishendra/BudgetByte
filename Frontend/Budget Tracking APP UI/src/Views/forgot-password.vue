<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthIllustration from './AuthIllustration.vue';
import { apiUrl } from '@/config/api';

const router = useRouter();

const step = ref(1);
const email = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const handleResetPassword = async () => {
  errorMessage.value = '';

  if (!email.value.trim() || !currentPassword.value) {
    errorMessage.value = 'Email and current password are required.';
    return;
  }

  if (!newPassword.value || newPassword.value.length < 8) {
    errorMessage.value = 'New password must be at least 8 characters long.';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  isLoading.value = true;
  try {
    const response = await fetch(apiUrl('/api/auth/forgot-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Failed to reset password.');
    }

    step.value = 3;
  } catch (err) {
    errorMessage.value = err.message || 'Failed to update password.';
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="auth-card-container">
    <!-- Top Half: Fintech Security & Key Vector Illustration -->
    <AuthIllustration variant="security" />

    <!-- Bottom Half: Dark Green Auth Card with 6px Border Radius -->
    <div class="auth-card-bottom">
      <!-- Title & Subtitle matching image layout -->
      <div class="card-header">
        <h2 class="card-title">Set new password</h2>
        <p class="card-subtitle">
          Enter your current password, then choose a new password for your BudgetByte account.
        </p>
      </div>

      <div v-if="errorMessage" class="alert-box alert-error">
        {{ errorMessage }}
      </div>

      <form v-if="step === 1" @submit.prevent="handleResetPassword" class="auth-form">
        <div class="input-group">
          <label for="reset-email" class="input-label">Email Address<span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="reset-email"
              type="email"
              v-model="email"
              placeholder="name@example.com"
              autocomplete="email"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="input-group">
          <label for="current-pass" class="input-label">Current Password<span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="current-pass"
              :type="showPassword ? 'text' : 'password'"
              v-model="currentPassword"
              placeholder="Enter current password"
              autocomplete="current-password"
              required
              class="form-input"
            />
          </div>
        </div>

        <div class="input-group">
          <label for="new-pass" class="input-label">Set New Password<span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="new-pass"
              :type="showPassword ? 'text' : 'password'"
              v-model="newPassword"
              placeholder="At least 8 characters"
              autocomplete="new-password"
              required
              class="form-input"
            />
            <button 
              type="button" 
              class="eye-toggle-btn" 
              @click="showPassword = !showPassword"
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

        <div class="input-group">
          <label for="confirm-pass" class="input-label">Confirm New Password<span class="required">*</span></label>
          <div class="input-wrapper">
            <input
              id="confirm-pass"
              :type="showPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="Confirm new password"
              autocomplete="new-password"
              required
              class="form-input"
            />
          </div>
        </div>
        <button type="submit" class="primary-btn" :disabled="isLoading">
          <span v-if="!isLoading">Update Password</span>
          <span v-else class="btn-spinner"></span>
        </button>

        <div class="form-footer">
          <button type="button" class="link-btn" @click="goToLogin">
            ← Back to Login
          </button>
        </div>
      </form>

      <div v-else-if="step === 3" class="success-screen">
        <div class="success-icon-badge">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#84cc16" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 class="success-title">Password Updated!</h3>
        <p class="success-desc">
          Your password has been changed. You can now log in with your new password.
        </p>
        <button type="button" class="primary-btn" @click="goToLogin">
          Proceed to Login
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Card Container - Strict 6px border-radius */
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

/* Alert Boxes with 6px border radius */
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

.alert-success {
  background: rgba(132, 204, 22, 0.16);
  border: 1px solid rgba(132, 204, 22, 0.35);
  color: #bef264;
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

/* Input Fields - Strict 6px border radius */
.form-input {
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  padding: 0 14px;
  font-size: 14px;
  color: #ffffff;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.form-input:focus {
  border-color: #f2f2f2;
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

/* Primary Button - Strict 6px border radius */
.primary-btn {
  width: 100%;
  height: 45px;
  background: #f3f4f3;
  color: #143209;
  border: none;
  border-radius: 1px;
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
  background: #cdd4f9;
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

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 6px;
}

.link-btn {
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.15s ease;
}

.link-btn:hover {
  color: #84cc16;
}

/* Success Screen */
.success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px 0 6px;
}

.success-icon-badge {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: rgba(132, 204, 22, 0.18);
  border: 1px solid rgba(132, 204, 22, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.success-title {
  color: #ffffff;
  font-size: 19px;
  font-weight: 700;
  margin: 0 0 8px;
}

.success-desc {
  color: #a3b899;
  font-size: 13.5px;
  line-height: 1.5;
  margin: 0 0 20px;
}
</style>
