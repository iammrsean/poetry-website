# 诗词天地

## 基本信息
- 线上地址：https://poetry-website-two.vercel.app
- GitHub：https://github.com/iammrsean/poetry-website
- 本地路径：/Users/sean/Documents/poetry-website

## 技术栈
- Vue 3 + Vite，纯静态网站，无后端、无数据库
- Vue Router 4（三个页面：首页 / 诗词详情 / 诗人页）
- Canvas API 做意境动画背景
- 部署在 Vercel（免费套餐）

## 项目结构
- `src/data/poems.json` — 所有诗词内容（加新诗在这里改）
- `src/data/poets.json` — 所有诗人信息
- `src/scenes/` — 五个 Canvas 动画场景（moonlit-night / spring-morning / river-flow / rain / autumn）
- `src/components/` — NavBar / SearchBar / PoemCard / PoetCard / SceneCanvas / PoemReader
- `src/views/` — HomeView / PoemView / PoetView

## 常用命令
```bash
npm run dev      # 本地预览 http://localhost:5173
npm run build    # 打包构建
npm test         # 运行测试
```

## 部署流程
```bash
git add -A
git commit -m "说明改了什么"
git push
vercel --prod
```

## 设计风格
- 首页和诗人页：现代简约浅色（白底大留白）
- 诗词详情页：深色沉浸式 + Canvas 意境动画
- 字体：衬线体（serif）为主，强调古典感
