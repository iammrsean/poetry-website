<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        :value="query"
        placeholder="搜索诗词、诗人..."
        @input="emit('search', $event.target.value)"
      />
    </div>
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ active: activeCategory === tab.value }"
        @click="emit('category', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  query: { type: String, default: '' },
  activeCategory: { type: String, default: 'all' },
})

const emit = defineEmits(['search', 'category'])

const tabs = [
  { label: '全部', value: 'all' },
  { label: '唐诗', value: 'tang' },
  { label: '宋词', value: 'song' },
  { label: '现代诗', value: 'modern' },
]
</script>

<style scoped>
.search-bar {
  margin-bottom: 24px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0ece4;
  border-radius: 24px;
  padding: 10px 16px;
  margin-bottom: 16px;
}

.search-icon {
  font-size: 14px;
  color: #bbb;
}

input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
  width: 100%;
}

input::placeholder {
  color: #bbb;
}

.tabs {
  display: flex;
  gap: 8px;
}

.tab {
  padding: 6px 16px;
  border: none;
  border-radius: 20px;
  background: transparent;
  font-size: 13px;
  color: #999;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.tab:hover {
  background: #f0ece4;
  color: #555;
}

.tab.active {
  background: #1a1a1a;
  color: #fff;
}
</style>
