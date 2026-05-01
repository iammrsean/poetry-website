<template>
  <div class="poet-view" v-if="poet">
    <NavBar />
    <header class="poet-header">
      <div class="poet-avatar-large">
        <img :src="poet.avatar" :alt="poet.name" @error="onAvatarError" />
        <span v-if="avatarFailed" class="avatar-fallback-large">{{ poet.name[0] }}</span>
      </div>
      <div class="poet-header-info">
        <h1 class="poet-name-large">{{ poet.name }}</h1>
        <div class="poet-tags">
          <span class="tag">{{ poet.dynasty }}</span>
          <span class="tag">{{ poet.style }}</span>
        </div>
        <p class="poet-bio">{{ poet.bio }}</p>
      </div>
    </header>

    <main class="poet-poems">
      <h2 class="poems-heading">作品（{{ poetPoems.length }}首）</h2>
      <div class="poem-grid">
        <PoemCard v-for="poem in poetPoems" :key="poem.id" :poem="poem" />
      </div>
    </main>
  </div>

  <div v-else class="not-found">
    <NavBar />
    <p>未找到该诗人</p>
    <RouterLink to="/">返回首页</RouterLink>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import PoemCard from '../components/PoemCard.vue'
import poets from '../data/poets.json'
import poems from '../data/poems.json'

const route = useRoute()
const avatarFailed = ref(false)
function onAvatarError() { avatarFailed.value = true }

const poet = computed(() => poets.find(p => p.id === route.params.id) || null)
const poetPoems = computed(() => poet.value ? poems.filter(p => p.authorId === poet.value.id) : [])
</script>

<style scoped>
.poet-view {
  min-height: 100vh;
  background: #fafaf7;
}

.poet-header {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;
  padding: 88px 24px 48px;
}

.poet-avatar-large {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #e8d5b0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.poet-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback-large {
  font-family: serif;
  font-size: 36px;
  color: #8a7060;
}

.poet-name-large {
  font-family: serif;
  font-size: 28px;
  letter-spacing: 4px;
  color: #1a1a1a;
  margin: 0 0 12px;
}

.poet-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 12px;
  background: #f0ece4;
  border-radius: 20px;
  font-size: 12px;
  color: #666;
  letter-spacing: 1px;
}

.poet-bio {
  font-size: 14px;
  color: #666;
  line-height: 1.9;
  letter-spacing: 0.5px;
  margin: 0;
  max-width: 520px;
}

.poet-poems {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 64px;
  border-top: 1px solid #e8e4dc;
}

.poems-heading {
  font-family: serif;
  font-size: 15px;
  color: #999;
  letter-spacing: 2px;
  margin: 32px 0 24px;
  font-weight: normal;
}

.poem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: #fafaf7;
  color: #999;
}

.not-found a {
  color: #666;
  font-size: 13px;
}
</style>
