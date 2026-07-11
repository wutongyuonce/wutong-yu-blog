# Insights 模块更新说明

本文档说明 **当前项目中 Insights 模块的最终组织方式、文件职责、调用链路与维护方式**。

## 1. 模块目标

`Insights` 是站点中的一个新内容模块，用于存放语录、启发、哲理以及值得反复回看的片段。

当前实现目标包括：

1. 在顶部导航增加 `Insights` 入口。
2. 新增独立页面 `/insights/`。
3. 内容按年份分组展示。
4. 每个年份可展开或收起。
5. 每条 Insight 采用左文右图的时间线节点形式展示。
6. 长文本默认截断，点击后可展开完整内容。

## 2. 当前组织方式

Insights 模块遵循项目现有的内容组织模式：

```text
src/content/insights/*.md        提供原始内容
          ↓
src/content.config.ts            注册 insights collection
          ↓
src/content/schema.ts            校验 insight frontmatter
          ↓
src/utils/data.ts                过滤、排序、按年份分组
          ↓
src/pages/insights.mdx           定义页面入口与布局
          ↓
src/components/views/InsightsView.astro
                                 负责时间线渲染与交互
          ↓
BaseLayout + StandardLayout      输出最终页面结构
```

这意味着它不是“页面里直接写死数据”的实现，而是正式进入了项目的 `astro:content` 内容链路。

## 3. 新增代码总览

本次新增的 Insights 相关代码如下：

| 文件 | 作用 |
| :-- | :-- |
| `src/config.ts` | 在顶部导航增加 `Insights` 入口 |
| `src/content.config.ts` | 注册 `insights` collection |
| `src/content/schema.ts` | 新增 `insightSchema`，约束 Insight 内容结构 |
| `src/utils/data.ts` | 新增 Insights 数据处理函数 |
| `src/pages/insights.mdx` | `/insights/` 页面入口 |
| `src/components/views/InsightsView.astro` | 渲染 Insights 时间线页面 |
| `src/content/insights/**/*.md` | 存放每条 Insight 的内容文件 |

下面按文件说明。

## 4. 各文件作用与内容

### 4.1 `src/config.ts`

作用：

- 在站点顶部导航中加入 `Insights`

当前新增的是 `UI.internalNavs` 中的一项：

```ts
{
  path: '/insights',
  title: 'Insights',
  displayMode: 'alwaysText',
  text: 'Insights',
}
```

这使得 `NavBar.astro` 在渲染导航时，会自动把 `Insights` 显示到顶部导航栏中。

### 4.2 `src/content.config.ts`

作用：

- 把 `src/content/insights/**/*.md(x)` 接入 Astro 内容系统

当前新增内容集合：

```ts
const insights = defineCollection({
  loader: glob({ base: './src/content/insights', pattern: '**/*.{md,mdx}' }),
  schema: insightSchema,
})
```

它的意义是：

- `src/content/insights/` 下的 Markdown 文件会被识别成 `insights` collection
- 每篇 Insight 都会经过 schema 校验
- 页面和视图层可以通过 `astro:content` 正式读取它们

### 4.3 `src/content/schema.ts`

作用：

- 定义 Insight 内容的 frontmatter 结构

当前新增 `insightSchema`，主要字段如下：

- `title`：Insight 标题
- `description`：简短描述
- `pubDate`：记录日期
- `category`：分类标签
- `image`：右侧图片路径，可选
- `imageAlt`：图片替代文本，可选
- `author`：语录或观点作者，可选
- `sourceUrl`：来源链接，可选
- `draft`：是否为草稿

这个文件解决的问题是：

- 防止内容字段缺失或写错
- 保证页面读取到的数据结构稳定
- 让后续新增内容时有统一规范

### 4.4 `src/utils/data.ts`

作用：

- 提供 Insights 的数据整理逻辑

本次新增了 3 个主要函数：

- `getFilteredInsights('insights')`
  - 从 `astro:content` 读取 Insights
  - 在生产环境过滤 `draft: true`
- `getSortedInsights()`
  - 按 `pubDate` 倒序排序
- `getGroupedInsightsByYear()`
  - 把所有 Insight 按年份分组，返回时间线页面可直接使用的数据结构

