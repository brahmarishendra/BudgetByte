import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiUrl } from '@/config/api';

export function useLogin(emit) {
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const rememberMe = ref(true);
    const showPassword = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref('');


    const togglePassword = () => {
        showPassword.value = !showPassword.value;
    };

    const Navigate = () => {
        console.log('Login successful! Navigating to Home page...');
        if (router) {
            router.push('/home');
        }
    };

    const goToSignup = () => {
        emit('switch-view', 'signup');
        if (router) {
            router.push('/signup');
        }
    };

    const handleLogin = async () => {
        errorMessage.value = '';
        if (!email.value || !password.value) {
            errorMessage.value = 'Please fill in all required fields.';
            return;
        }

        isLoading.value = true;

        try {
            const response = await fetch(apiUrl('/api/auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.value,
                    password: password.value,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Invalid email or password.');
            }

            const data = await response.json();
            console.log('Login response:', data);

            localStorage.setItem('token', 'authenticated');
            localStorage.setItem('userId', String(data.userId));
            const userEmail = data.email || email.value;
            const userName = data.username || userEmail.split('@')[0];
            localStorage.setItem('userEmail', userEmail);
            localStorage.setItem('userName', userName);
            localStorage.setItem('profile', JSON.stringify({ name: userName, email: userEmail }));

            emit('login-success', { email: userEmail, name: userName, remember: rememberMe.value });
            Navigate(); // routes to /home
        } catch (err) {
            errorMessage.value = err.message || 'Server connection failed.';
        } finally {
            isLoading.value = false;
        }

    }
    return {
        email,
        password,
        showPassword,
        rememberMe,
        errorMessage,
        isLoading,
        handleLogin,
        togglePassword,
        goToSignup
    };
}