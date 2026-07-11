## 一、SEO canonical URL

### 什么是 Canonical URL（规范化网址）？

**简单说**：告诉搜索引擎"这篇文章的**唯一官方地址**是这个"。

### 为什么需要它？

同一篇文章可能通过多个 URL 访问：

```
https://myblog.com/posts/hello
https://myblog.com/posts/hello?utm_source=google  ← 带追踪参数
https://myblog.com/posts/hello?page=2             ← 带分页参数
https://myblog.com/posts/hello/                   ← 后面多一个斜杠
```

**问题**：搜索引擎会以为这是4篇不同的文章，影响排名。

**解决**：在网页头部添加 canonical 标签：

```html
<head>
  <!-- 告诉搜索引擎：不管从哪个 URL 来的，官方地址只有这一个 -->
  <link rel="canonical" href="https://myblog.com/posts/hello" />
</head>
```

### 你的代码中怎么生成？

```astro
---
// Head.astro
const canonicalURL = new URL(Astro.url.pathname, Astro.site)
//                                          ↑              ↑
//                                    当前页面路径    网站根地址
// 
// 假设 Astro.site = "https://myblog.com"
// 当前页面 pathname = "/posts/hello"
// 结果：https://myblog.com/posts/hello
---
<link rel="canonical" href={canonicalURL} />
```

---

## 二、Sitemap（站点地图）

### 什么是 Sitemap？

**简单说**：一个给搜索引擎看的"网站目录"，列出你网站**所有页面**的地址。

### 长什么样？

```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://myblog.com/</loc>        <!-- 首页 -->
    <lastmod>2025-01-15</lastmod>         <!-- 最后修改时间 -->
  </url>
  <url>
    <loc>https://myblog.com/posts/hello</loc>  <!-- 文章页 -->
    <lastmod>2025-01-10</lastmod>
  </url>
  <url>
    <loc>https://myblog.com/about</loc>        <!-- 关于页 -->
    <lastmod>2025-01-01</lastmod>
  </url>
</urlset>
```

### 作用

| 好处         | 说明                                   |
| ------------ | -------------------------------------- |
| **更快收录** | 搜索引擎直接读这个文件，不用自己爬链接 |
| **了解结构** | 知道网站有多少页面，哪些重要           |
| **及时更新** | 新文章发布后，搜索引擎能更快发现       |

### 如何生成？

```bash
# 安装 Astro 的 sitemap 插件
pnpm add @astrojs/sitemap
```

```typescript
// astro.config.ts
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://myblog.com',  // ← 必须配置！插件会用它生成完整地址
  integrations: [sitemap()]
})
```

生成结果中的 `<loc>` 标签：

```xml
<!-- 基于 site 配置自动生成 -->
<loc>https://myblog.com/posts/hello</loc>  <!-- ✅ 完整绝对路径 -->
```

---

## 三、RSS（Really Simple Syndication）

### 什么是 RSS？

**简单说**：让读者用"订阅工具"（如 Feedly、Inoreader）**订阅你的博客**，有新文章自动推送。

### 长什么样？

```xml
<!-- rss.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>我的技术博客</title>
    <link>https://myblog.com</link>
    <description>分享前端开发经验</description>
    
    <item>
      <title>我的第一篇文章</title>
      <link>https://myblog.com/posts/hello</link>  <!-- ← 完整地址 -->
      <pubDate>Mon, 15 Jan 2025 12:00:00 GMT</pubDate>
      <description>文章摘要...</description>
    </item>
    
    <item>
      <title>第二篇文章</title>
      <link>https://myblog.com/posts/world</link>  <!-- ← 完整地址 -->
      <pubDate>Mon, 20 Jan 2025 12:00:00 GMT</pubDate>
      <description>文章摘要...</description>
    </item>
  </channel>
</rss>
```

### 用户体验

```
读者订阅你的 RSS
       ↓
你发布新文章
       ↓
RSS 自动出现在读者的订阅器里
       ↓
读者不用反复打开你的网站，就能看到更新
```

---

## 四、绝对路径 vs 相对路径

### 对比

| 类型         | 示例                             | 说明               |
| ------------ | -------------------------------- | ------------------ |
| **绝对路径** | `https://myblog.com/posts/hello` | 完整网址，包含域名 |
| **相对路径** | `/posts/hello`                   | 只有路径，不含域名 |

### 为什么 Sitemap 和 RSS 需要**绝对路径**？

```xml
<!-- ❌ 相对路径（RSS 阅读器无法识别） -->
<link>/posts/hello</link>

<!-- ✅ 绝对路径（每个阅读器都能打开） -->
<link>https://myblog.com/posts/hello</link>
```

RSS 阅读器不知道你的域名是什么，所以必须用绝对路径。

### 你的代码中如何生成？

```astro
---
// Astro 提供 Astro.site 就是你配置的 site
// 用它拼接绝对路径
const absoluteUrl = new URL('/posts/hello', Astro.site)
// 结果：https://myblog.com/posts/hello
---
```

---

## 五、名词总结表

| 名词              | 一句话解释                         | 类比                              |
| ----------------- | ---------------------------------- | --------------------------------- |
| **Canonical URL** | 告诉搜索引擎"这篇文章的官方地址"   | 身份证号（唯一标识）              |
| **SEO**           | 搜索引擎优化，让网站排名更高       | 让超市把你的商品摆在显眼位置      |
| **Sitemap**       | 网站地图，列出所有页面给搜索引擎看 | 商场的楼层导览图                  |
| **RSS**           | 订阅功能，有新文章自动推给读者     | 杂志的自动订阅配送                |
| **绝对路径**      | 完整的网址（含域名）               | 完整的家庭住址（国家+省+市+街道） |
| **相对路径**      | 只有路径（不含域名）               | 只有门牌号（缺了街道城市）        |

---

## 六、完整流程图

```
你在 astro.config.ts 配置
site: "https://myblog.com"
        ↓
┌───────┴───────┬───────────────┬───────────────┐
↓               ↓               ↓               ↓
Head.astro     Sitemap 插件    RSS 插件      其他组件
↓               ↓               ↓
生成 canonical  生成 sitemap.xml 生成 rss.xml
<link>         <loc>           <link>
https://...     https://...     https://...
        ↓
    搜索引擎/读者
    收到完整正确的地址
```

---

## 七、实际代码示例

### 配置 site

```typescript
// astro.config.ts
export default defineConfig({
  site: 'https://myblog.com'  // ← 就这一个配置
})
```

### 使用 site

```astro
---
// src/components/Head.astro
// 生成 canonical URL
const canonicalURL = new URL(Astro.url.pathname, Astro.site)
// 结果：https://myblog.com/posts/hello
---

<link rel="canonical" href={canonicalURL} />

<!-- 生成 RSS 订阅链接 -->
<link rel="alternate" type="application/rss+xml" 
      title="RSS订阅" 
      href={new URL('/rss.xml', Astro.site)} />
```

**核心理解**：`site` 就是你的博客的"家地址"，所有需要完整网址的地方都会用到它。配置一次，到处受益。