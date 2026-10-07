import {  computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiUrl } from '@/config/api';

export function useSignup(emit) {
const router = useRouter();

const fullName = ref('');
const email = ref('');
const password = ref('');
const agreeTerms = ref(false);
const showPassword = ref(false);
const Verified = ref(true);
const isLoading = ref(false);
const errorMessage = ref('');

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


const handleSignup = async () => {
  errorMessage.value = '';
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
        Verifed: Verified.value,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Registration failed.');
    }

    const data = await response.text();
    console.log('Signup response:', data);

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
}
return {
    fullName,
    email,
    password,
    Verified,
    agreeTerms,
    showPassword,
    isLoading,
    errorMessage,
    passwordStrength,
    togglePassword,
    goToLogin,
    handleSignup
}
};