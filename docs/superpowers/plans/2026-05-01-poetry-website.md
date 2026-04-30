# 诗词天地 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Vue 3 poetry website with immersive scene animations, card-grid homepage, and full-screen poem detail pages.

**Architecture:** Vue 3 + Vite SPA with Vue Router for 3 pages (home, poem detail, poet). All content stored in local JSON files. Canvas-based scene animations loaded dynamically per poem via a `scene` field. Vitest + @vue/test-utils for testing.

**Tech Stack:** Vue 3, Vite, Vue Router 4, Vitest, @vue/test-utils, Canvas API

---

## File Map

```
poetry-website/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── images/poets/          # poet avatar images (PNG)
├── src/
│   ├── main.js                # app entry, mount Vue
│   ├── App.vue                # root component with <RouterView>
│   ├── router/
│   │   └── index.js           # Vue Router: /, /poem/:id, /poet/:id
│   ├── data/
│   │   ├── poems.json         # all poem records
│   │   └── poets.json         # all poet records
│   ├── components/
│   │   ├── NavBar.vue         # fixed top nav with links
│   │   ├── SearchBar.vue      # search input + category tabs, emits filter event
│   │   ├── PoemCard.vue       # card showing title/author/dynasty/first-line
│   │   ├── PoetCard.vue       # poet avatar + name + dynasty shown at bottom of PoemView
│   │   ├── SceneCanvas.vue    # full-screen Canvas, dynamically loads scene module
│   │   └── PoemReader.vue     # staggered fade-in of poem lines over Canvas
│   ├── views/
│   │   ├── HomeView.vue       # SearchBar + category tabs + PoemCard grid
│   │   ├── PoemView.vue       # SceneCanvas + PoemReader + scroll-to analysis + PoetCard
│   │   └── PoetView.vue       # poet header + bio + poem list
│   └── scenes/
│       ├── moonlit-night.js   # Canvas: stars, moon glow, silhouette
│       ├── spring-morning.js  # Canvas: falling petals, soft light
│       ├── river-flow.js      # Canvas: water ripples, mist
│       ├── rain.js            # Canvas: falling rain particles
│       └── autumn.js          # Canvas: falling leaves particles
├── tests/
│   ├── setup.js               # Vitest global setup (canvas mock)
│   ├── components/
│   │   ├── NavBar.test.js
│   │   ├── SearchBar.test.js
│   │   ├── PoemCard.test.js
│   │   ├── PoetCard.test.js
│   │   ├── SceneCanvas.test.js
│   │   └── PoemReader.test.js
│   ├── views/
│   │   ├── HomeView.test.js
│   │   ├── PoemView.test.js
│   │   └── PoetView.test.js
│   └── scenes/
│       └── scene-interface.test.js  # all scenes export init/destroy
└── docs/superpowers/
    ├── specs/2026-05-01-poetry-site-design.md
    └── plans/2026-05-01-poetry-website.md
```

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue`
- Create: `tests/setup.js`

- [ ] **Step 1: Initialize project**

```bash
cd /Users/sean/Documents/poetry-website
npm create vite@latest . -- --template vue
npm install
npm install vue-router@4
npm install -D vitest @vue/test-utils jsdom @vitejs/plugin-vue
```

- [ ] **Step 2: Configure vite.config.js**

Replace the generated `vite.config.js` with:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
  },
})
```

- [ ] **Step 3: Create tests/setup.js (Canvas mock)**

```js
// Mock HTMLCanvasElement for jsdom (which has no real Canvas)
HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  scale: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  globalAlpha: 1,
  lineWidth: 1,
})
```

- [ ] **Step 4: Update src/App.vue**

```vue
<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
```

- [ ] **Step 5: Run initial test to verify setup**

Add a smoke test to confirm Vitest works. Create `tests/smoke.test.js`:

```js
import { describe, it, expect } from 'vitest'

describe('setup', () => {
  it('vitest works', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run: `npx vitest run tests/smoke.test.js`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: initialize Vue 3 + Vite project with Vitest"
```

---

## Task 2: Data Files

**Files:**
- Create: `src/data/poems.json`
- Create: `src/data/poets.json`

- [ ] **Step 1: Create src/data/poets.json**

```json
[
  {
    "id": "li-bai",
    "name": "李白",
    "dynasty": "唐",
    "style": "浪漫主义",
    "bio": "字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为「诗仙」。其诗豪迈奔放，想象丰富，语言流转自然。",
    "avatar": "/images/poets/li-bai.png"
  },
  {
    "id": "meng-haoran",
    "name": "孟浩然",
    "dynasty": "唐",
    "style": "山水田园",
    "bio": "唐代著名的山水田园派诗人，与王维并称「王孟」。诗风清淡自然，意境幽远。",
    "avatar": "/images/poets/meng-haoran.png"
  },
  {
    "id": "du-mu",
    "name": "杜牧",
    "dynasty": "唐",
    "style": "晚唐风骨",
    "bio": "字牧之，号樊川居士，晚唐杰出诗人，与李商隐并称「小李杜」。诗风俊爽清丽。",
    "avatar": "/images/poets/du-mu.png"
  },
  {
    "id": "hai-zi",
    "name": "海子",
    "dynasty": "现代",
    "style": "浪漫主义",
    "bio": "原名查海生，中国当代著名诗人。诗歌充满浪漫主义色彩，意象瑰丽，对土地与生命有深刻关注。",
    "avatar": "/images/poets/hai-zi.png"
  }
]
```

