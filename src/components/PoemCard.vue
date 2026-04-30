<template>
  <RouterLink :to="`/poem/${poem.id}`" class="poem-card">
    <div class="card-scene" :class="`scene-${poem.scene}`"></div>
    <div class="card-body">
      <h3 class="card-title">{{ poem.title }}</h3>
      <p class="card-meta">{{ poem.author }} · {{ poem.dynasty }}</p>
      <p class="card-preview">{{ poem.lines[0] }}</p>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  poem: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.poem-card {
  display: block;
  text-decoration: none;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.poem-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-scene {
  height: 120px;
}

.scene-moonlit-night { background: linear-gradient(135deg, #0d1b2a, #1a3a5c); }
.scene-spring-morning { background: linear-gradient(135deg, #c8e6f5, #a5d6a7); }
.scene-river-flow { background: linear-gradient(135deg, #1a3a5c, #3a8fc4); }
.scene-rain { background: linear-gradient(135deg, #546e7a, #90a4ae); }
.scene-autumn { background: linear-gradient(135deg, #bf8040, #8b4513); }

.card-body {
  padding: 16px;
}

.card-title {
  font-family: serif;
  font-size: 16px;
  color: #1a1a1a;
  letter-spacing: 2px;
  margin: 0 0 6px;
}

.card-meta {
  font-size: 12px;
  color: #999;
  letter-spacing: 1px;
  margin: 0 0 8px;
}

.card-preview {
  font-family: serif;
  font-size: 13px;
  color: #555;
  letter-spacing: 2px;
  margin: 0;
}
</style>
