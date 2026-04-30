<template>
  <nav class="navbar">
    <RouterLink to="/" class="navbar-brand">诗词天地</RouterLink>
    <div class="navbar-links">
      <RouterLink to="/">探索</RouterLink>
      <RouterLink to="/poet/all">诗人</RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #f0ece4;
}

.navbar-brand {
  font-family: serif;
  font-size: 18px;
  color: #1a1a1a;
  text-decoration: none;
  letter-spacing: 2px;
}

.navbar-links {
  display: flex;
  gap: 24px;
}

.navbar-links a {
  font-size: 14px;
  color: #666;
  text-decoration: none;
  letter-spacing: 1px;
  transition: color 0.2s;
}

.navbar-links a:hover,
.navbar-links a.router-link-active {
  color: #1a1a1a;
}
</style>
