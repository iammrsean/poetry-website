<template>
  <div class="poem-view" v-if="poem">
    <SceneCanvas :scene="poem.scene" />

    <nav class="poem-nav">
      <RouterLink to="/" class="back-link">← 返回</RouterLink>
      <span class="poem-nav-title">{{ poem.title }}</span>
    </nav>

    <div class="poem-stage">
      <PoemReader :lines="poem.lines" :delay="900" />
      <p class="poem-author">—— {{ poem.author }}《{{ poem.title }}》</p>
      <button class="scroll-hint" @click="scrollToAnalysis">
        向下探索 ↓
      </button>
    </div>

    <section ref="analysisRef" class="analysis-section">
      <div class="analysis-inner">
        <h2 class="section-title">白话译文</h2>
        <p class="translation">{{ poem.translation }}</p>

        <h2 class="section-title">逐句解析</h2>
        <div class="line-analysis">
          <div
            v-for="item in poem.lineAnalysis"
            :key="item.line"
            class="analysis-item"
          >
            <p class="analysis-line">{{ item.line }}</p>
            <p class="analysis-meaning">{{ item.meaning }}</p>
          </div>
        </div>

        <h2 class="section-title">关于诗人</h2>
        <PoetCard v-if="poet" :poet="poet" />
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <p>未找到该诗词</p>
    <RouterLink to="/">返回首页</RouterLink>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import SceneCanvas from '../components/SceneCanvas.vue'
import PoemReader from '../components/PoemReader.vue'
import PoetCard from '../components/PoetCard.vue'
import poems from '../data/poems.json'
import poets from '../data/poets.json'

const route = useRoute()
const analysisRef = ref(null)

const poem = computed(() => poems.find(p => p.id === route.params.id) || null)
const poet = computed(() => poem.value ? poets.find(p => p.id === poem.value.authorId) : null)

function scrollToAnalysis() {
  analysisRef.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.poem-view {
  min-height: 100vh;
}

.poem-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 56px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
}

.back-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #fff;
}

.poem-nav-title {
  font-family: serif;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  letter-spacing: 2px;
}

.poem-stage {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 80px 24px 48px;
}

.poem-author {
  font-family: serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 2px;
  margin: 0;
}

.scroll-hint {
  margin-top: 24px;
  padding: 10px 24px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.scroll-hint:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);
}

.analysis-section {
  position: relative;
  z-index: 10;
  background: #fafaf7;
  padding: 64px 24px;
}

.analysis-inner {
  max-width: 680px;
  margin: 0 auto;
}

.section-title {
  font-family: serif;
  font-size: 15px;
  color: #1a1a1a;
  letter-spacing: 3px;
  margin: 0 0 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8e4dc;
}

.translation {
  font-size: 15px;
  color: #555;
  line-height: 1.9;
  letter-spacing: 1px;
  margin: 0 0 48px;
}

.line-analysis {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 48px;
}

.analysis-item {
  padding: 16px 20px;
  background: #fff;
  border-radius: 10px;
  border-left: 3px solid #e8d5b0;
}

.analysis-line {
  font-family: serif;
  font-size: 16px;
  color: #1a1a1a;
  letter-spacing: 3px;
  margin: 0 0 8px;
}

.analysis-meaning {
  font-size: 13px;
  color: #777;
  line-height: 1.8;
  letter-spacing: 0.5px;
  margin: 0;
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