- [ ] **Step 2: Create src/data/poems.json**

```json
[
  {
    "id": "jingye-si",
    "title": "静夜思",
    "author": "李白",
    "authorId": "li-bai",
    "dynasty": "唐",
    "type": "classical",
    "lines": ["床前明月光", "疑是地上霜", "举头望明月", "低头思故乡"],
    "translation": "皎洁的月光洒在床前，朦胧中像是铺了一层白霜。诗人抬起头望向天上的明月，又低下头深深思念起远方的故乡。",
    "lineAnalysis": [
      { "line": "床前明月光", "meaning": "月光透窗洒落床前，明亮如昼，宁静的夜晚因此有了光色。" },
      { "line": "疑是地上霜", "meaning": "诗人从梦中初醒，朦胧间误以为地上铺了一层白霜，写出了月光之皎洁。" },
      { "line": "举头望明月", "meaning": "抬起头来，才看清那不是霜，而是高悬天空的明月。" },
      { "line": "低头思故乡", "meaning": "低下头来，思乡之情油然而生。举头与低头之间，是游子无尽的乡愁。" }
    ],
    "scene": "moonlit-night",
    "tags": ["思乡", "月亮", "夜晚"]
  },
  {
    "id": "chun-xiao",
    "title": "春晓",
    "author": "孟浩然",
    "authorId": "meng-haoran",
    "dynasty": "唐",
    "type": "classical",
    "lines": ["春眠不觉晓", "处处闻啼鸟", "夜来风雨声", "花落知多少"],
    "translation": "春夜里睡得香甜，不知不觉天已大亮。处处都能听到鸟儿欢快地鸣叫。昨夜里曾经风雨交加，也不知道有多少花儿被打落。",
    "lineAnalysis": [
      { "line": "春眠不觉晓", "meaning": "春天气候宜人，睡得香甜，竟不知天色已明，写出春眠之酣畅。" },
      { "line": "处处闻啼鸟", "meaning": "醒来后，四面八方都是鸟鸣声，春意盎然，生机勃勃。" },
      { "line": "夜来风雨声", "meaning": "回想起昨夜曾有风雨，声声入耳，却未能留意。" },
      { "line": "花落知多少", "meaning": "不知有多少花朵在昨夜的风雨中零落，言外带着惜春之情。" }
    ],
    "scene": "spring-morning",
    "tags": ["春天", "自然", "清晨"]
  },
  {
    "id": "zao-fa-baidi-cheng",
    "title": "早发白帝城",
    "author": "李白",
    "authorId": "li-bai",
    "dynasty": "唐",
    "type": "classical",
    "lines": ["朝辞白帝彩云间", "千里江陵一日还", "两岸猿声啼不住", "轻舟已过万重山"],
    "translation": "清晨告别高入云霄的白帝城，顺流而下千里之遥的江陵只需一天。两岸猿猴的叫声还未停歇，轻快的小船已经驶过了重重高山。",
    "lineAnalysis": [
      { "line": "朝辞白帝彩云间", "meaning": "清晨从白帝城出发，城在高处，云雾缭绕，彩云之间，气象壮阔。" },
      { "line": "千里江陵一日还", "meaning": "千里之遥，一日可达，写出水流之急、行舟之快。" },
      { "line": "两岸猿声啼不住", "meaning": "两岸猿鸣声声不断，峡谷回响，更衬托出江流的湍急。" },
      { "line": "轻舟已过万重山", "meaning": "轻快的小舟一闪而过，万重山已在身后，写出诗人获赦后的轻松喜悦之情。" }
    ],
    "scene": "river-flow",
    "tags": ["旅途", "江河", "喜悦"]
  },
  {
    "id": "qing-ming",
    "title": "清明",
    "author": "杜牧",
    "authorId": "du-mu",
    "dynasty": "唐",
    "type": "classical",
    "lines": ["清明时节雨纷纷", "路上行人欲断魂", "借问酒家何处有", "牧童遥指杏花村"],
    "translation": "清明节这天细雨纷纷，路上羁旅行客个个落魄断魂。借问当地人何处买酒浇愁，牧童笑而不答，遥指远处的杏花山村。",
    "lineAnalysis": [
      { "line": "清明时节雨纷纷", "meaning": "清明时节，细雨连绵，渲染出一种忧郁、哀思的气氛。" },
      { "line": "路上行人欲断魂", "meaning": "赶路的行人在细雨中，思念亡人，愁绪满怀，魂魄似要离体而去。" },
      { "line": "借问酒家何处有", "meaning": "向路人打听哪里有酒家，想借酒消愁。" },
      { "line": "牧童遥指杏花村", "meaning": "牧童没有说话，只是遥遥一指，远处杏花盛开的村子里有酒家。画面生动，余味无穷。" }
    ],
    "scene": "rain",
    "tags": ["清明", "思念", "烟雨"]
  },
  {
    "id": "shan-xing",
    "title": "山行",
    "author": "杜牧",
    "authorId": "du-mu",
    "dynasty": "唐",
    "type": "classical",
    "lines": ["远上寒山石径斜", "白云深处有人家", "停车坐爱枫林晚", "霜叶红于二月花"],
    "translation": "山石小路蜿蜒盘旋着伸向远山，在白云缭绕的深山里有几户人家。因为太喜爱傍晚时的枫林美景而停下车来，经霜的枫叶比二月的鲜花还要红艳。",
    "lineAnalysis": [
      { "line": "远上寒山石径斜", "meaning": "一条石铺小路蜿蜒向上，通向遥远的寒山，一个"斜"字写出山路的曲折幽深。" },
      { "line": "白云深处有人家", "meaning": "在白云缭绕之处，隐约可见几户人家，景色幽远，充满意境。" },
      { "line": "停车坐爱枫林晚", "meaning": "诗人停下车来，只因太喜爱这傍晚的枫林，"坐"字表达了由衷的喜爱。" },
      { "line": "霜叶红于二月花", "meaning": "经过霜打的枫叶，比二月的春花更加红艳，这是全诗的点睛之笔，表达了对秋色的赞美。" }
    ],
    "scene": "autumn",
    "tags": ["秋天", "山林", "枫叶"]
  },
  {
    "id": "mian-chao-da-hai",
    "title": "面朝大海，春暖花开",
    "author": "海子",
    "authorId": "hai-zi",
    "dynasty": "现代",
    "type": "modern",
    "lines": ["从明天起，做一个幸福的人", "喂马、劈柴，周游世界", "从明天起，关心粮食和蔬菜", "我有一所房子，面朝大海，春暖花开"],
    "translation": "诗人以朴素的语言写出对幸福生活的向往：从明天起，做一个真实的、劳作的、与世界和人们相连的人。那所面朝大海、春暖花开的房子，是诗人最纯粹的幸福想象。",
    "lineAnalysis": [
      { "line": "从明天起，做一个幸福的人", "meaning": "从「明天起」而非「今天起」，暗示此刻的遥远与渴望，幸福是诗人未曾抵达的彼岸。" },
      { "line": "喂马、劈柴，周游世界", "meaning": "日常的劳作与辽阔的旅行并列，幸福既在身边琐碎里，也在无边无际的世界中。" },
      { "line": "从明天起，关心粮食和蔬菜", "meaning": "回归日常，回归土地，粮食与蔬菜是生命最本质的根。" },
      { "line": "我有一所房子，面朝大海，春暖花开", "meaning": "全诗最动人的意象：一所朝向大海的房子，大海是自由，春暖花开是温柔，这是诗人心中最纯粹的幸福。" }
    ],
    "scene": "spring-morning",
    "tags": ["幸福", "自然", "现代诗"]
  }
]
```

