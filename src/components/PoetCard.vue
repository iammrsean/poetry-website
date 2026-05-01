<template>
  <RouterLink :to="`/poet/${poet.id}`" class="poet-card">
    <div class="poet-avatar">
      <img
        v-show="!avatarFailed"
        :src="poet.avatar"
        :alt="poet.name"
        @error="onAvatarError"
      />
      <span v-if="avatarFailed" class="avatar-fallback">{{ poet.name[0] }}</span>
    </div>
    <div class="poet-info">
      <h3 class="poet-name">{{ poet.name }}</h3>
      <p class="poet-meta">{{ poet.dynasty }} · {{ poet.style }}</p>
      <p class="poet-bio">{{ poet.bio }}</p>
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
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #f5f1e8;
  border-radius: 16px;
  text-decoration: none;
  transition: background 0.2s;
}

.poet-card:hover {
  background: #ede8dc;
}

.poet-avatar {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #e0d8c8;
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
  font-size: 24px;
  color: #8a7060;
}

.poet-name {
  font-family: serif;
  font-size: 18px;
  color: #1a1a1a;
  letter-spacing: 2px;
  margin: 0 0 4px;
}

.poet-meta {
  font-size: 12px;
  color: #999;
  letter-spacing: 1px;
  margin: 0 0 8px;
}

.poet-bio {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
  letter-spacing: 0.5px;
  margin: 0;
}
</style>
