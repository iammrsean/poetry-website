<template>
  <RouterLink :to="`/poem/${poem.id}`" class="poem-card">
    <div class="card-scene">
      <canvas ref="canvasRef" class="card-canvas" />
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ poem.title }}</h3>
      <p class="card-meta">{{ poem.author }} · {{ poem.dynasty }}</p>
      <p class="card-preview">{{ poem.lines[0] }}</p>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  poem: {
    type: Object,
    required: true,
  },
})

const canvasRef = ref(null)
let sceneModule = null

onMounted(async () => {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = canvas.offsetWidth || 280
  canvas.height = canvas.offsetHeight || 120
  const mod = await import(`../scenes/${props.poem.scene}.js`)
  sceneModule = mod
  mod.init(canvas)
})

onUnmounted(() => {
  if (sceneModule) sceneModule.destroy()
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
  position: relative;
  overflow: hidden;
}

.card-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

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