它的职责不是渲染 UI，而是把“原始内容条目”整理成“页面真正需要的数据结构”。

### 4.5 `src/pages/insights.mdx`

作用：

- 定义 `/insights/` 页面的路由入口
- 提供页面级 frontmatter
- 使用项目统一布局挂载 Insights 视图
- 为页面指定 `snow` 背景主题

它的职责和 `projects.mdx`、`blogs/index.mdx` 一致，属于页面壳层，不负责具体的数据处理和时间线渲染。

当前页面结构是：

```text
BaseLayout
  ↓
StandardLayout
  ↓
自定义 article 容器
  ↓
InsightsView
```

其中：

- `Insights` 页面在 `StandardLayout` 内部使用自定义 `article` 容器单独放宽正文区域
- 页面标题区域使用 `StandardLayout` 的居中布局
- 页面级 `frontmatter` 当前使用 `bgType: snow`，进入 `/insights/` 时会加载飘雪背景
- 桌面端主内容区域会占据更宽的阅读区，便于时间线与左右内容并排展开
- 页面底部的 `cd ..` 返回链接由 `BaseLayout` 为 `/insights` 单独放宽容器宽度，使其与年份起始线对齐

### 4.6 `src/components/views/InsightsView.astro`

作用：

- 读取 `getGroupedInsightsByYear('insights')` 返回的数据
- 对每条 Insight 执行 `render(item.entry)`，生成正文内容
- 生成长文本预览
- 渲染完整的时间线页面

它负责的页面行为包括：

- 按年份输出时间线分组
- 每个年份使用独立的状态控件控制对应时间线列表的展开/收起
- 年份标题采用与 `/projects` 分类标题一致的描边大字风格
- 年份标题和记录统计使用独立头部块显示
- 展开/收起控件独立于年份头部，只负责控制对应年份下的时间线列表
- 折叠状态由视图内部的原生表单状态和 CSS 驱动，不依赖额外脚本绑定
- 展开/收起控件位于年份模块右下侧，更贴近下方时间线内容区
- 年份头部与时间线列表之间使用独立的内容区块和留白分隔
- 每条 Insight 采用左文右图布局
- 图片可选，不提供图片时自动切换为单列文本布局
- 无图时文字区域会保持接近有图时的阅读宽度与排版节奏
- 节点标题使用手写字体
- 标题字号相对正文更克制，避免压过正文阅读
- 作者与来源行的字号提升到接近正文，作为引用出处信息更自然
- 标题下方显示引用出处信息
- 文字过长时显示截断预览，当前默认截断阈值为 200 字
- 点击“展开全文”后渲染完整 Markdown 正文

它是 Insights 模块的核心视图文件。

### 4.7 `src/content/insights/年份/*.md`

作用：

- 存放每条 Insight 的真实内容

当前每条 Insight 都是一篇独立的 Markdown 文件，适合长期维护和持续扩展。
- 图片是可选项，不提供图片时仍可正常显示该条 Insight。

示例文件：

- `src/content/insights/2026/2026-04-03-action-before-feeling.md`

示例内容结构：

```md
---
title: 先行动，后感受
description: 关于行动、情绪与启动惯性的记录
pubDate: 2026-04-03
category: Habit
image: /og-images/blogs.png
imageAlt: Insight visual inspired by momentum and movement.
author: 未知
sourceUrl: ''
draft: false
---

人们说等我有动力了就去锻炼……
```

这类内容文件是 Insights 模块最核心的维护对象。

## 5. 整体模块链路

### 5.1 内容进入系统的链路

```text
src/content/insights/**/*.md
        ↓
content.config.ts 注册为 insights collection
        ↓
schema.ts 中的 insightSchema 校验 frontmatter
        ↓
astro:content 提供结构化 entry
```

### 5.2 页面渲染链路

```text
src/pages/insights.mdx
        ↓
InsightsView.astro
        ↓
getGroupedInsightsByYear('insights')
        ↓
getFilteredInsights() + getSortedInsights()
        ↓
render(item.entry)
        ↓
输出按年份分组的时间线页面
```

### 5.3 导航进入链路

```text
src/config.ts
        ↓
UI.internalNavs 新增 /insights
        ↓
NavBar.astro
        ↓
顶部导航显示 Insights
```

