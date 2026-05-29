# BigData & AI Blog — 项目状态

## 项目概述

大数据开发 + AI 学习的技术博客/知识库网站。Astro 5 静态站点 + React 交互组件 + Tailwind CSS + Vercel 部署。

**仓库**: `ChanKaL0k/bigdata-ai-blog`  
**线上地址**: `https://bigdata-ai-blog.vercel.app`  
**本地路径**: `D:\bigdata-ai-blog`

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Astro 5.x（纯静态 SSG，`output: "static"`） |
| 样式 | Tailwind CSS 3.4（`darkMode: "class"`）+ CSS 变量做主题切换 |
| 交互 | React 19（`client:load` 水合） |
| 后端 | Vercel 原生 Node.js Serverless Functions（`api/` 根目录） |
| 存储 | Vercel KV (Upstash Redis) — 点赞数、阅读量 |
| 评论 | Giscus（GitHub Discussions 驱动） |
| 部署 | Vercel（GitHub push → 自动部署） |

## 目录结构

```
D:\bigdata-ai-blog\
├── astro.config.mjs          # Astro 配置（Tailwind + React + Sitemap）
├── tailwind.config.mjs
├── vercel.json               # Vercel 配置：build cmd + output dir
├── package.json              # "type": "module"
├── api/                      # Vercel 原生 Serverless Functions
│   ├── like.js               # 点赞 GET/POST/DELETE → Vercel KV
│   ├── test.js               # 简单健康检查
│   └── views/[slug].js       # 阅读量 GET/POST → Vercel KV
├── src/
│   ├── components/
│   │   ├── Header.astro      # 导航：博客、知识库、Spark UI Lab、学习路线
│   │   ├── Footer.astro
│   │   ├── ThemeToggle.tsx    # 暗色模式切换（localStorage + classList）
│   │   ├── LikeButton.tsx     # 首页点赞按钮（调用 /api/like）
│   │   ├── ViewCounter.tsx    # 文章阅读量（调用 /api/views/[slug]）
│   │   ├── Giscus.tsx         # 评论组件
│   │   └── spark-ui-lab/     # ★ Spark UI 模拟器组件（14 个文件）
│   │       ├── SparkLabShell.tsx         # 主容器（state 持有）
│   │       ├── SparkHeader.tsx           # 深色顶栏
│   │       ├── SparkTabNav.tsx           # 标签导航
│   │       ├── SparkSummaryMetrics.tsx   # 指标卡片
│   │       ├── ScenarioSelector.tsx      # 场景选择卡片
│   │       ├── SparkJobsTab.tsx
│   │       ├── SparkStagesTab.tsx        # 列表 + 点击进入详情
│   │       ├── SparkStageDetail.tsx      # Task 级表格
│   │       ├── SparkExecutorsTab.tsx
│   │       ├── SparkStorageTab.tsx
│   │       ├── SparkSQLTab.tsx           # SQL 查询计划
│   │       ├── SparkEnvironmentTab.tsx   # 配置项 + 标注
│   │       ├── SparkDataTable.tsx        # 通用表格（标注高亮支持）
│   │       └── SparkAnnotation.tsx       # 标注气泡
│   ├── data/spark-ui-lab/
│   │   ├── types.ts                        # TS 类型定义
│   │   ├── scenarios.ts                    # 场景注册表
│   │   ├── scenario-data-skew.ts           # 场景：数据倾斜
│   │   ├── scenario-slow-tasks.ts          # 场景：GC/慢任务
│   │   ├── scenario-oom.ts                 # 场景：OOM
│   │   ├── scenario-small-files.ts         # 场景：小文件
│   │   ├── scenario-shuffle-heavy.ts       # 场景：大量 Shuffle
│   │   └── index.ts
│   ├── content/
│   │   ├── config.ts          # Blog + KB 的 Zod schema 定义
│   │   ├── blog/              # 空目录（博客文章暂未创建）
│   │   └── kb/                # 9 篇知识库文章
│   │       ├── spark-core-architecture.md   (order: 1)
│   │       ├── spark-memory-management.md  (order: 2)
│   │       ├── spark-sql-catalyst.md       (order: 3)
│   │       ├── spark-tuning-best-practices.md (order: 4)
│   │       ├── spark-rdd-transformations.md (order: 5)
│   │       ├── spark-shuffle-guide.md      (order: 6)
│   │       ├── spark-small-files.md        (order: 7)
│   │       ├── flink-watermark-deep-dive.md (order: 1)
│   │       └── rag-from-scratch.md         (order: 1)
│   ├── pages/
│   │   ├── index.astro        # 首页：6 个主题卡片 + 最新 6 篇文章
│   │   ├── 404.astro
│   │   ├── roadmap.astro      # 学习路线
│   │   ├── search.astro        # 客户端搜索
│   │   ├── rss.xml.ts
│   │   ├── blog/
│   │   │   ├── index.astro     # 博客列表
│   │   │   └── [slug].astro    # 文章详情（含 ViewCounter + Giscus）
│   │   ├── kb/
│   │   │   ├── index.astro     # 知识库首页
│   │   │   ├── [topic].astro   # 主题文章列表
│   │   │   └── [topic]/[slug].astro  # 文章详情（含练习跳转卡片）
│   │   └── spark-ui-lab/
│   │       ├── index.astro     # Spark UI Lab 入口
│   │       └── [scenario].astro  # 5 个场景直链（SSG 预生成）
│   ├── layouts/
│   │   └── BaseLayout.astro    # 基础布局（Header + main + Footer + SEO）
│   └── styles/
│       ├── global.css          # Tailwind + CSS 变量（亮/暗）
│       └── spark-ui.css        # Spark UI 模拟器专属样式
```

