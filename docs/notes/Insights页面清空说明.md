# Insights 页面清空说明

## 1. 背景

为了方便后续重新设计和开发，`/insights/` 页面已移除原有的完整展示实现，暂时收缩为一个空白预留页。

## 2. 本次删除了什么

- 年份分组时间线
- 展开 / 收起交互
- 正文预览与完整正文切换
- 左文右图布局
- 页面内联样式
- 页面标题区、副标题
- 页面级 `snow` 背景

## 3. 当前保留了什么

- `/insights/` 路由
- 顶部导航入口
- `src/pages/insights.mdx`
- `src/components/views/InsightsView.astro`
- `src/content/insights/` 内容源
- `insights` collection 和相关 schema / data 工具函数

## 4. 当前页面状态

当前页面只保留最基础的页面壳与空白主体，便于后续直接在现有路由上重建新的 Insights 页面。

## 5. 后续恢复建议

如果后续需要恢复 Insights 页面能力，建议按下面顺序进行：

1. 先确定新的页面布局和交互目标
2. 再决定是否继续复用现有 `src/content/insights/` 内容结构
3. 在 `InsightsView.astro` 中重新接回数据读取与渲染逻辑
4. 最后再补充样式和相关文档
