# Insights 页面展开收起与字体说明

这份文档说明当前 `/insights/` 页面在正文展开收起、字体接入和字号控制上的实现方式，方便后续继续调整。

## 1. 涉及文件

- `src/components/views/InsightsView.astro`
- `src/pages/insights.mdx`
- `src/styles/main.css`

其中：

- `insights.mdx` 负责页面入口与 `bgType: snow`
- `InsightsView.astro` 负责时间线结构、正文展开收起、标题与正文排版
- `main.css` 负责注册页面会用到的本地字体

## 2. 当前展开收起逻辑

### 2.1 目标

当前 `Insights` 正文的交互不是“展开前显示部分正文，展开后继续拼接剩余正文”，而是两套显示方式：

- 收起时：只显示前 200 字纯文本预览
- 展开后：直接切换为完整 Markdown 正文

这样做的原因是：

- 可以避免预览末尾的 `...` 和展开后的完整正文同时出现
- 按钮始终能跟在“当前显示内容”的下方
- 结构更简单，视觉上更自然

### 2.2 截断阈值

位置：

- `src/components/views/InsightsView.astro`

当前阈值：

```ts
const CONTENT_PREVIEW_LIMIT = 200
```

如果想改成 250 字或 300 字，直接调整这个常量即可。

### 2.3 预览文本如何生成

`InsightsView.astro` 里会先对 Markdown 正文做一次纯文本清洗：

```ts
function stripMarkdown(content: string) {
  return content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[`*_>#~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
```

然后生成前 200 字的预览：

```ts
function getPreview(content: string) {
  const plain = stripMarkdown(content)
  return plain.length > CONTENT_PREVIEW_LIMIT
    ? `${plain.slice(0, CONTENT_PREVIEW_LIMIT).trim()}...`
    : plain
}
```

这意味着：

- 预览区显示的是纯文本，不保留 Markdown 格式
- 展开后才会显示完整的 Markdown 正文排版

### 2.4 展开收起状态怎么控制

当前不是使用 `details/summary`，而是使用独立的 checkbox 状态控件。

结构大致如下：

```astro
<div class="insight-copy">
  <input id={item.copyToggleId} class="insight-copy__state" type="checkbox" />
  <p class="insight-copy__preview">{item.preview}</p>
  <div class="insight-copy__full">
    <item.Content />
  </div>
  <label for={item.copyToggleId} class="insight-copy__summary">
    <span class="insight-copy__summary-text--closed">展开全文</span>
    <span class="insight-copy__summary-text--open">收起内容</span>
  </label>
</div>
```

配合 CSS 控制：

- 默认隐藏完整正文
- 勾选后隐藏预览正文
- 勾选后显示完整正文
- 按钮文案在“展开全文 / 收起内容”之间切换

这种做法的好处是：

- 按钮不会卡在正文中间
- 展开后按钮仍然保持在完整正文下方
- 收起后按钮保持在预览正文下方

## 3. 当前字体方案

### 3.1 标题字体

每个 Insight 的标题继续使用手写字体：

- `WoHuiBaNiJiaoZuoAiQing-2`

位置：

- `src/components/views/InsightsView.astro`

```css
.insight-node__text h2 {
  font-family: 'WoHuiBaNiJiaoZuoAiQing-2', sans-serif;
}
```

### 3.2 正文字体

当前预览态正文和展开态正文已经统一切到宋体：

- `SourceHanSerifCN-Regular`

该字体文件位置：

```text
public/fonts/SourceHanSerifCN-Regular.ttf
```

注册位置：

- `src/styles/main.css`

```css
@font-face {
  font-family: 'SourceHanSerifCN-Regular';
  src: url('/fonts/SourceHanSerifCN-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

当前 `/insights` 正文、展开态正文和列表编号都会使用它。

### 3.3 为什么列表编号不是改 `::marker`

这个项目的正文列表编号不是完全依赖浏览器默认 marker，而是 `src/styles/prose.css` 中的 `.prose ol > li::before` 在参与绘制。

因此在 `/insights` 页面里，只改：

```css
li::marker
```

通常不够。

当前做法是在 `InsightsView.astro` 中显式覆盖：

```css
.insight-node__content :global(ol > li)::before,
.insight-copy__full :global(ol > li)::before
```

这样可以确保：

- `1.`、`2.` 这类编号稳定显示
- 编号和正文使用同一套字号、行高和字体

## 4. 当前字号控制方式

### 4.1 桌面端变量

位置：

- `src/components/views/InsightsView.astro`

```css
.insights-page {
  --insight-title-size: clamp(1.48rem, 2.25vw, 2.08rem);
  --insight-body-size: clamp(1.04rem, 1.18vw, 1.18rem);
  --insight-body-line-height: 1.95;
}
```

作用：

- `--insight-title-size`：控制每个 Insight 标题字号
- `--insight-body-size`：控制预览正文、展开正文、列表编号字号
- `--insight-body-line-height`：控制正文与编号行高

### 4.2 移动端变量

位置：

- `@media (max-width: 960px)` 内

```css
.insights-page {
  --insight-title-size: clamp(1.48rem, 5.9vw, 1.88rem);
  --insight-body-size: clamp(0.98rem, 3.2vw, 1.08rem);
  --insight-body-line-height: 1.85;
}
```

这意味着：

- 桌面和移动端不是分别去改每个具体选择器
- 而是通过变量统一控制整页标题与正文比例

## 5. 后续最常改的入口

### 5.1 想改标题大小

改：

```css
--insight-title-size
```

### 5.2 想改正文大小

改：

```css
--insight-body-size
```

### 5.3 想改正文疏密

改：

```css
--insight-body-line-height
```

### 5.4 想改预览字数

改：

```ts
const CONTENT_PREVIEW_LIMIT = 200
```

### 5.5 想改正文展开按钮文案

改 `InsightsView.astro` 中这两段：

```astro
展开全文
收起内容
```

## 6. 当前页面效果总结

当前 `/insights` 页面已经具备以下表现：

- 页面使用 `snow` 背景
- 年份分组使用独立状态切换展开收起
- 每条 Insight 超过 200 字时，收起态显示预览，展开后显示完整正文
- 展开收起按钮始终处于当前可见正文的下方
- 标题使用手写字体
- 正文与列表编号统一使用 `SourceHanSerifCN-Regular`
- 标题和正文的字号都通过变量统一控制，桌面与移动端各有一套参数
