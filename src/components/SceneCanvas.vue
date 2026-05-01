<template>
  <canvas ref="canvasRef" class="scene-canvas" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  scene: { type: String, required: true },
})

const canvasRef = ref(null)
let currentModule = null

async function loadScene(sceneName) {
  if (currentModule) currentModule.destroy()
  const mod = await import(`../scenes/${sceneName}.js`)
  currentModule = mod
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = canvas.offsetWidth || window.innerWidth
  canvas.height = canvas.offsetHeight || window.innerHeight
  mod.init(canvas)
}

onMounted(() => loadScene(props.scene))

watch(() => props.scene, sceneName => loadScene(sceneName))

onUnmounted(() => {
  if (currentModule) currentModule.destroy()
})
</script>

<style scoped>
.scene-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
