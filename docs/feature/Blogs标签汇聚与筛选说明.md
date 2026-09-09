# Blogs 标签汇聚与筛选说明

本文档以当前代码为准，说明 `/blogs/` 标签汇聚、多标签筛选、响应式布局和后续维护方式。最初设计、实现讨论与验收记录见 [Issue #19](https://github.com/wutongyuonce/wutong-yu-blog/issues/19)。

## 1. 用户可见行为

- 页面汇总当前列表中所有 Blog 的标签，并显示每个标签对应的文章数。
- 点击标签立即改变选中样式，约 `140ms` 后刷新文章列表。
- 可同时选择多个标签；文章必须包含全部已选标签才会显示，即 AND 语义。
- 取消标签或点击 `Clear` 后重新计算结果；无选择时显示全部文章。
- 没有匹配文章时隐藏所有年份标题，显示空状态和清空入口。
- 年份分组仍按原顺序保留，只隐藏没有可见文章的年份。
- 筛选状态不写入 URL 或 localStorage，离开页面后不会持久化。

## 2. 数据来源与计算规则

标签面板不维护独立配置，数据来自与文章列表相同的 `getGroupedPostsByYear('blogs')` 结果：

```text
src/content/blogs/**/*.md(x) frontmatter.tags
        ↓
getFilteredPosts('blogs')
        ↓
getSortedPosts() + getGroupedPostsByYear()
        ↓
normalizePostTags() + buildTagSummary()
        ↓
TagFilter.astro + ListItem.astro
```

生产构建会先排除 draft，因此生产环境的标签计数只统计实际展示的文章。开发环境会与当前开发列表保持一致。

计算规则：

1. 每篇文章的标签先执行 `trim()`。
2. 空字符串被忽略。
3. 同一篇文章内的重复标签只计数一次。
4. 标签身份保持大小写敏感。
5. 标签按文章数降序排列；计数相同时使用中文 locale 稳定排序。
6. 可见标签名最多保留 12 个 Unicode code point，完整值仍用于筛选、`title` 和无障碍名称。

## 3. 客户端筛选机制

`ListView.astro` 在构建阶段输出全部文章，并把每篇文章的规范化标签序列化到 `data-tags`。浏览器端不重新请求数据，也不重新创建列表节点。

客户端初始化后缓存：

- 标签按钮
- 文章节点与标签数组
- 年份分组节点
- 当前 `Set<string>` 选择集合
- 防抖 timer、操作 revision 和当前 Web Animation

筛选条件为：

```text
selectedTags 为空 -> 全部文章匹配
selectedTags 非空 -> selectedTags 中每个标签都存在于 postTags
```

一次选择变化的流程：

```text
点击标签
  → 立即更新 aria-pressed、颜色和已选数量
  → 取消旧 timer / animation
  → 140ms trailing debounce
  → 列表淡出 90ms
  → 批量切换文章和年份的 hidden
  → 列表淡入 140ms
  → 更新 aria-live 结果数
```

revision 用于拒绝旧选择快照，避免快速连续点击后旧结果覆盖新结果。`prefers-reduced-motion: reduce` 下跳过淡入淡出，只执行防抖后的原子更新。

项目启用了 Astro `ClientRouter`。初始化同时在脚本执行时和 `astro:page-load` 后运行，并通过 `data-initialized` 防止重复绑定。

## 4. 响应式布局

### 4.1 宽屏

`ListView.astro` 使用对称三列网格：

```css
grid-template-columns:
  minmax(14rem, 18rem)
  65ch
  minmax(14rem, 18rem);
```

- 标签面板位于左列。
- 文章位于固定 `65ch` 的中列。
- 右列作为对称留白，保证文章列与页面标题保持同一中心线和左边缘。
- 标签面板用 `margin-top: -9.3125rem` 与 `Blogs` 标题顶部对齐。
- 标签面板使用普通文档流，不使用 sticky/fixed；页面向下滚动时会随内容移出视口。

### 4.2 窄屏

外层使用 container query，在 Blog 容器宽度不超过 `76rem` 时切换为单列：

```text
Blogs
Record my Trajectory
标签面板
年份标题
文章列表
```

窄屏会把标签面板的负上边距恢复为 `0`。布局不依赖 JavaScript 监听窗口宽度，也不会绝对定位，因此不会与年份标题重叠。

标签按钮区域使用 `flex-wrap` 自动换行。当前紧凑参数为：

- 最小宽度：`3.75rem`
- 最小高度：`2.05rem`
- 圆角：`0.35rem`
- 标签间距：`0.35rem`
- 标签文字：`0.8125rem`
- 右下角计数：`0.5625rem`

## 5. 主题与可访问性

- Light 与 Dark 分别定义默认背景、边框、hover、选中背景和反相文字 token。
- 标签使用原生 `<button type="button">`，键盘可通过 Tab、Space 和 Enter 操作。
- `aria-pressed` 是选中状态的语义来源。
- 完整标签与文章数进入按钮的无障碍名称。
- 筛选结果通过 `aria-live="polite"` 汇报。
- 全站 `:focus-visible` 样式继续负责键盘焦点提示。

## 6. 文件职责

| 文件 | 职责 |
| :-- | :-- |
| `src/pages/blogs/index.mdx` | Blogs 路由入口；不再用 `.prose` 限制整个默认 slot |
| `src/components/views/ListView.astro` | 获取年份分组、生成标签摘要、输出响应式布局并管理客户端筛选 |
| `src/components/views/TagFilter.astro` | 输出标签按钮、计数、Clear 和明暗主题样式 |
| `src/components/views/ListItem.astro` | 输出单篇文章标题、日期、阅读时长和标签文本 |
| `src/utils/blog-tag-filter.js` | 标签规范化、汇总、AND 匹配与 Unicode 截断纯函数 |
| `test/blog-tag-filter.test.mjs` | 使用 Node 内置测试验证标签纯逻辑 |
| `src/content/blogs/**/*.md(x)` | 唯一标签内容源，由每篇文章 frontmatter 维护 |

## 7. 本次标签收敛

本功能实现期间按内容主题收敛了以下文章的标签：

| Blog | 当前标签 |
| :-- | :-- |
| 本机 Homebrew 工具笔记 | `macOS` |
| 前后端鉴权方案 | `鉴权` |
| Astro Notes | `Astro` |
| 创建 Agent Skill 的最佳实践 | `Skill` |
| MCP（Model Context Protocol） | `MCP` |
| Prompt Caching 的工程策略 | `Prompt Caching`、`KV Cache` |
| Agent 开发习惯 | `Agent` |
| 从零写 CLI | `CLI` |
| Claude Code 记忆系统笔记 | `Claude Code`、`Agent Memory` |
| 云端 Agent | `Cloud Agent`、`VM/FS` |
| DeepSeek Harness 架构解析 | `DSH`、`Agent Harness` |
| RAG 系统测试 | `RAG`、`Eval` |
| 看懂 memU | `memU`、`Agent Memory` |
| Agent 上线前常用的系统测试方法总述 | `Agent`、`Eval` |
| KV、Prefix、Prompt 与 Context Caching | `KV Cache` |
| OpenViking PR #4736 | `OpenViking`、`Agent`、`Memory`、`PR` |
| memU PR #675 | `memU`、`Agent Memory`、`Pi` |
| Deer Workflow PR #7 | `Workflow`、`Pi`、`Multi-Agent` |

后续修改标签时只编辑文章 frontmatter；面板计数和筛选会在下一次构建时自动更新。

## 8. 验证

```bash
pnpm test:blog-tags
pnpm build
```

浏览器至少验证：

- 1280px 宽屏标题对齐
- 1024px 与 390px 单列顺序及无横向溢出
- Light / Dark
- 单选、多选 AND、快速连续选择、零结果和 Clear
- Astro 客户端导航离开并返回 Blogs

当前仓库的全量 `pnpm check` 和 `pnpm lint` 存在与本功能无关的既有基线错误。修复基线前，不能把这两个命令描述为全量通过。

## 9. 后续修改入口

- 先阅读本文档了解当前代码事实。
- 查看 [Issue #19](https://github.com/wutongyuonce/wutong-yu-blog/issues/19) 了解设计取舍、实现偏差和验收背景。
- 修改筛选语义时同步更新纯函数与 `test/blog-tag-filter.test.mjs`。
- 修改响应式断点、标签尺寸或标题对齐时同步检查 1280px、1024px 和 390px。
