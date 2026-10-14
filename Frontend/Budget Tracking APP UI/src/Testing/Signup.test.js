import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSignup } from '@/Script/Signup';

// Vue Test Utils so push dont crash during test
const mockPush = vi.fn();
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

// mock fetch globaly
global.fetch = vi.fn();

// safe localStorage mock for node environment
if (typeof localStorage === 'undefined' || !localStorage.clear) {
    let store = {};
    global.localStorage = {
        getItem: (k) => store[k] ?? null,
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: (k) => { delete store[k]; },
        clear: () => { store = {}; },
    };
}

describe('Signup Composable Tests - Written by dev team', () => {
    let signup;
    const mockEmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        signup = useSignup(mockEmit);
    });

    // check default state on initial load
    it('should have empty initial values when first loaded', () => {
        // initialy all inputs should be blank
        expect(signup.fullName.value).toBe('');
        expect(signup.email.value).toBe('');
        expect(signup.password.value).toBe('');
        expect(signup.agreeTerms.value).toBe(false);
        expect(signup.showPassword.value).toBe(false);
        expect(signup.isEmailVerified.value).toBe(false);
        expect(signup.isLoading.value).toBe(false);
        expect(signup.errorMessage.value).toBe('');
    });

    // password strength meter test cases
    it('calculate password strength correctly for diffrent inputs', () => {
        // empty password score must be zero
        expect(signup.passwordStrength.value.score).toBe(0);

        // weak passowrd less than 6 chars
        signup.password.value = '123';
        expect(signup.passwordStrength.value.score).toBe(1);
        expect(signup.passwordStrength.value.text).toBe('Weak');

        // medium passowrd between 6 to 9 chars
        signup.password.value = 'secret1';
        expect(signup.passwordStrength.value.score).toBe(2);
        expect(signup.passwordStrength.value.text).toBe('Medium');

        // strong passowrd with 10 or more chars
        signup.password.value = 'superSecretPass123!';
        expect(signup.passwordStrength.value.score).toBe(3);
        expect(signup.passwordStrength.value.text).toBe('Strong');
    });

    // validation: empty inputs should fail
    it('dont allow submit when required fields is missing', async () => {
        // try to submit empty form
        await signup.handleSignup();
        expect(signup.errorMessage.value).toBe('Please fill in all required fields.');
        expect(global.fetch).not.toHaveBeenCalled();
    });

    // validation: password to short
    it('gives error when password is less then 8 characters', async () => {
        signup.fullName.value = 'Alex Morgan';
        signup.email.value = 'alex@example.com';
        signup.password.value = 'pass1'; // only 5 letters

        await signup.handleSignup();
        // should complain about 8 chars
        expect(signup.errorMessage.value).toBe('Password must be at least 8 characters long.');
        expect(global.fetch).not.toHaveBeenCalled();
    });

    // validation: terms checkbox must be checked
    it('complains if user does not checked terms and condition', async () => {
        signup.fullName.value = 'Alex Morgan';
        signup.email.value = 'alex@example.com';
        signup.password.value = 'password123';
        signup.agreeTerms.value = false; // user forgot checkbox

        await signup.handleSignup();
        expect(signup.errorMessage.value).toBe('Please agree to the terms and conditions.');
        expect(global.fetch).not.toHaveBeenCalled();
    });

    // toggle passowrd view
    it('toggle password visibility flag on button click', () => {
        expect(signup.showPassword.value).toBe(false);
        signup.togglePassword();
        expect(signup.showPassword.value).toBe(true);
        signup.togglePassword();
        expect(signup.showPassword.value).toBe(false);
    });

    // send email verfication code test
    it('sends verification code to email address', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Code sent', code: '654321' }),
        });

        signup.email.value = 'tester@gmail.com';
        await signup.sendVerificationCode();

        expect(signup.isVerifyingEmail.value).toBe(true);
        expect(signup.infoMessage.value).toContain('tester@gmail.com');
    });

    // confirm email otp code
    it('verify email code and update status to true', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => 'Email verified successfully!',
        });

        signup.email.value = 'tester@gmail.com';
        signup.verificationCode.value = '654321';
        await signup.verifyEmailCode();

        expect(signup.isEmailVerified.value).toBe(true);
        expect(signup.isVerifyingEmail.value).toBe(false);
        expect(signup.infoMessage.value).toBe('Email verified successfully!');
    });

    // full successful signup flow
    it('registers user sucessfuly and navigate to login page', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            text: async () => 'User registered successfully!',
        });

        signup.fullName.value = 'Vikrant Mahar';
        signup.email.value = 'vikrant@example.com';
        signup.password.value = 'StrongPass999#';
        signup.agreeTerms.value = true;
        signup.isEmailVerified.value = true;

        await signup.handleSignup();

        // make sure fetch was fired with proper json body
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(mockEmit).toHaveBeenCalledWith('signup-success', {
            name: 'Vikrant Mahar',
            email: 'vikrant@example.com',
        });

        // localstorage should have user profile saved
        expect(localStorage.getItem('userName')).toBe('Vikrant Mahar');
        expect(localStorage.getItem('userEmail')).toBe('vikrant@example.com');
        // should push to login screen
        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    // server error response handling
    it('handles backend error gracefully when server fails', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            text: async () => 'An account with this email already exists.',
        });

        signup.fullName.value = 'Vikrant Mahar';
        signup.email.value = 'alreadyused@example.com';
        signup.password.value = 'ValidPass1234';
        signup.agreeTerms.value = true;

        await signup.handleSignup();

        expect(signup.errorMessage.value).toBe('An account with this email already exists.');
        expect(mockPush).not.toHaveBeenCalled();
    });
});
