import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLogin } from '@/Script/Login';4

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

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