- [ ] **Step 3: Commit**

```bash
git add src/data/
git commit -m "feat: add poems and poets JSON data"
```

---

## Task 3: Vue Router

**Files:**
- Create: `src/router/index.js`
- Modify: `src/main.js`

- [ ] **Step 1: Create src/router/index.js**

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/poem/:id', component: () => import('../views/PoemView.vue') },
  { path: '/poet/:id', component: () => import('../views/PoetView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
```

- [ ] **Step 2: Create placeholder views so router can import them**

Create `src/views/HomeView.vue`:
```vue
<template><div>Home</div></template>
```

Create `src/views/PoemView.vue`:
```vue
<template><div>Poem</div></template>
```

Create `src/views/PoetView.vue`:
```vue
<template><div>Poet</div></template>
```

- [ ] **Step 3: Update src/main.js**

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

createApp(App).use(router).mount('#app')
```

- [ ] **Step 4: Verify dev server runs**

```bash
npm run dev
```

Expected: server starts at http://localhost:5173, no errors in console.

- [ ] **Step 5: Commit**

```bash
git add src/router/ src/main.js src/views/
git commit -m "feat: add Vue Router with three routes"
```

---

## Task 4: NavBar Component

**Files:**
- Create: `src/components/NavBar.vue`
- Create: `tests/components/NavBar.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/components/NavBar.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import NavBar from '../../src/components/NavBar.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div/>' } },
    { path: '/poet/all', component: { template: '<div/>' } },
  ],
})

describe('NavBar', () => {
  it('renders site name', async () => {
    const wrapper = mount(NavBar, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('诗词天地')
  })

  it('has a link to home', async () => {
    const wrapper = mount(NavBar, { global: { plugins: [router] } })
    const links = wrapper.findAll('a')
    const hrefs = links.map(l => l.attributes('href'))
    expect(hrefs).toContain('/')
  })

  it('has a link to explore poets', async () => {
    const wrapper = mount(NavBar, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('诗人')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/NavBar.test.js
```

Expected: FAIL — `NavBar.vue` does not exist.

- [ ] **Step 3: Implement NavBar**

Create `src/components/NavBar.vue`:

```vue
<template>
  <nav class="navbar">
    <RouterLink to="/" class="navbar-brand">诗词天地</RouterLink>
    <div class="navbar-links">
      <RouterLink to="/">探索</RouterLink>
      <RouterLink to="/poet/all">诗人</RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #f0ece4;
}

.navbar-brand {
  font-family: serif;
  font-size: 18px;
  color: #1a1a1a;
  text-decoration: none;
  letter-spacing: 2px;
}

.navbar-links {
  display: flex;
  gap: 24px;
}

.navbar-links a {
  font-size: 14px;
  color: #666;
  text-decoration: none;
  letter-spacing: 1px;
  transition: color 0.2s;
}

.navbar-links a:hover,
.navbar-links a.router-link-active {
  color: #1a1a1a;
}
</style>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/components/NavBar.test.js
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/NavBar.vue tests/components/NavBar.test.js
git commit -m "feat: add NavBar component"
```

---

## Task 5: PoemCard Component

**Files:**
- Create: `src/components/PoemCard.vue`
- Create: `tests/components/PoemCard.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/components/PoemCard.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PoemCard from '../../src/components/PoemCard.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/poem/:id', component: { template: '<div/>' } }],
})

const poem = {
  id: 'jingye-si',
  title: '静夜思',
  author: '李白',
  dynasty: '唐',
  type: 'classical',
  lines: ['床前明月光', '疑是地上霜'],
  scene: 'moonlit-night',
}

describe('PoemCard', () => {
  it('displays poem title', async () => {
    const wrapper = mount(PoemCard, { props: { poem }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('静夜思')
  })

  it('displays author and dynasty', async () => {
    const wrapper = mount(PoemCard, { props: { poem }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('李白')
    expect(wrapper.text()).toContain('唐')
  })

  it('displays first line as preview', async () => {
    const wrapper = mount(PoemCard, { props: { poem }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('床前明月光')
  })

  it('links to poem detail page', async () => {
    const wrapper = mount(PoemCard, { props: { poem }, global: { plugins: [router] } })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/poem/jingye-si')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/PoemCard.test.js
```

Expected: FAIL

- [ ] **Step 3: Implement PoemCard**

Create `src/components/PoemCard.vue`:

```vue
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/components/PoemCard.test.js
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/PoemCard.vue tests/components/PoemCard.test.js
git commit -m "feat: add PoemCard component"
```

---

## Task 6: SearchBar Component

**Files:**
- Create: `src/components/SearchBar.vue`
- Create: `tests/components/SearchBar.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/components/SearchBar.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../../src/components/SearchBar.vue'

describe('SearchBar', () => {
  it('renders search input', () => {
    const wrapper = mount(SearchBar)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('emits search event on input', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.find('input').setValue('李白')
    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')[0]).toEqual(['李白'])
  })

  it('renders category tabs', () => {
    const wrapper = mount(SearchBar)
    const text = wrapper.text()
    expect(text).toContain('全部')
    expect(text).toContain('唐诗')
    expect(text).toContain('宋词')
    expect(text).toContain('现代诗')
  })

  it('emits category event when tab clicked', async () => {
    const wrapper = mount(SearchBar)
    const tabs = wrapper.findAll('.tab')
    await tabs[1].trigger('click')
    expect(wrapper.emitted('category')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/SearchBar.test.js
```

Expected: FAIL

- [ ] **Step 3: Implement SearchBar**

Create `src/components/SearchBar.vue`:

```vue
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/components/SearchBar.test.js
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/SearchBar.vue tests/components/SearchBar.test.js
git commit -m "feat: add SearchBar component with category tabs"
```

---

## Task 7: Scene Modules

**Files:**
- Create: `src/scenes/moonlit-night.js`
- Create: `src/scenes/spring-morning.js`
- Create: `src/scenes/river-flow.js`
- Create: `src/scenes/rain.js`
- Create: `src/scenes/autumn.js`
- Create: `tests/scenes/scene-interface.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/scenes/scene-interface.test.js`:

```js
import { describe, it, expect } from 'vitest'

const sceneModules = [
  '../../src/scenes/moonlit-night.js',
  '../../src/scenes/spring-morning.js',
  '../../src/scenes/river-flow.js',
  '../../src/scenes/rain.js',
  '../../src/scenes/autumn.js',
]

describe('scene modules', () => {
  sceneModules.forEach(modulePath => {
    it(`${modulePath} exports init and destroy`, async () => {
      const mod = await import(modulePath)
      expect(typeof mod.init).toBe('function')
      expect(typeof mod.destroy).toBe('function')
    })

    it(`${modulePath} init accepts canvas element`, async () => {
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 600
      const mod = await import(modulePath)
      expect(() => mod.init(canvas)).not.toThrow()
      mod.destroy()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/scenes/scene-interface.test.js
```

Expected: FAIL — scene files not found.

- [ ] **Step 3: Create src/scenes/moonlit-night.js**

```js
let animationId = null

export function init(canvas) {
  const ctx = canvas.getContext('2d')
  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.7,
    r: Math.random() * 1.5 + 0.5,
    opacity: Math.random(),
    delta: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height)
    bg.addColorStop(0, '#060d1a')
    bg.addColorStop(1, '#0d1b2a')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Stars
    stars.forEach(star => {
      star.opacity += star.delta
      if (star.opacity > 1 || star.opacity < 0.1) star.delta *= -1
      const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 3)
      glow.addColorStop(0, `rgba(255,255,255,${star.opacity})`)
      glow.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2)
      ctx.fill()
    })

    // Moon
    const moonX = canvas.width * 0.78
    const moonY = canvas.height * 0.18
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 80)
    moonGlow.addColorStop(0, 'rgba(255,250,200,0.15)')
    moonGlow.addColorStop(1, 'rgba(255,200,50,0)')
    ctx.fillStyle = moonGlow
    ctx.beginPath()
    ctx.arc(moonX, moonY, 80, 0, Math.PI * 2)
    ctx.fill()

    const moonCore = ctx.createRadialGradient(moonX - 6, moonY - 6, 0, moonX, moonY, 28)
    moonCore.addColorStop(0, '#fffde7')
    moonCore.addColorStop(0.6, '#fff9c4')
    moonCore.addColorStop(1, '#ffd54f')
    ctx.fillStyle = moonCore
    ctx.beginPath()
    ctx.arc(moonX, moonY, 28, 0, Math.PI * 2)
    ctx.fill()

    // Ground
    const ground = ctx.createLinearGradient(0, canvas.height * 0.85, 0, canvas.height)
    ground.addColorStop(0, '#0a1008')
    ground.addColorStop(1, '#050a04')
    ctx.fillStyle = ground
    ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15)

    // Silhouette figure
    const fx = canvas.width / 2
    const fy = canvas.height * 0.82
    ctx.fillStyle = '#030805'
    ctx.beginPath()
    ctx.arc(fx, fy - 18, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(fx - 5, fy - 10, 10, 22)

    animationId = requestAnimationFrame(draw)
  }

  draw()
}

export function destroy() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}
```

- [ ] **Step 4: Create src/scenes/spring-morning.js**

```js
let animationId = null

export function init(canvas) {
  const ctx = canvas.getContext('2d')
  const petals = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 8 + 4,
    speedY: Math.random() * 1 + 0.5,
    speedX: Math.random() * 0.8 - 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.05,
    opacity: Math.random() * 0.6 + 0.4,
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
    sky.addColorStop(0, '#c8e6f5')
    sky.addColorStop(0.6, '#e8f5e9')
    sky.addColorStop(1, '#a5d6a7')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Sun glow
    const sunX = canvas.width * 0.75
    const sunY = canvas.height * 0.15
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 100)
    sunGlow.addColorStop(0, 'rgba(255,250,200,0.6)')
    sunGlow.addColorStop(1, 'rgba(255,230,100,0)')
    ctx.fillStyle = sunGlow
    ctx.beginPath()
    ctx.arc(sunX, sunY, 100, 0, Math.PI * 2)
    ctx.fill()

    // Sun core
    ctx.fillStyle = '#fff9c4'
    ctx.beginPath()
    ctx.arc(sunX, sunY, 22, 0, Math.PI * 2)
    ctx.fill()

    // Ground
    const ground = ctx.createLinearGradient(0, canvas.height * 0.82, 0, canvas.height)
    ground.addColorStop(0, '#81c784')
    ground.addColorStop(1, '#4caf50')
    ctx.fillStyle = ground
    ctx.fillRect(0, canvas.height * 0.82, canvas.width, canvas.height * 0.18)

    // Petals
    petals.forEach(petal => {
      petal.y += petal.speedY
      petal.x += petal.speedX
      petal.rotation += petal.rotationSpeed
      if (petal.y > canvas.height + 10) {
        petal.y = -10
        petal.x = Math.random() * canvas.width
      }

      ctx.save()
      ctx.translate(petal.x, petal.y)
      ctx.rotate(petal.rotation)
      ctx.globalAlpha = petal.opacity
      ctx.fillStyle = '#f48fb1'
      ctx.beginPath()
      ctx.ellipse(0, 0, petal.size, petal.size * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    ctx.globalAlpha = 1
    animationId = requestAnimationFrame(draw)
  }

  draw()
}

export function destroy() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}
```

- [ ] **Step 5: Create src/scenes/river-flow.js**

```js
let animationId = null

export function init(canvas) {
  const ctx = canvas.getContext('2d')
  let waveOffset = 0

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5)
    sky.addColorStop(0, '#b3d9f5')
    sky.addColorStop(1, '#7ec8e3')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5)

    // Mountains
    const mountains = [
      { points: [[0, 0.55], [0.2, 0.3], [0.4, 0.55]], color: 'rgba(30,60,90,0.5)' },
      { points: [[0.25, 0.55], [0.5, 0.22], [0.75, 0.55]], color: 'rgba(20,50,80,0.6)' },
      { points: [[0.55, 0.55], [0.78, 0.32], [1, 0.55]], color: 'rgba(30,60,90,0.5)' },
    ]
    mountains.forEach(({ points, color }) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(points[0][0] * canvas.width, points[0][1] * canvas.height)
      points.forEach(([x, y]) => ctx.lineTo(x * canvas.width, y * canvas.height))
      ctx.lineTo(canvas.width, canvas.height * 0.56)
      ctx.lineTo(0, canvas.height * 0.56)
      ctx.fill()
    })

    // River
    const river = ctx.createLinearGradient(0, canvas.height * 0.55, 0, canvas.height)
    river.addColorStop(0, '#3a8fc4')
    river.addColorStop(1, '#1565c0')
    ctx.fillStyle = river
    ctx.fillRect(0, canvas.height * 0.55, canvas.width, canvas.height * 0.45)

    // Wave lines
    waveOffset += 0.5
    for (let i = 0; i < 5; i++) {
      const y = canvas.height * 0.6 + i * 18
      ctx.strokeStyle = `rgba(255,255,255,${0.08 - i * 0.01})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let x = 0; x <= canvas.width; x += 4) {
        const waveY = y + Math.sin((x + waveOffset + i * 30) * 0.03) * 4
        if (x === 0) ctx.moveTo(x, waveY)
        else ctx.lineTo(x, waveY)
      }
      ctx.stroke()
    }

    animationId = requestAnimationFrame(draw)
  }

  draw()
}

