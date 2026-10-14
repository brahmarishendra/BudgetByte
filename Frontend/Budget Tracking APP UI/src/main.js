import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Login from './Views/Login.vue';
import Signup from './Views/Signup.vue';
import Home from './Views/Home.vue';
import forgotPassword from '@/Views/forgot-password.vue';

// Helper to check if user has active session
const isAuthenticated = () => {
  try {
    return Boolean(localStorage.getItem('token') || localStorage.getItem('userId'));
  } catch (e) {
    return false;
  }
};

const routes = [
  {
    path: '/',
    redirect: () => (isAuthenticated() ? '/home' : '/login')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { guestOnly: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: forgotPassword,
    meta: { guestOnly: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  // Catch-all route to handle deep links and avoid client 404
  {
    path: '/:pathMatch(.*)*',
    redirect: () => (isAuthenticated() ? '/home' : '/login')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Session Guard: Keeps user logged in until explicit logout
router.beforeEach((to, from, next) => {
  const loggedIn = isAuthenticated();

  // If user tries to access protected page without session -> send to login
  if (to.meta.requiresAuth && !loggedIn) {
    next('/login');
    return;
  }

  // If user is already logged in and visits login/signup/forgot-password -> keep them in /home
  if (to.meta.guestOnly && loggedIn) {
    next('/home');
    return;
  }

  next();
});

const app = createApp(App);
app.use(router);
app.mount('#app');