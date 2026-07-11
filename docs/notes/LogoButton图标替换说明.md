# LogoButton 图标替换说明

这份文档用于说明左上角 `LogoButton` 如何从文字改为 SVG 图标，以及如何根据深浅色主题切换不同的 logo。

## 本次目标

- 将左上角原本的文字 `WutongYu` 改成图标显示
- 白天模式显示白底黑标的 `cat-icon-2.svg`
- 暗黑模式显示黑底白标的 `cat-icon.svg`
- 保留点击后跳转首页的行为
- 保留无障碍属性，不影响站点可访问性

## 最终使用的资源

图标文件放在 `public/` 目录下：

```text
public/cat-icon.svg
public/cat-icon-2.svg
```

说明：

- `cat-icon.svg`：用于暗黑模式，黑底白标
- `cat-icon-2.svg`：用于白天模式，白底黑标

之所以放在 `public/` 下，是因为这类静态资源可以直接通过根路径访问，组件里引用时最简单、最稳定。

## 修改文件

本次只修改了一个组件文件：

- `src/components/widgets/LogoButton.astro`

这个组件负责渲染左上角 logo，并包裹首页链接。

## 最终实现

当前组件的核心结构如下：

```astro
<Link
  class="select-none op-transition"
  href={withBasePath('/')}
  aria-label={SITE.author}
  aria-current={Astro.url.pathname === `${withBasePath('/')}` ? 'page' : false}
>
  <div class="logo-container">
    <img
      class="logo-icon img-light"
      src={withBasePath('/cat-icon-2.svg')}
      alt=""
      aria-hidden="true"
    />
    <img
      class="logo-icon img-dark"
      src={withBasePath('/cat-icon.svg')}
      alt=""
      aria-hidden="true"
    />
  </div>
</Link>
```

对应样式如下：

```css
.logo-icon {
  width: 3rem;
  height: 3rem;
  display: block;
  object-fit: cover;
}

.img-dark {
  display: none;
}

:global(html.dark) .img-light {
  display: none;
}

:global(html.dark) .img-dark {
  display: block;
}
```

## 主题切换逻辑

当前逻辑是：

1. 默认情况下只显示 `.img-light`
2. `.img-dark` 默认隐藏
3. 当页面根节点变成 `html.dark` 时：
4. 隐藏白天版 `.img-light`
5. 显示暗黑版 `.img-dark`

也就是说：

- 白天模式：显示 `cat-icon-2.svg`
- 暗黑模式：显示 `cat-icon.svg`

## 为什么前面会出现“暗黑模式显示两个 logo”

之前的问题主要来自两个方向：

1. 一开始使用了不够稳的主题选择器，导致组件内样式没有完全按预期覆盖
2. 后来复用了项目里别处的 `img-light` / `img-dark` 规则，但那个规则原本更多是给正文图片区分主题使用，放到这里不够直观

最后改成在 `LogoButton.astro` 组件内部自己控制显示逻辑，更清晰，也更容易维护。

## 为什么不再用圆形裁切

一开始给 logo 加了：

```css
border-radius: 9999px;
```

这会强制把图标裁成圆形。

后来你确认“不需要用圆来框住 logo”，因此最终方案里已经移除了圆角，让 SVG 按原本外形显示，不再额外套圆形边界。

## 如何继续调整大小

当前大小在 `src/components/widgets/LogoButton.astro` 中定义为：

```css
.logo-icon {
  width: 3rem;
  height: 3rem;
}
```

如果你觉得还要继续放大或缩小，只需要改这两个值：

- 更大：改成 `3.25rem`、`3.5rem`
- 更小：改成 `2.75rem`、`2.5rem`

建议始终让 `width` 和 `height` 保持一致，这样图标比例最稳定。

## 后续替换其他 logo 的方法

以后如果你想把猫图标换成新的 logo，按下面步骤操作即可：

1. 把新的深色版和浅色版 SVG 放进 `public/`
2. 修改 `LogoButton.astro` 里的两个 `src`
3. 如果新图标尺寸视觉上偏大或偏小，再微调 `.logo-icon` 的 `width` 和 `height`

例如：

```astro
src={withBasePath('/new-logo-light.svg')}
src={withBasePath('/new-logo-dark.svg')}
```

## 推荐的图标格式

对于这种导航栏 logo，推荐优先使用 `SVG`：

- 清晰，不会因为放大变糊
- 很适合图形 logo、字母 logo、简洁图标
- 深浅色各准备一份时，替换也很方便

如果以后用位图素材，也可以使用 `PNG` 或 `WebP`，但导航 logo 这类场景通常还是 `SVG` 更合适。

## 涉及文件汇总

- `public/cat-icon.svg`
- `public/cat-icon-2.svg`
- `src/components/widgets/LogoButton.astro`

## 当前结果

- 左上角 logo 已从文字切换为 SVG 图标
- 白天模式和暗黑模式分别显示不同版本
- 保留原有首页跳转逻辑
- 不再强制裁切成圆形
- logo 已比最初版本放大，更适合作为导航品牌标识