export function destroy() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}
```

- [ ] **Step 6: Create src/scenes/rain.js**

```js
let animationId = null

export function init(canvas) {
  const ctx = canvas.getContext('2d')
  const drops = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    length: Math.random() * 15 + 8,
    speed: Math.random() * 4 + 3,
    opacity: Math.random() * 0.3 + 0.1,
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Overcast sky
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
    sky.addColorStop(0, '#546e7a')
    sky.addColorStop(0.6, '#78909c')
    sky.addColorStop(1, '#90a4ae')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Ground
    const ground = ctx.createLinearGradient(0, canvas.height * 0.82, 0, canvas.height)
    ground.addColorStop(0, '#3e5258')
    ground.addColorStop(1, '#263238')
    ctx.fillStyle = ground
    ctx.fillRect(0, canvas.height * 0.82, canvas.width, canvas.height * 0.18)

    // Pavilion silhouette
    const px = canvas.width / 2
    const py = canvas.height * 0.72
    ctx.fillStyle = 'rgba(20,35,42,0.85)'
    ctx.beginPath()
    ctx.moveTo(px - 50, py)
    ctx.lineTo(px, py - 28)
    ctx.lineTo(px + 50, py)
    ctx.fill()
    ctx.fillRect(px - 4, py, 8, 30)

    // Rain drops
    drops.forEach(drop => {
      drop.y += drop.speed
      drop.x += drop.speed * 0.12
      if (drop.y > canvas.height) {
        drop.y = -drop.length
        drop.x = Math.random() * canvas.width
      }

      ctx.strokeStyle = `rgba(200,230,255,${drop.opacity})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(drop.x, drop.y)
      ctx.lineTo(drop.x + drop.length * 0.12, drop.y + drop.length)
      ctx.stroke()
    })

    animationId = requestAnimationFrame(draw)
  }

  draw()
}

export function destroy() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}
```

- [ ] **Step 7: Create src/scenes/autumn.js**

```js
let animationId = null

export function init(canvas) {
  const ctx = canvas.getContext('2d')
  const leafColors = ['#e65100', '#bf360c', '#f57f17', '#ff8f00', '#d84315']
  const leaves = Array.from({ length: 35 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 10 + 6,
    speedY: Math.random() * 1.2 + 0.4,
    speedX: Math.random() * 1.2 - 0.6,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.06,
    color: leafColors[Math.floor(Math.random() * leafColors.length)],
    opacity: Math.random() * 0.5 + 0.5,
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
    sky.addColorStop(0, '#bf8040')
    sky.addColorStop(0.5, '#d4903a')
    sky.addColorStop(1, '#8b4513')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Ground
    ctx.fillStyle = '#4a2510'
    ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15)

    // Tree branch (right side)
    ctx.strokeStyle = 'rgba(40,20,5,0.8)'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.85, 0)
    ctx.quadraticCurveTo(canvas.width * 0.8, canvas.height * 0.3, canvas.width * 0.7, canvas.height * 0.45)
    ctx.stroke()
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(canvas.width * 0.78, canvas.height * 0.2)
    ctx.quadraticCurveTo(canvas.width * 0.65, canvas.height * 0.25, canvas.width * 0.6, canvas.height * 0.35)
    ctx.stroke()

    // Leaves
    leaves.forEach(leaf => {
      leaf.y += leaf.speedY
      leaf.x += leaf.speedX + Math.sin(leaf.y * 0.02) * 0.5
      leaf.rotation += leaf.rotationSpeed
      if (leaf.y > canvas.height + 10) {
        leaf.y = -10
        leaf.x = Math.random() * canvas.width
      }

      ctx.save()
      ctx.translate(leaf.x, leaf.y)
      ctx.rotate(leaf.rotation)
      ctx.globalAlpha = leaf.opacity
      ctx.fillStyle = leaf.color
      ctx.beginPath()
      ctx.ellipse(0, 0, leaf.size, leaf.size * 0.55, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    ctx.globalAlpha = 1
    animationId = requestAnimationFrame(draw)
  }

  draw()
}

export function destroy() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}
```

- [ ] **Step 8: Run tests to verify they pass**

```bash
npx vitest run tests/scenes/scene-interface.test.js
```

Expected: PASS (10 tests)

- [ ] **Step 9: Commit**

```bash
git add src/scenes/ tests/scenes/
git commit -m "feat: add five Canvas scene animation modules"
```

---

## Task 8: SceneCanvas Component

**Files:**
- Create: `src/components/SceneCanvas.vue`
- Create: `tests/components/SceneCanvas.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/components/SceneCanvas.test.js`:

```js
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SceneCanvas from '../../src/components/SceneCanvas.vue'

vi.mock('../../src/scenes/moonlit-night.js', () => ({
  init: vi.fn(),
  destroy: vi.fn(),
}))

describe('SceneCanvas', () => {
  it('renders a canvas element', () => {
    const wrapper = mount(SceneCanvas, { props: { scene: 'moonlit-night' } })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('calls scene init on mount', async () => {
    const { init } = await import('../../src/scenes/moonlit-night.js')
    mount(SceneCanvas, { props: { scene: 'moonlit-night' } })
    await new Promise(r => setTimeout(r, 50))
    expect(init).toHaveBeenCalled()
  })

  it('calls destroy on unmount', async () => {
    const { destroy } = await import('../../src/scenes/moonlit-night.js')
    const wrapper = mount(SceneCanvas, { props: { scene: 'moonlit-night' } })
    await new Promise(r => setTimeout(r, 50))
    wrapper.unmount()
    expect(destroy).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/SceneCanvas.test.js
```

Expected: FAIL

- [ ] **Step 3: Implement SceneCanvas**

Create `src/components/SceneCanvas.vue`:

```vue
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/components/SceneCanvas.test.js
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/SceneCanvas.vue tests/components/SceneCanvas.test.js
git commit -m "feat: add SceneCanvas component with dynamic scene loading"
```

---

## Task 9: PoemReader Component

**Files:**
- Create: `src/components/PoemReader.vue`
- Create: `tests/components/PoemReader.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/components/PoemReader.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PoemReader from '../../src/components/PoemReader.vue'

const lines = ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡']

describe('PoemReader', () => {
  it('renders all poem lines', () => {
    const wrapper = mount(PoemReader, { props: { lines, delay: 0 } })
    lines.forEach(line => {
      expect(wrapper.text()).toContain(line)
    })
  })

  it('renders correct number of line elements', () => {
    const wrapper = mount(PoemReader, { props: { lines, delay: 0 } })
    expect(wrapper.findAll('.poem-line').length).toBe(4)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/PoemReader.test.js
```

Expected: FAIL

- [ ] **Step 3: Implement PoemReader**

Create `src/components/PoemReader.vue`:

```vue
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/components/PoemReader.test.js
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/PoemReader.vue tests/components/PoemReader.test.js
git commit -m "feat: add PoemReader with staggered fade-in animation"
```

---

## Task 10: PoetCard Component

**Files:**
- Create: `src/components/PoetCard.vue`
- Create: `tests/components/PoetCard.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/components/PoetCard.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PoetCard from '../../src/components/PoetCard.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/poet/:id', component: { template: '<div/>' } }],
})

const poet = {
  id: 'li-bai',
  name: '李白',
  dynasty: '唐',
  style: '浪漫主义',
  bio: '字太白，号青莲居士。',
  avatar: '/images/poets/li-bai.png',
}

describe('PoetCard', () => {
  it('displays poet name', async () => {
    const wrapper = mount(PoetCard, { props: { poet }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('李白')
  })

  it('displays dynasty and style', async () => {
    const wrapper = mount(PoetCard, { props: { poet }, global: { plugins: [router] } })
    expect(wrapper.text()).toContain('唐')
    expect(wrapper.text()).toContain('浪漫主义')
  })

  it('links to poet detail page', async () => {
    const wrapper = mount(PoetCard, { props: { poet }, global: { plugins: [router] } })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/poet/li-bai')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/PoetCard.test.js
```

Expected: FAIL

- [ ] **Step 3: Implement PoetCard**

Create `src/components/PoetCard.vue`:

```vue
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/components/PoetCard.test.js
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/PoetCard.vue tests/components/PoetCard.test.js
git commit -m "feat: add PoetCard component with avatar fallback"
```

---

## Task 11: HomeView

**Files:**
- Modify: `src/views/HomeView.vue`
- Create: `tests/views/HomeView.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/views/HomeView.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomeView from '../../src/views/HomeView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/poem/:id', component: { template: '<div/>' } },
  ],
})

describe('HomeView', () => {
  it('renders poem cards', async () => {
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    await new Promise(r => setTimeout(r, 10))
    expect(wrapper.findAll('.poem-card').length).toBeGreaterThan(0)
  })

  it('renders search bar', () => {
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('filters poems by search query', async () => {
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    await wrapper.find('input').setValue('李白')
    const cards = wrapper.findAll('.poem-card')
    expect(cards.length).toBeGreaterThan(0)
    cards.forEach(card => {
      expect(card.text()).toContain('李白')
    })
  })

  it('filters poems by category', async () => {
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    const tabs = wrapper.findAll('.tab')
    const modernTab = tabs.find(t => t.text() === '现代诗')
    await modernTab.trigger('click')
    await new Promise(r => setTimeout(r, 10))
    const cards = wrapper.findAll('.poem-card')
    cards.forEach(card => {
      expect(card.text()).toContain('现代')
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/views/HomeView.test.js
```

Expected: FAIL

- [ ] **Step 3: Implement HomeView**

Replace `src/views/HomeView.vue`:

```vue
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

const categoryTypeMap = {
  all: null,
  tang: 'classical',
  song: 'classical',
  modern: 'modern',
}

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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/views/HomeView.test.js
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/views/HomeView.vue tests/views/HomeView.test.js
git commit -m "feat: implement HomeView with search and category filter"
```

---

## Task 12: PoemView

**Files:**
- Modify: `src/views/PoemView.vue`
- Create: `tests/views/PoemView.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/views/PoemView.test.js`:

```js
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PoemView from '../../src/views/PoemView.vue'

vi.mock('../../src/components/SceneCanvas.vue', () => ({
  default: { template: '<canvas />', props: ['scene'] },
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/poem/:id', component: PoemView },
    { path: '/poet/:id', component: { template: '<div/>' } },
  ],
})

describe('PoemView', () => {
  it('displays poem title', async () => {
    await router.push('/poem/jingye-si')
    const wrapper = mount(PoemView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('静夜思')
  })

  it('shows 404 message for unknown poem', async () => {
    await router.push('/poem/nonexistent-poem')
    const wrapper = mount(PoemView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('未找到')
  })

  it('displays poem lines', async () => {
    await router.push('/poem/jingye-si')
    const wrapper = mount(PoemView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('床前明月光')
  })

  it('displays translation section', async () => {
    await router.push('/poem/jingye-si')
    const wrapper = mount(PoemView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('白话')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/views/PoemView.test.js
```

Expected: FAIL

- [ ] **Step 3: Implement PoemView**

Replace `src/views/PoemView.vue`:

```vue
<template>
  <div class="poem-view" v-if="poem">
    <!-- Full-screen scene -->
    <SceneCanvas :scene="poem.scene" />

    <!-- Nav overlay -->
    <nav class="poem-nav">
      <RouterLink to="/" class="back-link">← 返回</RouterLink>
      <span class="poem-nav-title">{{ poem.title }}</span>
    </nav>

    <!-- Poem reader centered -->
    <div class="poem-stage">
      <PoemReader :lines="poem.lines" :delay="900" />
      <p class="poem-author">—— {{ poem.author }}《{{ poem.title }}》</p>
      <button class="scroll-hint" @click="scrollToAnalysis">
        向下探索 ↓
      </button>
    </div>

    <!-- Analysis section -->
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/views/PoemView.test.js
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/views/PoemView.vue tests/views/PoemView.test.js
git commit -m "feat: implement PoemView with full-screen scene and analysis"
```

---

## Task 13: PoetView

**Files:**
- Modify: `src/views/PoetView.vue`
- Create: `tests/views/PoetView.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/views/PoetView.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PoetView from '../../src/views/PoetView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/poet/:id', component: PoetView },
    { path: '/poem/:id', component: { template: '<div/>' } },
  ],
})

describe('PoetView', () => {
  it('displays poet name', async () => {
    await router.push('/poet/li-bai')
    const wrapper = mount(PoetView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('李白')
  })

  it('displays poet bio', async () => {
    await router.push('/poet/li-bai')
    const wrapper = mount(PoetView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('浪漫主义')
  })

  it('displays poems by this poet', async () => {
    await router.push('/poet/li-bai')
    const wrapper = mount(PoetView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.findAll('.poem-card').length).toBeGreaterThan(0)
  })

  it('shows 404 for unknown poet', async () => {
    await router.push('/poet/unknown-poet')
    const wrapper = mount(PoetView, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.text()).toContain('未找到')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/views/PoetView.test.js
```

Expected: FAIL

- [ ] **Step 3: Implement PoetView**

Replace `src/views/PoetView.vue`:

```vue
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/views/PoetView.test.js
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/views/PoetView.vue tests/views/PoetView.test.js
git commit -m "feat: implement PoetView with bio and poem list"
```

---

## Task 14: Global Styles and Full Test Run

**Files:**
- Modify: `src/main.js` (add global CSS import)
- Create: `src/style.css`

- [ ] **Step 1: Create src/style.css**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #1a1a1a;
  background: #fafaf7;
}
```

- [ ] **Step 2: Import styles in src/main.js**

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './style.css'

createApp(App).use(router).mount('#app')
```

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```

Expected: All tests PASS. Note the count — it should be 20+ tests across components, views, and scenes.

- [ ] **Step 4: Start dev server and verify manually**

```bash
npm run dev
```

Open http://localhost:5173 and verify:
- Homepage shows poem cards in a grid
- Search filters poems correctly
- Category tabs filter by type
- Clicking a poem card navigates to detail page
- Detail page shows full-screen animation and poem text
- Clicking "向下探索" scrolls to analysis section
- Analysis section shows translation and line-by-line explanation
- PoetCard at bottom links to poet page
- Poet page shows bio and poem list
- Clicking a poem on poet page navigates to poem detail

- [ ] **Step 5: Commit**

```bash
git add src/style.css src/main.js
git commit -m "feat: add global styles and complete implementation"
```

---

## Task 15: Deployment Config

**Files:**
- Create: `vercel.json`
- Modify: `vite.config.js`

- [ ] **Step 1: Create vercel.json for SPA routing**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
npm run build
```

Expected: `dist/` directory created with no errors.

- [ ] **Step 3: Commit and push**

```bash
git add vercel.json
git commit -m "feat: add Vercel deployment config for SPA routing"
```

To deploy: push to GitHub, then import repo in https://vercel.com — zero config needed.

---

## Self-Review

**Spec coverage check:**

| Spec Requirement | Covered By |
|---|---|
| 现代简约风（浅色首页） | HomeView, PoetView styles |
| 古典 + 现代诗词 | poems.json (6 poems, classical + modern) |
| 普通大众定向 | Simple UI, Chinese labels, clear navigation |
| 意境场景动画 | Tasks 7+8 (5 scene modules + SceneCanvas) |
| 全屏沉浸式详情页 | Task 12 (PoemView with fixed Canvas) |
| 卡片式浏览首页 | Task 11 (HomeView with grid) |
| 搜索功能 | SearchBar + HomeView filter |
| 分类标签 | SearchBar tabs + HomeView filter |
| 诗人页 | Task 13 (PoetView) |
| 错误处理：404跳转首页 | PoemView/PoetView "未找到" states |
| 错误处理：场景降级 | SceneCanvas dynamic import (silent fail) |
| 错误处理：头像降级 | PoetCard + PoetView onAvatarError |
| 部署配置 | Task 15 (vercel.json) |

All requirements covered. No placeholders found. Types and method names are consistent across tasks.
