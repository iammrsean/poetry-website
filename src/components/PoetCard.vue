<template>
  <RouterLink :to="`/poet/${poet.id}`" class="poet-card">
    <div class="poet-avatar">
      <img
        :src="poet.avatar"
        :alt="poet.name"
        @error="onAvatarError"
      />
      <span v-if="avatarFailed" class="avatar-fallback">{{ poet.name[0] }}</span>
    </div>
    <div class="poet-info">
      <h3 class="poet-name">{{ poet.name }}</h3>
      <p class="poet-meta">{{ poet.dynasty }} · {{ poet.style }}</p>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

defineProps({
  poet: { type: Object, required: true },
})

const avatarFailed = ref(false)
function onAvatarError() { avatarFailed.value = true }
</script>

<style scoped>
.poet-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  text-decoration: none;
  transition: background 0.2s;
}

.poet-card:hover {
  background: rgba(255, 255, 255, 0.12);
}

.poet-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.poet-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-family: serif;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.8);
}

.poet-name {
  font-family: serif;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 2px;
  margin: 0 0 4px;
}

.poet-meta {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
  margin: 0;
}
</style>
