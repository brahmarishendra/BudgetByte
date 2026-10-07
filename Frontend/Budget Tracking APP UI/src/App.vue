<script setup>
</script>

<template>
  <div class="auth-page">
    <!-- Ambient Green Background Glow Effect -->
    <div class="bg-glow"></div>

    <!-- Responsive Web Container -->
    <main class="auth-wrapper">
      <div class="auth-card">
        <router-view v-slot="{ Component }">
          <Transition name="auth-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style>
/* Global Resets */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  min-height: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>

<style scoped>
.auth-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffff;
  position: relative;
  overflow-x: hidden;
  padding: 32px 16px;
  box-sizing: border-box;
}

/* Background Ambient Glow */
.bg-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 580px;
  height: 580px;
  pointer-events: none;
  filter: blur(50px);
  z-index: 0;
}

/* Card Wrapper */
.auth-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  display: flex;
  justify-content: center;
}

/* Card Container */
.auth-card {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
   /*box-shadow: 
    0 20px 50px -10px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 0 35px rgba(16, 185, 129, 0.12);
  */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-page:has(:deep(.dashboard-shell)) .auth-card {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

/* View Transitions */
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.auth-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.auth-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Responsive adjustments */
@media (min-width: 600px) {
  .auth-page:has(:deep(.dashboard-shell)) {
    background: #ffffff;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 12px 0px;
    align-items: flex-start;
  }
  
  .auth-card {
    border-radius: 24px;
  }
}
</style>
