<template>
  <div class="poem-reader">
    <p
      v-for="(line, index) in lines"
      :key="index"
      class="poem-line"
      :class="{ visible: visibleCount > index }"
    >
      {{ line }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  lines: { type: Array, required: true },
  delay: { type: Number, default: 800 },
})

const visibleCount = ref(0)

onMounted(() => {
  if (props.delay === 0) {
    visibleCount.value = props.lines.length
    return
  }
  props.lines.forEach((_, i) => {
    setTimeout(() => { visibleCount.value = i + 1 }, props.delay * (i + 1))
  })
})
</script>

<style scoped>
.poem-reader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.poem-line {
  font-family: serif;
  font-size: clamp(18px, 3vw, 28px);
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 6px;
  text-shadow: 0 0 20px rgba(255, 220, 100, 0.4);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  margin: 0;
}

.poem-line.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