## CSS 变量体系

站点使用 `var(--color-*)` 变量实现暗色模式切换：

| 变量 | 亮色 | 暗色 |
|---|---|---|
| `--color-bg` | `#ffffff` | `#0f172a` |
| `--color-bg-secondary` | `#f8fafc` | `#1e293b` |
| `--color-text` | `#0f172a` | `#e2e8f0` |
| `--color-text-secondary` | `#475569` | `#94a3b8` |
| `--color-border` | `#e2e8f0` | `#334155` |
| `--color-accent` | `#2563eb` | `#60a5fa` |

**注意**：Spark UI Lab 内部的 `.spark-ui-simulator` 使用独立的 `--spark-*` 变量（硬编码亮色），不受站点暗色模式影响。但 `.spark-ui-simulator` 外部的 UI（如 ScenarioSelector）已改为固定色值，确保在两个主题下都可读。

## 当前功能清单

| 功能 | 状态 | 说明 |
|---|---|---|
| 博客系统 | 已建（空） | 路由 `/blog`，无文章 |
| 知识库 | 完成 | 9 篇文章，6 个主题分区 |
| 暗色模式 | 完成 | localStorage + class 切换 |
| 搜索 | 完成 | 客户端实时筛选 |
| 学习路线 | 完成 | 7 阶段时间线 |
| RSS | 完成 | blog 为空时有警告 |
| 点赞 | 完成 | Vercel KV 持久化，`/api/like` |
| 阅读量 | 完成 | Vercel KV 持久化，`/api/views/[slug]` |
| Giscus 评论 | 完成 | 仓库 `ChanKaL0k/bigdata-ai-blog`，category: Announcements |
| **Spark UI Lab** | **完成** | **5 个故障场景，6 个标签页，标注系统** |

## Spark UI Lab 详解

### 路由
- `/spark-ui-lab` — 入口
- `/spark-ui-lab/data-skew` — 数据倾斜
- `/spark-ui-lab/slow-tasks` — GC 耗时/慢任务
- `/spark-ui-lab/oom` — Executor OOM
- `/spark-ui-lab/small-files` — 小文件
- `/spark-ui-lab/shuffle-heavy` — 大量 Shuffle

### 架构
- 所有状态在 `SparkLabShell` 的 `useState` 中（`scenarioId`, `activeTab`, `showAnnotations`, `selectedStageId`）
- 场景数据为纯 TypeScript 常量，零 API 调用
- 标注系统通过 `AnnotationDef[]` 定位到具体行/单元格，支持 inline/right/bottom 三种位置
- 标注默认开启，可切换

### 文章关联跳转
5 篇 Spark 知识库文章底部有"在 Spark UI Lab 中练习诊断"卡片：
- `spark-shuffle-guide` → data-skew + shuffle-heavy
- `spark-tuning-best-practices` → data-skew + oom
- `spark-core-architecture` → slow-tasks
- `spark-memory-management` → oom + slow-tasks
- `spark-small-files` → small-files

## 后端 API

### `api/like.js`
- GET → 返回当前点赞数
- POST → +1
- DELETE → -1（有负数保护：count <= 0 时不再减）

### `api/views/[slug].js`
- GET → 查询阅读量
- POST → +1 并返回新值

KV 环境变量由 Vercel 自动注入：`KV_REST_API_URL`, `KV_REST_API_TOKEN`

## 踩过的坑

1. **Astro API 路由不可用**：`src/pages/api/` 的 API 路由在 Vercel 上持续崩溃（FUNCTION_INVOCATION_FAILED）。最终改用项目根目录 `api/` 的 Vercel 原生 Serverless Functions，配合 `vercel.json` 中 `"framework": null` 禁用框架自动检测。

2. **`@vercel/kv` 包打包问题**：`import.meta.env` 在构建时被 Vite 替换为空值。改用 `process.env` + 直接调用 KV REST API 的 `fetch`。

3. **Astro frontmatter 中 `<` 被解析为 JSX**：在 `.astro` 文件的 frontmatter 中不能使用 TypeScript 泛型（`Record<string, ...>`），会被 esbuild 当作 JSX 标签报错。

4. **Dark mode 下组件文字不可读**：`.spark-ui-simulator` 外部的 UI 使用 `var(--color-*)` 会被暗色模式影响。ScenarioSelector 已改为固定色值。

## 日常操作

### 新建知识库文章
1. 在 `src/content/kb/` 创建 `.md` 文件，填写 frontmatter：
```yaml
---
title: "标题"
description: "摘要"
date: 2026-05-30
tags: [spark, ...]
topic: spark
order: 7
---
```
2. 如果文章对应 Spark UI Lab 场景，在 `src/pages/kb/[topic]/[slug].astro` 的 `practiceLinks` 中添加条目
3. `git add -A && git commit -m "新文章: xxx" && git push`
