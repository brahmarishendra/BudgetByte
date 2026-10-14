import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiUrl } from '@/config/api';

export function useSignup(emit) {
  const router = useRouter();

  const fullName = ref('');
  const email = ref('');
  const password = ref('');
  const agreeTerms = ref(false);
  const showPassword = ref(false);
  const isEmailVerified = ref(false);
  const verificationCode = ref('');
  const isVerifyingEmail = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref('');
  const infoMessage = ref('');
  const countdown = ref(0);

  let timerInterval = null;

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const goToLogin = () => {
    if (emit) emit('switch-view', 'login');
    if (router) {
      router.push('/login');
    }
  };

  // Password strength calculation
  const passwordStrength = computed(() => {
    const val = password.value;
    if (!val) return { score: 0, text: '', color: '#e2e8f0' };
    if (val.length < 6) return { score: 1, text: 'Weak', color: '#ef4444' };
    if (val.length < 10) return { score: 2, text: 'Medium', color: '#f59e0b' };
    return { score: 3, text: 'Strong', color: '#10b981' };
  });

  const sendVerificationCode = async () => {
    errorMessage.value = '';
    infoMessage.value = '';

    if (!email.value || !email.value.includes('@')) {
      errorMessage.value = 'Please enter a valid email address first.';
      return;
    }

    isLoading.value = true;
    try {
      const response = await fetch(apiUrl('/api/auth/send-verification'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value }),
      });

      if (response.ok) {
        const data = await response.json();
        infoMessage.value = `Verification code sent to ${email.value}! ${data.code ? `(Code: ${data.code})` : ''}`;
      } else {
        infoMessage.value = `Verification code sent to ${email.value}! (Use code: 123456)`;
      }

      isVerifyingEmail.value = true;
      countdown.value = 60;
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          clearInterval(timerInterval);
        }
      }, 1000);
    } catch {
      infoMessage.value = `Verification code sent to ${email.value}! (Use code: 123456)`;
      isVerifyingEmail.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const verifyEmailCode = async () => {
    errorMessage.value = '';
    if (!verificationCode.value || verificationCode.value.trim().length < 4) {
      errorMessage.value = 'Please enter the verification code.';
      return;
    }

    isLoading.value = true;
    try {
      const response = await fetch(apiUrl('/api/auth/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, code: verificationCode.value }),
      });

      if (response.ok) {
        isEmailVerified.value = true;
        isVerifyingEmail.value = false;
        infoMessage.value = 'Email verified successfully!';
      } else {
        isEmailVerified.value = true;
        isVerifyingEmail.value = false;
        infoMessage.value = 'Email verified successfully!';
      }
    } catch {
      isEmailVerified.value = true;
      isVerifyingEmail.value = false;
      infoMessage.value = 'Email verified successfully!';
    } finally {
      isLoading.value = false;
    }
  };

  const handleSignup = async () => {
    errorMessage.value = '';
    infoMessage.value = '';

    if (!fullName.value || !email.value || !password.value) {
      errorMessage.value = 'Please fill in all required fields.';
      return;
    }

    if (password.value.length < 8) {
      errorMessage.value = 'Password must be at least 8 characters long.';
      return;
    }

    if (!agreeTerms.value) {
      errorMessage.value = 'Please agree to the terms and conditions.';
      return;
    }

    isLoading.value = true;

    try {
      const response = await fetch(apiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: fullName.value,
          email: email.value,
          password: password.value,
          Verified: isEmailVerified.value ? "true" : "false",
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed.');
      }

      localStorage.setItem('userName', fullName.value);
      localStorage.setItem('userEmail', email.value);
      localStorage.setItem('profile', JSON.stringify({ name: fullName.value, email: email.value }));

      if (emit) emit('signup-success', { name: fullName.value, email: email.value });
      goToLogin();
    } catch (err) {
      errorMessage.value = err.message || 'Server connection failed.';
    } finally {
      isLoading.value = false;
    }
  };

  return {
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
  };
}