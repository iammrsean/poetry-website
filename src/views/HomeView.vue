<template>
  <div class="home">
    <NavBar />
    <main class="home-main">
      <SearchBar
        :query="query"
        :active-category="activeCategory"
        @search="onSearch"
        @category="onCategory"
      />
      <div class="poem-grid">
        <PoemCard v-for="poem in filteredPoems" :key="poem.id" :poem="poem" />
      </div>
      <p v-if="filteredPoems.length === 0" class="no-results">
        暂无结果，换个关键词试试？
      </p>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import SearchBar from '../components/SearchBar.vue'
import PoemCard from '../components/PoemCard.vue'
import poems from '../data/poems.json'

const query = ref('')
const activeCategory = ref('all')

const filteredPoems = computed(() => {
  let result = poems

  if (activeCategory.value === 'tang') {
    result = result.filter(p => p.dynasty === '唐')
  } else if (activeCategory.value === 'song') {
    result = result.filter(p => p.dynasty === '宋')
  } else if (activeCategory.value === 'modern') {
    result = result.filter(p => p.type === 'modern')
  }

  if (query.value.trim()) {
    const q = query.value.trim()
    result = result.filter(p =>
      p.title.includes(q) ||
      p.author.includes(q) ||
      p.lines.some(l => l.includes(q))
    )
  }

  return result
})

function onSearch(value) { query.value = value }
function onCategory(value) { activeCategory.value = value }
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #fafaf7;
}

.home-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 24px 48px;
}

.poem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.no-results {
  text-align: center;
  color: #bbb;
  font-size: 14px;
  padding: 48px 0;
  letter-spacing: 1px;
}
</style>