## 6. 页面最终表现

当前 `Insights` 页面具备以下展示特征：

- 顶部导航可以直接进入 `/insights/`
- 页面采用 `BaseLayout + StandardLayout`
- 桌面端正文区域更宽，时间线主体约占据页面更舒展的阅读宽度
- 内容主区域显示纵向时间线
- 时间线按年份分组
- 每个年份可折叠
- 年份标题样式与 `/projects` 中的分类标题保持一致，但使用独立排版避免裁切和重叠
- 年份标题下方不再额外显示分割线
- 年份头部始终显示，不会随折叠一起隐藏
- 年份头部和下方时间线内容在视觉上分成两个模块
- 每个节点默认采用左文右图布局
- 当节点没有图片时，会自动切换为单列文本布局
- 时间线节点不显示 `1. 2. 3.` 这类序号
- 每个节点标题使用手写字体
- 标题下方会以引用署名的形式显示出处
- 页面使用 `snow` 背景主题，浅色与深色模式下都会显示飘雪效果
- 提供图片时，图片直接嵌入页面视觉层，不走重卡片设计
- 长文字默认只显示预览，点击后展开完整正文
- 页面底部的 `cd ..` 返回链接与年份模块左边界对齐

## 7. 维护方式

### 7.1 新增一条 Insight

在 `src/content/insights/` 下新增一个 Markdown 文件即可，推荐按年份归档：

```text
src/content/insights/2026/2026-05-14-my-new-insight.md
```

建议至少包含这些 frontmatter：

```yaml
title: 我的新记录
description: 一句话描述
pubDate: 2026-05-14
category: Reflection
image: /og-images/index.png
imageAlt: image description
author: 作者名
sourceUrl: https://example.com
draft: false
```

正文直接写在 frontmatter 下方。

其中：

- `author` 可选，用于记录这条语录或观点的作者
- `sourceUrl` 可选，用于记录来源页面、原文链接或出处链接
- `image` 可选，用于在右侧展示配图
- `imageAlt` 可选，只有提供图片时才建议填写
- 如果暂时没有来源信息，可以写空字符串，或省略不写
- 如果不需要配图，可以省略 `image` 和 `imageAlt`

页面中的出处显示规则为：

- 同时有 `author` 和 `sourceUrl` 时，显示为 `— [author](sourceUrl)`
- 只有 `author` 时，显示为 `— author`
- 只有 `sourceUrl` 时，显示为 `— [来源](sourceUrl)`
- 页面中实际使用的是同等语义的 HTML 链接渲染，不是 Markdown 原文直接输出

新增后效果：

- 页面会自动读取该内容
- 会自动按日期参与排序
- 会自动归入对应年份
- 无需额外修改 `InsightsView.astro`

### 7.2 修改 Insights 页面样式

主要修改文件：

- `src/components/views/InsightsView.astro`

这个文件同时包含：

- 时间线结构
- 节点结构
- 折叠交互
- 页面样式

因此视觉调整基本都集中在这里完成。

### 7.3 修改内容字段规范

主要修改文件：

- `src/content/schema.ts`

如果未来想新增字段，例如：

- `author`
- `sourceUrl`

应先在 `insightSchema` 中补字段，再在内容文件中使用。

### 7.4 修改导航入口

主要修改文件：

- `src/config.ts`

导航文案、顺序、显示方式都由这里统一控制。

## 8. 当前模块特点

相比直接用一个 `ts` 文件保存数据，当前 Insights 模块有几个明显特点：

- 内容进入了项目统一的 `astro:content` 体系
- 每条 Insight 都有独立 Markdown 文件，更适合长期积累
- 页面壳、数据处理、视图渲染分层更清晰
- schema 可以约束内容格式，降低维护成本
- 作者和来源链接已经可以结构化存储
- 后续新增内容时，不需要修改页面逻辑

## 9. 一句话总结

当前 Insights 模块已经成为项目中的一条正式内容链路：

- `src/content/insights/*.md` 负责存内容
- `content.config.ts` 和 `schema.ts` 负责接入与校验
- `utils/data.ts` 负责过滤、排序、分组
- `src/pages/insights.mdx` 负责页面入口
- `InsightsView.astro` 负责最终时间线展示
