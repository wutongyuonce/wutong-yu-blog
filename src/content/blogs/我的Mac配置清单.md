---
title: 我的 Mac 配置清单
description: My personal configuration list for Mac, including applications/settings/shortcut keys/trackpad gestures/terminal/environment for developers
pubDate: 2026-02-02
lastModDate: ''
ogImage: false
toc: true
search: true
---

## 1 应用

资源站：https://appstorrent.ru/

[clashverge](https://github.com/Clash-Verge-rev/clash-verge-rev/releases)

office全家桶

CleanMyKeyBoard：清洁键盘

Runcat/stats：电脑状态

TopNotch：刘海隐藏

Ice：顶部状态栏隐藏

Mac Mouse Fix：鼠标平滑

monitor control

localsend：传输文件

wins：分屏

[launchos](launchosapp.com)：启动台

obs：录屏

typora：markdown 编辑器

wallspace：壁纸

FineTune

超级右键

翻页时钟（appstore）

[steam](https://my.feishu.cn/wiki/NEkswmH6xiQYO4kAynkcZWL9njg)

chrome、tabbit：浏览器

[homebrew](https://brew.sh/)：brew install/uninstall

> ```bash
> # 将初始化命令写入 zsh 配置，下次自动生效
> echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile 
> # 立即生效当前终端
> eval "$(/opt/homebrew/bin/brew shellenv)"
> ```
>
> https://my.feishu.cn/wiki/ClTywsO0vi7JAzkftWfcHURwndx
>
> ```zsh
> /bin/zsh -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
> ```
>

AppCleaner/Pearcleaner：清理工具

keka：压缩工具

IINA：视频播放器

iterm2、[kaku](https://github.com/tw93/kaku)：终端

Bob（Apple Store，翻译软件）

- **划词翻译**：选中需要翻译的文本，按下划词翻译快捷键（默认 `⌥` `D`）即可翻译
- **截图翻译**：按下截图翻译快捷键（默认 `⌥` `S`），截取需要翻译的区域即可翻译
- **输入翻译**：按下输入翻译快捷键（默认 `⌥` `A`），输入需要翻译的文本，Enter 键翻译
- **截图 OCR**：按下截图 OCR 快捷键（默认 `⇧` `⌥` `S`），截取需要识别的区域即可识别文本

Downie：视频下载器

PixPin：截图软件

[crossover/whisky](https://my.feishu.cn/wiki/Scc3w0TSFi5jzck3IJNcTmVjnqd)

final cut pro、剪映：剪辑

Deck：mac 剪切板

[Slidepad](https://slidepad.app)：侧边栏弹出

qq、vx、腾讯会议、qq音乐、网易云、滴答清单、小宇宙、Pomodoro、telegram、discord、百度网盘、阿里云盘

飞书、语雀

开发相关：chatgpt、cursor、kimi、trae、vscode、JetBrains Toolbox（IDEA、Pycharm、Goland）、Navicat、Bruno、Apifox、Postman、Docker、SwitchHosts、CraftAgents、warp、zshrc、Pencil、Open Design

## 2 设置

指纹、锁屏密码

通用

* 登录项与拓展关闭不必要的开机自启动

电池打开优化充电

通知关闭不必要的应用通知

隐私与安全性选择允许任何来源

控制中心

* 蓝牙、声音模块、键盘亮度、天气在菜单栏显示，聚焦不显示
* 电池显示百分比

桌面与程序坞

* 连按窗口标题栏选择填充
* 打开将窗口最小化至应用程序图标
* 拖移窗口至屏幕边缘实现平铺勾选
* 小组件勾选显示在桌面上，不勾选在台前调度中
* 使用iphone的小组件可以同步，没有的话可以关闭
* 自动隐藏和显示程序坞勾选
* 显示项目在台前调度中不勾选
* 将“点按墙纸以显示桌面”选择为“仅在台前调度中”

桌面右键开启使用叠放

应用右上角分享添加到程序坞

访达

* 设置-通用-勾选在标签页打开文件夹

* 左上角显示-显示路径栏、状态栏开启，移动文件可以在路径栏进行拖拽

* 访达设置勾选将按名称排序的窗口中的文件夹保持在顶部，执行搜索时选择搜索当前文件夹
* 默认打开文件夹改为文稿，将自己的文件放在这里
* 在桌面上显示外置磁盘打勾
* 边栏可以选择（外置磁盘），常用的文件夹可以拖拽到边栏固定
* 上方是工具栏，双指点击也可以自定义，建议放隔空投送和显示简介

辅助功能

* 指针控制-触控板选项-拖移方式选择**三指拖移**（移动文件、软件、窗口）
* 动态效果-车辆运动提示打开

聚焦

* 关闭iphone App

触控板

* 调整跟踪速度，距最右边两格
* 查询与数据检测器选择双指点按，打开轻点来点按
* 滚动缩放-自然滚动关闭
* 更多手势-轻扫切换全屏幕显示的应用选择四指，调度中心选择四指

锁定屏幕：锁定时显示信息可以自定义

键盘，点击输入法后方的编辑，取消勾选“连按两下空格键插入句号”，打开“自动切换到文稿的输入法”开关

## 3 快捷键

聚焦搜索是我们在 Mac 上查找文件的主要手段，任何时候你都可以按 Command+空格键呼出它，从 macOS Ventura 开始，苹果取消了聚焦搜索右侧的预览窗口，你可以选中搜索结果后按空格键对它进行更大窗口的预览。如果你想要知道搜索结果所在的文件路径，只需要选中结果，按住 command 键即可，如果你按住 command 键点击搜索结果，则会打开它所在的文件夹，而不是打开结果本身。

聚焦除了能搜索文件，还能调用词典对文字进行解释，这在浏览外文内容时非常好用，但有时你输入一个单词后，出现的搜索结果列表特别长，需要向下滑动多次才能找到词典的结果，实用性大打折扣，其实你只需要输入单词，然后按下 Command+L，就能快速跳转到词典，查看单词的解释了。

当我们想要通过百度或其他搜索引擎查找互联网内容时，通常会打开浏览器，在地址栏输入内容，敲回车进行搜索，其实聚焦可以帮助你大大简化这一操作。在聚焦中输入搜索关键字，然后按下 Command+B，macOS 就会为你打开浏览器，并用你设置的默认搜索引擎搜索该内容，省去了中间所有的步骤。你甚至可以使用一些高级的搜索命令，例如在关键词后面加上 site:网址，要求搜索引擎在指定网址搜索关键字，或是加上-号去除特定内容，这些搜索命令都会被聚焦正确地传递给浏览器，真的非常方便。

command+空格space：全局搜索，也可以用于打开任意软件

* 输入dictionary，有本地翻译
* 输入calculator，有计算器
* 再按command+4，有历史粘贴板

command+tab：选择应用  command+shift：返回应用

command+W：关闭窗口保留后台  command+Q：直接退出

当你同时打开了某个应用的多个窗口，如果想要快速关闭或者最小化它们，只需要按住 option 键，再点击黄色的最小化按钮，这个应用的所有窗口会同时最小化，按住 option 点击关闭按钮则能快速关闭所有窗口，也可以用 option+Command+W

fn+F：绿标最大化以及取消最大化

左上角苹果图标-强制退出 option+command+esc

command+N：新建访达窗口，可以多开

command+C/V/S/Z

Option+Command+C：复制文件路径

Shift+option+Command+V：无格式粘贴

* command+shift+3：截图全屏
* command+shift+4：截图选区
* command+shift+5：调出截图菜单可以录屏（mac自带不能录制系统声音，只有麦克风），选项可以设置保存位置为桌面

按住option+三指拖动应用：分屏

空格键：预览各种文件  Option+空格键：在全屏幕状态下快速预览文件，这非常适合浏览视频和图片内容。

文件的**剪切移动**可以直接拖拽，或者：

1. 在原文件夹内点击文件command+C
2. 来到目标文件夹option+command+V

ctrl+command+空格space：插入表情包

ctrl+command+Q：进入锁屏模式，再按esc熄屏

在选择文件的窗口中按下 Shift+Command+G 就可以打开前往窗口，输入路径按回车就能快速跳转过去，如果你输入的路径是一个具体的文件，它还会自动帮你选中

command+H：隐藏当前应用所有窗口

command+R：刷新浏览器

command+T：打开safari新标签页、新终端页面

## 4 手势

双指点击就是windows的右键

双指双击：放大

双指左右滑动：前后页面切换

四指左右滑动：切换桌面desktop1、2、3...

四指向上轻扫：打开调度中心

四指合拢：打开启动台

四指张开：显示桌面

## 5 .DS_Store

`.DS_Store` 是 **macOS 系统自动生成的隐藏文件**，全称是 **Desktop Services Store**。

它的作用是什么？

当你在 macOS 的 **Finder** 中浏览文件夹时，系统会自动创建 `.DS_Store` 文件来保存该文件夹的**自定义显示设置**，例如：

- 图标位置（如果你手动拖动过图标）
- 文件夹的视图方式（图标视图、列表视图、分栏视图等）
- 窗口大小和位置
- 背景图片（如果设置了）
- 排序方式（按名称、日期等）

> 💡 每个被 Finder 访问过的文件夹都可能生成一个 `.DS_Store` 文件。

为什么开发者讨厌它？

1. **会被误提交到 Git 仓库**

   ```
   git add .
   ```

   如果不注意，

   ```
   .DS_Store
   ```

   会被上传到 GitHub，显得很不专业。

2. **对其他系统用户无用**
   Windows/Linux 用户下载你的代码后，这个文件毫无意义，还可能造成干扰。

3. **数量多**
   每个子目录都可能有一个，导致仓库杂乱。

如何避免 `.DS_Store` 污染项目？——全局忽略（推荐）

在你的用户目录下创建或编辑 `~/.gitignore_global`，加入：

```
.DS_Store
```

然后告诉 Git 全局使用它：

```
git config --global core.excludesfile ~/.gitignore_global
```

此后所有新仓库都会自动忽略 `.DS_Store`。

## 6 终端配置 iterm2+oh-my-zsh+tmux+yazi/kaku

相对路径相关符号：

| 符号        | 名称             | 含义                                   | 示例                       |
| ----------- | ---------------- | -------------------------------------- | -------------------------- |
| `.`         | 当前目录         | 表示当前所在目录                       | `ls ./` → 列出当前目录内容 |
| `..`        | 父目录           | 表示上一级目录                         | `cd ..` → 返回上一层       |
| `~`         | 家目录（Home）   | 表示当前用户的主目录（等价于 `$HOME`） | `cd ~` → 回到家目录        |
| `/`         | 根目录           | 文件系统的最顶层                       | `cd /` → 进入根目录        |
| `~username` | 指定用户的家目录 | 如 `~alice` 表示用户 alice 的 home     | `ls ~john/Documents`       |

iterm2支持选中即复制

https://www.poloxue.com/posts/2023-10-16-zsh-themes-and-plugins/

| tree命令  | 用途                                  |
| --------- | ------------------------------------- |
| `tree -d` | **仅显示目录**，不显示文件            |
| `tree -a` | **显示隐藏文件**（以 `.` 开头的文件） |

> **小技巧：创建别名（alias）**
>
> 你可以把常用命令设为别名，比如在 `~/.bashrc` 或 `~/.zshrc` 中添加：
>
> **macOS:**
>
> ```bash
> alias cpwd='pwd | pbcopy'
> ```
>
> 然后运行 `source ~/.bashrc`（或对应配置文件），之后只需输入 `cpwd` 即可复制当前路径。

https://www.poloxue.com/posts/2023-10-20-zsh-theme-powerlevel10k/

安装字体：

```bash
brew install --cask font-hack-nerd-font font-meslo-lg-nerd-font
```

然后在 **iTerm2 → Profiles → Text → Font** 中选择一个。

设置-profiles-新建一个-右侧keys-key bindings-选择presets为natural text editing，这样能在终端进行command和option的位置跳跃移动和删除

lazygit插件 `brew install lazygit`

* 在.zshrc中添加 `alias lgit='lazygit'`，也可以自定义快捷键

## 7 开发环境配置

Idea\pycharm\vscode 配置导入

一、通过 **Homebrew** 安装的命令行工具（系统级）

用 `brew install <包名>` 安装：

| 工具                                                        | 用途说明                                                     |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| **[wget](https://www.gnu.org/software/wget)**               | 从网络下载文件的命令行工具（类似 `curl`，但更专注下载）      |
| **[httpie](https://httpie.io/)**                            | 人性化的 HTTP 客户端，比 `curl` 更易读，适合 API 调试        |
| **[tree](http://mama.indstate.edu/users/ice/tree)**         | 以树状图形式显示目录结构                                     |
| **[fastfetch](https://github.com/fastfetch-cli/fastfetch)** | 系统信息展示工具（`neofetch` 的更快替代品），显示 OS、内核、Shell、CPU、内存等 |
| **[tldr](https://tldr.sh/)**                                | 简化版 man 手册，提供常用命令的实用示例 → `tldr -u` 用于更新缓存 |
| nvm(node.js、npm)、pnpm                                     | JavaScript 的包管理工具，用于安装、管理和共享项目依赖；其中 npm 是 Node.js 自带的默认包管理器，而 pnpm 通过硬链接和符号链接更高效地节省磁盘空间并提升安装速度。 |
| yazi                                                        |                                                              |
| tmux                                                        | “终端复用器”（Terminal Multiplexer）                         |
| gh                                                          | GitHub CLI                                                   |
| pipx                                                        | Python 生态中一个专门为命令行工具设计的“应用管理器”。它通过自动创建隔离环境，解决了传统 `pip install` 方式带来的依赖冲突和权限问题，让你可以安全、便捷地安装和使用各种 Python 编写的优秀命令行工具。 |

```bash
brew install git wget httpie tree fastfetch tldr protobuf sqlite tmux yazi gh pipx
```

`brew install protobuf` 命令安装了一个名为 `protoc` 的编译工具，它负责把 `.proto` 接口定义文件转化为各种编程语言的代码，是实现高效、跨语言数据交换的桥梁。

**验证是否成功**：

```bash
# 重新加载配置
source ~/.zshrc

# 验证关键工具
http --version       # 应输出版本
tldr --help          # 应显示帮助
fastfetch            # 应显示系统信息
tree --version       # 应输出版本
wget --version       # 应输出版本
```

```bash
# 安装 nvm
brew install nvm

# 创建 nvm 目录（如果不存在）
mkdir ~/.nvm
```

编辑 `~/.zshrc`：

```bash
nano ~/.zshrc
```

添加以下内容：

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # 加载 nvm
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # 自动补全
```

1. **保存文件**：按下键盘上的 **`Ctrl` + `O`**（字母 O，不是数字 0）。
   - 此时屏幕底部会提示 `File Name to Write: /Users/你的用户名/.zshrc`（或类似路径）。
2. **确认文件名**：直接按 **`Enter` (回车键)** 确认。
   - 屏幕底部会显示 `Wrote X lines`，表示保存成功。
3. **退出编辑器**：按下 **`Ctrl` + `X`**。
   - 你会回到终端命令行界面。

```bash
# 安装常用版本
nvm install 14.21.3   # Vue 2 推荐
nvm install 16.20.2   # Vue 2 / 3 兼容
nvm install 18.18.2   # Vue 3 推荐
nvm install 20.14.0   # 最新 LTS

# 查看已安装版本
nvm list

# 切换版本（临时）
nvm use 18.18.2

# 设置默认版本（新终端也生效）
nvm alias default 18.18.2

# 使用 npm 安装 pnpm（任何 Node 版本下都可装）
npm install -g pnpm

# 给 npm 配置国内镜像源
npm config set registry https://registry.npmmirror.com
```

### **安装编译器（Xcode Command Line Tools）**

> [!NOTE]
>
> 安装homebrew时会自动安装

你不需要安装完整的 Xcode（很大），只需安装轻量级的 **命令行工具**：

**方法：终端中运行**

```
xcode-select --install
```

会弹出窗口，点击 “Install” 即可。

> 安装后，你将获得：
>
> - `clang`（C 编译器）
> - `clang++`（C++ 编译器）
> - `make`
> - `git`
> - 其他开发工具

### 安装 Python 包

通过 **pip** 安装 Python 第三方库，在激活的 Python 环境中运行 `pip install xxx` 安装：

| 库名                                                         | 用途说明                                               |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| **[you-get](https://you-get.org/)**                          | 视频/音频下载工具（支持 YouTube、Bilibili 等）         |
| **[httpx](https://pypi.org/project/httpx/)**                 | 现代异步 HTTP 客户端（`requests` 的 async 支持版）     |
| **[requests](https://pypi.org/project/requests/)**           | 最流行的 Python HTTP 库，用于发送 HTTP 请求            |
| **[beautifulsoup4](https://pypi.org/project/beautifulsoup4/)** | HTML/XML 解析库，常用于网页抓取（配合 `requests`）     |
| **[django](https://www.djangoproject.com/)**                 | 全功能 Web 框架（“大而全”）                            |
| **[psycopg](https://www.psycopg.org/)**                      | PostgreSQL 数据库适配器（Django 连接 PostgreSQL 必需） |
| **[openpyxl](https://pypi.org/project/openpyxl/)**           | 读写 Excel `.xlsx` 文件                                |
| **[pandas](https://pandas.pydata.org/)**                     | 数据分析与处理库（基于 NumPy）                         |
| **[matplotlib](https://matplotlib.org/)**                    | 绘图库（生成折线图、柱状图等）                         |
| **[pillow](https://github.com/python-pillow/Pillow)**        | 图像处理库（PIL 的活跃分支）                           |
| **[jieba](https://github.com/fxsjy/jieba)**                  | 中文分词工具                                           |
| **[wordcloud](https://github.com/amueller/word_cloud)**      | 生成词云图（常配合 `jieba` + `matplotlib`）            |
| **[python-docx](https://github.com/python-openxml/python-docx)** | 读写 Word `.docx` 文件                                 |
| **[pygame](https://www.pygame.org/)**                        | 游戏开发库（2D 游戏、多媒体应用）                      |

```bash
pip install you-get httpx requests beautifulsoup4 django psycopg openpyxl pandas matplotlib pillow jieba wordcloud python-docx
pip list
```

> 注意：`psycopg` 在 macOS 上可能需要先安装 PostgreSQL：
>
> ```bash
> # 1. 安装
> brew install postgresql
> 
> # 2. 启动服务
> brew services start postgresql # start会设置开机自启动
> brew services run postgresql # run只会单次启动
> 
> # 3. 创建用户和数据库（如果需要）
> createuser --superuser $(whoami)
> createdb
> 
> # 4. 连接！
> psql
> ```
>
> **中文支持**：`jieba` 和 `wordcloud` 需要额外字体支持中文（否则词云显示方框）。

### httpie

以下 `httpie` 命令，是**开发者日常调试 API、测试后端接口、与 Web 服务交互的核心工具**。下面我逐条解释它们的实际用途和典型场景：

1、 `http https://httpbin.org/get`

> **作用：发送一个 GET 请求，查看服务器返回的数据**

实际用途：

- **测试你的网络是否能访问某个 API**
- **验证 API 是否正常响应**
- **查看公开 API 的返回格式（如 JSON 结构）**

示例场景：

```
# 检查 GitHub API 是否可用
http https://api.github.com/users/octocat

# 查看自己的公网 IP（通过 httpbin）
http https://httpbin.org/ip
```

> 返回内容包含：请求头、原始请求 URL、客户端 IP 等，非常适合**调试请求上下文**。

2、`http POST https://httpbin.org/post name=John age=30`

> **作用：向服务器提交结构化数据（自动转为 JSON）**

实际用途：

- **测试用户注册、登录、创建订单等“写操作”接口**
- **模拟前端发送的 JSON 数据**
- **验证后端能否正确解析请求体**

关键特性：

- `name=John age=30` 会被自动转换为：

  ```json
  { "name": "John", "age": 30 }
  ```

- 自动设置 `Content-Type: application/json`

- 比 `curl -X POST -d '{"name":"John"}'` 更简洁、不易出错

真实场景：

```bash
# 注册新用户
http POST https://myapp.com/api/register email=user@example.com password=secret123

# 创建一篇博客文章
http POST https://blog-api.com/posts title="Hello" content="World"
```

3、 `http https://api.example.com Authorization:Bearer xxx`

> **作用：带认证 Token 访问受保护的 API**

实际用途：

- **调试需要登录态的接口（如用户信息、支付接口）**
- **测试 JWT / OAuth2 Bearer Token 是否有效**
- **绕过前端，直接调用内部 API**

语法说明：

- `Authorization:Bearer xxx` 是标准的 **HTTP Bearer Token 认证头**

- `httpie` 会自动将其加入请求头：

  ```http
  Authorization: Bearer xxx
  ```

真实场景：

```bash
# 获取当前用户信息（需登录）
http https://api.myapp.com/me Authorization:"Bearer eyJhbGciOiJIUzI1NiIs..."

# 调用 GitHub API（需 token）
http https://api.github.com/user Authorization:"token ghp_xxx"
```

4、 `http --download https://example.com/file.zip`

> **作用：下载文件（类似 `wget` 或 `curl -O`）**

实际用途：

- **从命令行快速下载安装包、数据集、备份文件**
- **自动化脚本中获取远程资源**

优势 vs `wget`**/**`curl`：

- 自动从 URL 推断文件名（如 `file.zip`）
- 显示进度条（默认）
- 支持断点续传（加 `--continue`）

真实场景：

```bash
# 下载 Python 安装包
http --download https://www.python.org/ftp/python/3.12.1/python-3.12.1-macos11.pkg

# 下载公开数据集
http --download https://example.com/datasets/sales.csv
```

总结：为什么开发者爱用 `httpie`**？**

| 对比项        | `curl`/`wget`                                               | `httpie`                               |
| :------------ | :---------------------------------------------------------- | :------------------------------------- |
| **JSON 支持** | 需手动加 `-H "Content-Type: application/json"` 和 `-d '{}'` | ✅ 自动识别 `key=value` → JSON          |
| **可读性**    | `curl -X POST -H "Auth: Bearer x" -d '{"a":1}' url`         | `http POST url a=1 Auth:"Bearer x"`    |
| **输出高亮**  | ❌ 纯文本                                                    | ✅ 自动语法高亮（终端彩色显示）         |
| **默认行为**  | 需记很多参数                                                | ✅ 符合直觉（GET 默认，POST 自动 JSON） |

在 macOS 上管理多个 JDK 和 Maven 版本，推荐使用 **Homebrew（brew）** 配合 **SDKMAN!** 或 **jenv**（用于 JDK）和手动/脚本方式（用于 Maven）。下面分别说明安装与配置方法。

------

### 多版本JDK\Maven管理

#### JDK

##### 使用 **jenv**（推荐）

```java
brew install jenv
```

配置环境变量，编辑 `~/.zshrc`（或 `/.bash_profile`）：

```bash
export PATH="$HOME/.jenv/bin:$PATH"
eval "$(jenv init -)"
export JAVA_HOME=$(jenv prefix)
```

然后执行：

```bash
source ~/.zshrc
```

安装多个 JDK（通过 Homebrew）：

```java
# 安装 OpenJDK 8、11、17、21 等
brew install openjdk@8
brew install openjdk@11
brew install openjdk@17
brew install openjdk@21
```

添加 JDK 到 jenv：

```java
jenv add /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
```

查看和切换 JDK

```java
jenv versions          # 查看已注册版本
jenv global 17         # 全局使用 JDK 17
jenv local 11          # 当前目录使用 JDK 11（生成 .java-version 文件）
```

执行以下命令：

```
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk \
             /Library/Java/JavaVirtualMachines/openjdk-21.jdk
```

**只是向 macOS 系统“注册”了一个 JDK 位置**，并不会改变你当前的终端环境、`jenv` 设置，也不会干扰 IDEA 的项目配置。

详细解释：这一步到底做了什么？

它只是在系统标准目录 `/Library/Java/JavaVirtualMachines/` 下创建了一个软链接，让以下组件能发现 Java：

- Finder（双击 `.jar`）
- macOS 的 `java` 命令（当 GUI 应用调用时）
- **IntelliJ IDEA / VS Code / Eclipse 等 IDE 的自动 JDK 扫描器**
- Minecraft 启动器、Gradle Daemon（GUI 模式）、其他 Java 应用

> 💡 这个操作 **只读不写**，不修改任何环境变量，也不覆盖 `JAVA_HOME`。

##### 手动下载 + 自定义脚本切换（最通用）

macOS 提供了一个非常实用的内置工具：
**`/usr/libexec/java_home`**，它可以**动态查询并返回已安装 JDK 的 `JAVA_HOME` 路径**，特别适合用于脚本或环境配置中。下面详细说明 **如何利用它来管理多版本 JDK（无需 brew、无需手动硬编码路径）**。

一、前提条件

你的 JDK 必须是通过以下方式之一安装的（即注册到了 macOS 的 Java 注册表中）：

- 官方 Oracle JDK `.dmg` 安装包
- Eclipse Adoptium (Temurin) `.pkg` 或 `.dmg`
- Amazon Corretto `.pkg`
- Azul Zulu `.pkg`
- 其他标准 macOS 安装包（会把 JDK 放到 `/Library/Java/JavaVirtualMachines/`）

> ❌ 不适用于：
>
> - 直接解压 `.tar.gz` 到任意目录（如 `~/tools/jdk/`）且未手动注册的 JDK
> - 通过 Homebrew 安装的 OpenJDK（除非你手动链接或注册）

你可以先检查系统识别了哪些 JDK：

```bash
# 列出所有已注册的 JDK
/usr/libexec/java_home -V
```

输出示例：

```
Matching Java Virtual Machines (3):
    17.0.12 (x86_64) "Eclipse Adoptium" - "OpenJDK 17.0.12" /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
    11.0.24 (x86_64) "Amazon" - "Corretto-11.0.24.8.1" /Library/Java/JavaVirtualMachines/amazon-corretto-11.jdk/Contents/Home
    1.8.0_402 (x86_64) "Azul Systems, Inc." - "Zulu 8.76.0.19-CA-macosx" /Library/Java/JavaVirtualMachines/zulu-8.jdk/Contents/Home
```

只要这里能看到你的 JDK，就可以用 `java_home` 工具！

二、基本用法

1、获取默认 JDK 的 JAVA_HOME

```bash
/usr/libexec/java_home
# 输出：/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
```

2、获取指定版本的 JAVA_HOME

```bash
# 获取 JDK 17
/usr/libexec/java_home -v 17

# 获取 JDK 11
/usr/libexec/java_home -v 11

# 获取 JDK 8（注意：要写成 1.8）
/usr/libexec/java_home -v 1.8
```

> ⚠️ 注意：JDK 8 在命令中必须写成 `1.8`，不能写 `8`！

三、编写通用 JDK 切换脚本（推荐）

创建脚本文件：`~/bin/jdk-switch.sh`

```bash
#!/bin/bash

# 默认版本
DEFAULT_VERSION="17"

# 获取用户输入的版本，若无则用默认
VERSION=${1:-$DEFAULT_VERSION}

# 特殊处理：如果输入的是 "8"，自动转为 "1.8"
if [[ "$VERSION" == "8" ]]; then
  VERSION="1.8"
fi

# 查询 JAVA_HOME
JAVA_HOME=$(/usr/libexec/java_home -v "$VERSION" 2>/dev/null)

# 检查是否找到
if [ $? -ne 0 ] || [ -z "$JAVA_HOME" ]; then
  echo "❌ Error: JDK version $1 not found."
  echo "Available versions:"
  /usr/libexec/java_home -V 2>&1 | grep "^    " | sed 's/^[[:space:]]*//'
  return 1
fi

# 设置环境变量
export JAVA_HOME
export PATH="$JAVA_HOME/bin:$PATH"

# 输出当前信息
echo "✅ Switched to:"
java -version
echo "JAVA_HOME=$JAVA_HOME"
```

赋予执行权限：

```bash
chmod +x ~/bin/jdk-switch.sh
```

添加别名到 `~/.zshrc`（或 `~/.bash_profile`）：

```bash
alias jdk='source ~/bin/jdk-switch.sh'
```

重新加载配置：

```bash
source ~/.zshrc
```

四、使用示例

```bash
# 切换到 JDK 17（默认）
jdk

# 切换到 JDK 11
jdk 11

# 切换到 JDK 8（支持简写）
jdk 8

# 如果版本不存在，会提示可用列表
jdk 21
```

输出示例：

```
✅ Switched to:
openjdk version "11.0.24" 2024-07-16 LTS
OpenJDK Runtime Environment Corretto-11.0.24.8.1 (build 11.0.24+8-LTS)
OpenJDK 64-Bit Server VM Corretto-11.0.24.8.1 (build 11.0.24+8-LTS, mixed mode)
JAVA_HOME=/Library/Java/JavaVirtualMachines/amazon-corretto-11.jdk/Contents/Home
```

五、设置默认 JDK（开机生效）

如果你希望**每次打开终端都默认用 JDK 17**，可以在 `~/.zshrc` 中加一行：

```bash
# 设置默认 JDK
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
```

> 这样即使不运行 `jdk` 命令，新终端也会用 JDK 17。

#### Maven手动下载 + 脚本切换

Maven 本身不依赖特定 JDK 版本（但需兼容），可独立管理。  [Apache Maven 官网](https://maven.apache.org/download.cgi)

1、下载 Maven 二进制包，解压到统一目录

```bash
mkdir -p ~/tools/maven
cd ~/tools/maven

https://archive.apache.org/dist/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz
https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz

tar -xzf apache-maven-3.8.6-bin.tar.gz
tar -xzf apache-maven-3.9.9-bin.tar.gz
```

目录结构：

```
~/tools/maven/
├── apache-maven-3.8.6
├── apache-maven-3.9.9
└── apache-maven-4.0.0
```

在./zshrc中添加：

```bash
# Maven 环境变量（固定版本）
export M2_HOME="$HOME/tools/maven/apache-maven-3.9.9"
export PATH="$M2_HOME/bin:$PATH"
```

在终端测试：

```bash
mvn -v
```

##### MVN本地目录和镜像全局配置

```bash
# 创建 Maven 本地仓库目录
mkdir -p ～/maven-repo
```

> 默认路径是 `～/.m2/repository`，但自定义路径更清晰、易备份。

创建/编辑 Maven 全局配置文件

Maven 的配置文件是：**`～/.m2/settings.xml`**

```bash
mkdir -p ～/.m2
```

创建 `settings.xml` 文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                              http://maven.apache.org/xsd/settings-1.0.0.xsd">

  <!-- 配置本地仓库路径（可选） -->
  <localRepository>/Users/a/maven-repo</localRepository>

  <!-- 配置镜像（关键！加速依赖下载） -->
  <mirrors>
    <!-- 阿里云 Maven 镜像（推荐） -->
    <mirror>
      <id>aliyunmaven</id>
      <mirrorOf>*</mirrorOf>
      <name>阿里云公共仓库</name>
      <url>https://maven.aliyun.com/repository/public</url>
    </mirror>

    <!-- 华为云镜像（备选） -->
    <!--
    <mirror>
      <id>huaweicloud</id>
      <mirrorOf>*</mirrorOf>
      <name>华为云公共仓库</name>
      <url>https://repo.huaweicloud.com/repository/maven/</url>
    </mirror>
    -->
  </mirrors>
</settings>
```

> * 将 `<localRepository>` 中的路径 `/Users/a/maven-repo` 改成你的实际用户名路径（用 `echo $HOME` 查看）
>
> - 如果不想改本地仓库，**直接删除 `<localRepository>` 整行即可**，Maven 会用默认路径 `～/.m2/repository`

### mysql

```bash
# 查看可安装版本（可选）
brew search mysql
# 安装最新稳定版（如 8.0.x）
brew install mysql
# 每次开机都要启动服务
brew services start mysql
```

1. **是否启用 VALIDATE PASSWORD COMPONENT?** → 一般选 `n`（开发环境）
2. **设置 root 密码** → 输入强密码（如 `123456`）
3. **移除匿名用户？** → `y`
4. **禁止 root 远程登录？** → 开发可选 `n`，生产建议 `y`
5. **删除 test 数据库？** → `y`
6. **重载权限表？** → `y`

```bash
# 用 root 登录
mysql -u root -p

# 输入密码后，应进入 MySQL 命令行
Welcome to the MySQL monitor...
mysql>
```

Homebrew 已将 `mysql` 命令加入 PATH，一般无需额外配置。
如需手动确认：

```bash
which mysql
# 应输出：/opt/homebrew/bin/mysql （Apple Silicon）
# 或 /usr/local/bin/mysql （Intel Mac）
```

```bash
# 卸载
brew uninstall mysql && rm -rf /opt/homebrew/var/mysql
```

### Go

推荐使用专业工具（如 `g`、`gvm` 或 `goenv`），避免手动切换 `GOROOT`/`PATH` 的麻烦。

下面提供 **两种主流方案**：

**方案一：使用 `g`（最轻量，推荐）**

**方案二：使用 `goenv`（兼容 rbenv/pyenv 风格）**

> 无需 Homebrew 安装 Go 本体（但工具本身可用 brew 安装，也可手动安装）

------

#### 方案一：使用 `g`（Go Version Manager，最简单高效）

##### 步骤 1：安装 `g` 工具

方法 A：用 Homebrew（推荐）

```bash
brew install g
```

方法 B：手动安装（无 brew 时）

```bash
# 下载并安装 g
curl -sSL https://git.io/g-install | bash
source ~/.g_profile  # 或重启终端
```

> 安装后，`g` 会把 Go 版本放在 `~/.go/` 目录，并自动管理 `GOROOT` 和 `PATH`。

##### 步骤 2：使用 `g` 管理多版本 Go

```bash
# 查看可安装的远程版本
g list-remote

# 安装多个版本（示例）
g install 1.20.14
g install 1.21.10
g install 1.22.5
g install 1.23.0

# 查看已安装版本
g list

# 临时切换当前 Shell 的 Go 版本
g use 1.21.10

# 设置全局默认版本（新终端也生效）
g default 1.22.5

# 验证
go version
which go
echo $GOROOT
```

> 优点： 
>
> - 自动设置 `GOROOT` 和 `PATH`
> - 无需手动配置 shell 
> - 切换零冲突

#### 方案二：使用 `goenv`（适合熟悉 pyenv/rbenv 的用户）

##### 步骤 1：安装 `goenv`

用 Homebrew：

```bash
brew install goenv
```

手动安装（无 brew）：

```bash
git clone https://github.com/goenv/goenv.git ~/.goenv
```

##### 步骤 2：配置 Shell（以 zsh 为例）

在 `~/.zshrc` 中添加：

```bash
export GOENV_ROOT="$HOME/.goenv"
export PATH="$GOENV_ROOT/bin:$PATH"
eval "$(goenv init -)"
```

然后重载配置：

```bash
source ~/.zshrc
```

##### 步骤 3：使用 `goenv` 管理版本

```bash
# 列出可安装版本
goenv install -l

# 安装指定版本
goenv install 1.21.10
goenv install 1.22.5

# 查看已安装
goenv versions

# 设置全局默认
goenv global 1.22.5

# 设置当前目录局部版本（项目级）
cd ~/my-go-project
goenv local 1.21.10  # 生成 .go-version 文件

# 验证
go version
```

> 优点： 
>
> - 支持项目级自动切换（进入目录自动切 Go 版本） 
> - 与 pyenv/rbenv 体验一致

#### 补充：基础开发环境配置（无论单/多版本）

1、**GOPATH（Go 1.11+ 模块化后已非必需，但建议了解）**

- 默认 GOPATH：`~/go`
- 你可以不设置，直接用 **Go Modules**（现代标准）

2、**验证 Go 是否正常工作**

```bash
# 创建测试项目
mkdir -p ~/go-test && cd ~/go-test
go mod init example.com/test
cat > main.go <<EOF
package main
import "fmt"
func main() {
    fmt.Println("Hello, Go!")
}
EOF

# 运行
go run main.go
```

3、**VS Code 开发支持（可选但推荐）**

- 安装 VS Code
- 安装官方插件：**Go (by Go Team at Google)**
- 首次打开 Go 项目时，按提示安装工具（如 `gopls`, `delve` 等）

不推荐：手动管理多版本（易出错）

虽然可以：

```bash
sudo tar -C /usr/local/go1.21 -xzf go1.21.darwin-arm64.tar.gz
sudo tar -C /usr/local/go1.22 -xzf go1.22.darwin-arm64.tar.gz
```

再写脚本切换 `GOROOT` 和 `PATH`，但：

- 容易污染 PATH
- 切换后需 `source`
- 无项目级自动切换
- 维护成本高

> 💡 **强烈建议用 `g` 或 `goenv`**

最终推荐选择

| 场景                             | 推荐工具                      |
| -------------------------------- | ----------------------------- |
| 快速上手、轻量                   | **`g`**（一行安装，三行切换） |
| 多语言开发者（已用 pyenv/rbenv） | **`goenv`**                   |
| 企业严格管控环境                 | 手动 + 脚本（但需精细测试）   |

#### 卸载旧版 Go（如果之前用 pkg 安装过）

```bash
# 删除官方 pkg 安装的 Go
sudo rm -rf /usr/local/go

# 清理 PATH 中残留（检查 ~/.zshrc）
grep -n "GOROOT\|go" ~/.zshrc
```

然后用 `g` 或 `goenv` 重新管理。

完成以上步骤后，你就可以在 macOS 上 **无缝切换多个 Go 版本**，高效开发！

## 8 其他技巧

跳过应用安全检测：

```sh
xattr -dr com.apple.quarantine /Applications/zshrc.app
```



通过 VS Code 自带功能安装 `code` 命令

1. **打开 VS Code**。

2. 打开命令面板：

   - 快捷键：`Cmd + Shift + P`（macOS）或 `Ctrl + Shift + P`（Linux）

3. 输入并选择：

   ```
   Shell Command: Install 'code' command in PATH
   ```

4. 等待执行完成。

   这个操作会自动将 `code` 命令软链接到 `/usr/local/bin/code`（macOS）或类似位置，并确保它在 PATH 中。

5. **重启终端**（或运行 `source ～/.zshrc`），然后测试：

   ```
   code .
   ```



如何打开帧率：直接打开终端，输入/bin/launchctl setenv MTL_HUD_ENABLED 1然后运行游戏，此时显示hud 再次输入/bin/launchctl setenv MTL_HUD_ENABLED 0运行游戏，此时关闭hud



终端运行以下命令并重启Mac后你只需要按住control+command，就可以用鼠标拖动窗口到任意位置

```zsh
defaults write -g NSWindowShouldDragOnGesture -bool true
```



将访达切换为**列表**、**分栏**或者**画廊视图**，就可以通过按住Shift点击头尾两个文件的方式，实现连续选中



x按钮仅关闭当前窗口，软件仍后台运行；放在绿色按钮上等一会可以分屏



安装包后缀dmg，双击打开会看到窗口，将应用图标拖拽到应用程序文件夹中



dock栏双指点击图标-退出，点击竖线可以控制大小、进行配置

常用文件夹拖动到废纸篓左侧，可以设置为扇形，可以拖拽文件到屏幕



文件拖动会混乱显示，可以双指点击-选择整理方式



**磁盘**

* 一般来说这是因为你的外接硬盘使用了NTFS文件系统，这个微软的文件系统在macOS上只能读取，但不能写入，也就是可以把文件从硬盘拷贝到Mac上，但Mac上的文件拷贝不过去。解决方案是用第三方的NTFS读写应用，例如Paragon NTFS或是Tuxera NTFS，实现对NTFS文件系统磁盘的写入，但这些应用通常是付费的。或者你也用系统自带的磁盘工具将外接硬盘格式化为exFAT或是APFS文件系统，但请注意这会清空硬盘上的数据

* 磁盘工具-找到对应外置硬盘-点击上方抹掉选项（格式化），选择ExFAT/APFS格式
* 对于exFAT文件系统的硬盘，由于它对索引的支持不太行，会导致文件无法被聚焦搜索到。解决方案是备份数据，然后格式化为APFS文件系统



**输入法切换** Control + 空格键

* 右上角菜单栏
* 设置-键盘-按下fn时选择切换输入法



视频通话时菜单栏可以设置边缘光和人物居中



**外接显示器**

* 分辨率4K起步，5K最佳，能上6K那只能说明你实力雄厚。连接方式上最好选择通过USB-C接口连接，且带有反向供电的产品，至于刷新率我只能说有120Hz或者更高的刷新率

* 系统设置-显示器-用作主显示器或镜像；找到排列按钮，将这些显示器的摆放位置调整到和你现实中的位置一致，就能顺畅地拖动这些窗口
* macbook接上电源，合上盖子，就能单独使用显示器
* 显示器没声音是由于显示器没有扬声器：在设置-声音-输出选择macbook扬声器或其他音响



**空间黑洞清理** https://my.feishu.cn/wiki/BXZrwGA0ViFMeKkA1iicOjGMnMj



**取消开盖开机和连接电源自动开机**

打开终端，输入以下命令：

```Bash
sudo nvram BootPreference=%00
```

按回车确认，接着输入你Mac的开机密码，请注意输入时不会有任何提示，确保输入正确，按回车确认，看到终端变回这个样子，没有弹出任何奇怪的提示说明命令生效，现在如果将Mac关机，盖上盖子再打开，他就不会自动关机了。

这个命令同时也会取消连接电源时自动开机，如果你想单独取消开盖开机和连接电源开机中的某一项，可以把命令最后这两个数字换一下，就像这两个

```Bash
sudo nvram BootPreference=%01
sudo nvram BootPreference=%02
```

数字01是单独取消开盖开机，数字02单独尖连接电源时开机，而数字00则是都取消。 最后如果要恢复默认设置，用这行命令即可

```Bash
sudo nvram -d BootPreference
```



**临时禁止Mac自动休眠**

有的时候我们会需要临时禁止Mac自动休眠，比如需要上传或者下载一些大文件时，只需要打开终端，运行这行非常简短的指令

```bash
caffeinate -d
```

当你需要恢复自动休眠功能时，点击终端左上角的关闭按钮，点击终止，Mac就会继续执行你设置的自动睡眠时间了。



**用回车键重命名文件**

选中文件或文件夹，按下回车，立刻为你的文件重新命名，省去点击右键再点重命名的步骤。



**修改文件的默认打开方式**

如果你想修改相同类型所有文件的默认打开方式，比如 PNG 文件吧，就随便找一个 PNG 文件，点击右键，点击显示简介，在简介窗口中找到“打开方式”并进行修改，然后点击全部更改，点击继续，所有 PNG 文件的默认打开方式就都被修改了。



**按住字母键不放以输入重复字符**

使用聚焦搜索终端并打开，然后输入这行命令

```zsh
defaults write NSGlobalDomain "ApplePressAndHoldEnabled" -bool "false"
```

输入完成后按下回车键确认，接着重启你的 Mac，此时按再按住某个字母按键不放，它就会被重复输入了。如果你想要恢复重音菜单的显示，运行这行命令，再次重启电脑即可：

```zsh
defaults delete NSGlobalDomain "ApplePressAndHoldEnabled"
```



**按住 Shift 进行横向滚动**



**快速选取 PDF 中的文本**

只需要按住 option 键，看到光标变成准星了吗？现在指哪打哪，圈选你想要复制的文字，预览就会帮你准确选中它们，然后拷贝、粘贴



**将图片文件合成为 PDF**

只需要将这些图片全部选中，点击右键，在快速操作中点击“创建 PDF”，很快就能完成。如果你发现生成的 PDF 页面顺序和你想要的不同，用预览打开 PDF 文稿，在左侧的页面预览区域拖动页面重新排序即可，或者用我之前分享过的批量重命名，提前将这些图片按照你想要的页码顺序编号，例如这 10 张图片，我在它们的文件名后面增加 1-10 的序号，生成 PDF 后图片顺序就是从 1 到 10 了。



**快速去除视频文件中的视频或音频**

用 QuickTime Player 打开视频，在编辑菜单中点击“移除视频”或者“移除音频”



**下载网页上的图片**
网页上的图片如果想要下载到本地，通常只需要把它拖动出来即可，但是，现在有些网页是不允许你通过拖动的方式获取这些图片的，你压根就拖不动，右键菜单也没有存储图片选项，该怎么办呢？只需要打开 Safari 设置，在高级选项卡勾选“显示网页开发者功能”，你就能看到菜单栏多出了一个“开发”菜单，点击开发，点击“显示页面资源”，双击左侧的图像，你就能查看网页上所有的图片文件，找到你需要的，将右侧缩略图拖拽进文件夹，大功告成。



**查看更多可保存格式**

Mac 自带的预览功能可以帮你把图片或 PDF 文稿转换为很多种常用格式，但是吧，用户的需求总是多样的，当这些常用格式无法满足你的需求时，请按住 option 键点击格式菜单，你就会看到更多可保存的格式选项。



**批量文件重命名**

你有没有遇到过需要一次性命名多个文件的情况？手动依次修改可太痛苦了，只需要选中要改名的文件，右键，点击重新命名，你就能为他们统一修改名称，替换文本允许你将文件名中的特定文本全部替换掉，比如将 Apple 全部替换为 Banana，如果将替换留空，则会将 Apple 字样全部删除。添加文本允许你在文件名的最前面或最后面添加特定内容，这非常好理解。格式功能最为强大，在自定义格式中输入你需要的字段，右侧设置一个起始数字，你就能用指定文字加序号的方式重命名这些文件，除了使用序号外，还能使用当天的日期进行命名，满足你的不同需要。



**恢复已关闭的 Safari 标签页**

用 Safari 浏览网页时，你可能会不小心关掉某个还要用到的标签页，此时只需要按下 Command+Z 即可重新打开它，你还可以在添加新标签页的这个加号按钮上点击右键，即可快速查看近期关闭的 20 个标签页，点击就能重新打开。



**快速使用特定应用打开文件**

如果你需要用 Photoshop 打开这张图片进行编辑，并不需要先打开 PS 再点击打开选择文件，也不用在右键菜单中选择打开方式，直接把文件拖动到程序坞中的 PS 图标上，松手就可以了，其他应用同理
