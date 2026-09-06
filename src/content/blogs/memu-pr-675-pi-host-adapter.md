---
title: "memU PR #675：Pi Coding Agent 专用 Host Adapter 实现报告"
description: "从 session 解析、记忆流水线、检索安装与调度边界，拆解 memU PR #675 的 Pi 适配器实现。"
pubDate: 2026-09-06
tags: [memU, Pi Coding Agent, Agent, 记忆系统]
ogImage: false
toc: true
search: true
draft: false
---


> 对应 PR：[feat(hosts): add pi coding agent adapter #675](https://github.com/NevaMind-AI/memU/pull/675)  
> 关联 Issue：[[FEATURE] add a dedicated pi coding agent adapter #674](https://github.com/NevaMind-AI/memU/issues/674)  
> 阅读前提：读者已经阅读过《[看懂 memU：从运行方式到完整记忆链路](./memU.md)》，理解 `prepare → self-evolve → commit`、`TranscriptSource`、`HostSpec`、双轨 transcript、cursor 和 retrieval instruction/skill 等基础架构。本文不重复解释这些通用机制，只分析 PR #675 怎样把 Pi 接入这些既有 seam，以及 review 过程中为什么又补了几轮修复。

## 1. 最终结果

PR #675 为 Pi Coding Agent 增加了专用命令 `memu-pi`。接入后，memU 可以：

- 从 Pi 默认或自定义的 v3 JSONL session 目录发现会话；
- 正确区分用户/助手对话、工具调用与结果、无关运行记录；
- 在写入 prepared transcript 前删除已知运行字段，同时保留对话内容、工具内容和未来新增的未知字段；
- 复用现有 `prepare → self-evolve → commit` 记忆整理流程；
- 把 retrieval skill 和指令安装到 Pi 的全局上下文目录；
- 在 macOS/Linux 上通过 cron 或用户明确选择的 launchd，按时启动 `pi -p <prompt>`；
- 在 Windows 上通过 Task Scheduler 的 S4U 任务启动 Pi；
- 识别并在后续扫描中跳过后台 bridging 自己产生的 Pi session，防止 memU 反复整理自己的任务记录；
- 只卸载 Pi 对应的调度、指令、skill 和工作文件，不误删共享记忆配置。

最终净改动为 16 个文件、708 行新增、13 行删除。数字看起来不小，但主体是安装文档和回归测试。真正新增的宿主代码集中在：

- `src/memu/hosts/pi/sessions.py`：Pi session 格式适配；
- `src/memu/hosts/pi/cli.py`：Pi 的 `HostSpec`；
- `src/memu/hosts/pi/__init__.py`：导出 `PiTranscriptSource`；
- `src/memu/hosts/scheduling/windows.py`：修正共享 Windows wrapper 的命令解析边界。

没有修改 `MemoryService`、embedding、数据库 repository、memory/skill job 模板或 commit 语义，也没有为 Pi 复制一套 bridging pipeline。

## 2. 这个 PR 的 seam 边界

### 2.1 什么叫这里的 seam

这里的 seam 是 memU 核心流程与具体宿主之间的接口边界。memU 已经知道怎样增量读取、生成 job、让 Agent 整理 Markdown、提交记忆和检索记忆；它不知道的是 Pi 把 session 写在哪里、每条记录是什么结构、全局指令放在哪里，以及怎样无头启动 Pi。

因此 PR 的职责不是实现新的记忆系统，而是向现有通用流程提供 Pi 的宿主事实：

| Pi 特有事实 | 进入 memU 的位置 | 通用下游怎样使用 |
| --- | --- | --- |
| session 根目录与 JSONL 结构 | `PiTranscriptSource` | `prepare_transcripts()` 增量扫描并生成双轨 transcript |
| 记录属于对话、工具还是噪声 | `classify()` | conversation 文件只接收 `MESSAGE`，full 文件同时接收 `MESSAGE` 和 `TOOL` |
| prepared 输出中哪些字段应删除 | `sanitize()` | `_split()` 只在写临时切片时脱敏 |
| Pi 文件名里的真实 session ID | `session_id()` | `skip_sessions` 与 `PI_SESSION_ID` 精确比较 |
| CLI、指令、skills、调度命令 | `HostSpec` | 共享 `host_cli.run()` 注册全部子命令 |
| 安装、调度和卸载步骤 | `INSTALL.md`、`BRIDGING_TASK.md`、`UNINSTALL.md` | `memu-pi docs ...` 渲染并交给安装 Agent 执行 |

### 2.2 明确不在这个 PR 内的内容

以下内容全部沿用现有实现：

- `prepare` 如何维护 pending cursor；
- memory job 和 skill job 怎样生成；
- Agent 怎样执行 self-evolve；
- `commit` 怎样通过 hash 找变化、计算 embedding、写入 local 或 Cloud backend；
- retrieval 的搜索和结果结构；
- instruction/skill 的 managed block 安装逻辑；
- Windows Task Scheduler 的注册、状态查询和卸载框架；
- macOS/Linux wrapper 的锁、日志和 cron 结构。

这个边界很重要：如果为 Pi 另写一套 prepare、commit 或 retrieval，后续核心流程每次修复都需要同步两份，Pi adapter 也会逐渐偏离其他宿主。

## 3. 为什么 generic adapter 不够

Pi v3 session 默认保存在：

```text
~/.pi/agent/sessions/<encoded-cwd>/*.jsonl
```

一个 session 文件里不只有用户和助手文本，还可能包含：

- `session` header；
- `message`；
- `compaction`；
- 分支或模型切换等运行记录；
- assistant 的 `text`、`thinking`、`toolCall` content block；
- `toolResult`；
- `bashExecution`。

问题集中在 assistant 的 `message.content`。下面两条记录在外层都是 assistant message，但用途不同：

```json
{"type":"message","message":{"role":"assistant","content":[{"type":"text","text":"我先读取配置"},{"type":"toolCall","name":"read"}]}}
```

这条包含助手对用户可见的文本，应进入 conversation track，同时也进入 full track。

```json
{"type":"message","message":{"role":"assistant","content":[{"type":"thinking","thinking":"..."},{"type":"toolCall","name":"read"}]}}
```

这条没有对话文本，只有思考和工具调用，应只进入 full track。generic typed-tree classifier 会把这种纯 `toolCall` assistant 记录当成普通对话。对最近 10 个真实 Pi session 的只读扫描发现 385 条这种记录，专用 classifier 将 385/385 全部分到了 `TOOL`。

除此之外，generic adapter 也无法稳定声明以下 Pi 专用事实：

- `~/.pi/agent/AGENTS.md` 和 `~/.pi/agent/skills`；
- `pi -p {prompt}`；
- `PI_SESSION_ID`；
- `PI_CODING_AGENT_DIR` 和 `PI_CODING_AGENT_SESSION_DIR`；
- timestamp 前缀加 UUID 的 session 文件名规则。

所以专用 adapter 的必要性不只是增加一个更方便的命令名，而是让 record、retrieval、scheduler 和 self-session exclusion 四条边界都具有确定的 Pi 语义。

这里还有一个明确限制：`PiTranscriptSource` 不会根据 `id/parentId` 重建 Pi 的活动分支，而是沿用共享 JSONL source 的物理行顺序做增量切片。session header、compaction 和分支控制记录被归为 `OTHER`，prepared transcript 中又会删除 `id/parentId`。这符合当前 memory/skill mining 只消费可见对话与工具轨迹的需求，但它不是 Pi session replay，也不能还原完整分支图。

## 4. 上下游调用关系

### 4.1 Record 链路

```text
Pi 写入 v3 JSONL session
        ↓
PiTranscriptSource.discover()       递归发现各 encoded-cwd 下的文件
        ↓
TranscriptSource.read_incremental() 按正式 cursor 计算新增行
        ↓
PiTranscriptSource.classify()       MESSAGE / TOOL / OTHER
        ↓
PiTranscriptSource.sanitize()       只清理即将写出的已知运行字段
        ↓
prepare_transcripts()
  ├─ <n>.jsonl                      conversation：只含 MESSAGE
  └─ <n>_full.jsonl                 full：MESSAGE + TOOL
        ↓
共享 pipeline 生成 memory / skill / resource jobs
        ↓
Pi 执行 self-evolve
        ↓
memu-pi commit
        ↓
共享 local / Cloud memory backend
```

Pi adapter 的代码边界到 prepared transcript 为止。从 job 生成开始，下游已经完全回到 memU 通用实现。

### 4.2 Retrieval 链路

```text
Pi 新 session 加载 ~/.pi/agent/AGENTS.md
        ↓
managed pointer 指向 ~/.pi/agent/skills/memu-retrieve/SKILL.md
        ↓
Pi 根据指令调用 memu-pi retrieve <query>
        ↓
共享 host CLI 与 retrieval 实现
        ↓
local MemoryService 或 CloudMemoryClient
        ↓
返回命中的 memory / skill / resource 文件
```

PR 没有新写 retrieval 算法。它只通过 `HostSpec.instruction_path` 和 `HostSpec.skills_dir` 告诉共享安装器把现有 retrieval 能力放到 Pi 实际会加载的位置。

### 4.3 定时 Record 链路

macOS/Linux：

```text
cron / launchd
→ ~/.memu/hosts/pi/bridge.sh
→ export MEMU_BRIDGING_RUN=1
→ pi -p "$(cat bridge-prompt.txt)"
→ Pi 创建新的普通 session，并设置 PI_SESSION_ID
→ Pi 按 prompt 执行 memu-pi prepare / jobs / commit
```

Windows：

```text
Task Scheduler S4U task
→ PowerShell wrapper
→ 恢复安装时确认过的 PATH 目录
→ 从 bridge-prompt.txt 读取完整 prompt
→ pi -p $prompt
→ Pi 按同一份 prompt 执行 prepare / jobs / commit
```

两端不同的只有“操作系统怎样到点启动 Pi”。进入 Pi 以后执行的是同一条 bridging pipeline。

## 5. 按真实开发顺序看实现

### 5.1 第一步：先确认应该扩展哪个边界

开发前先阅读了 memU 的 host adapter、bridging pipeline、安装文档和 ADR，再对照 Pi 的 session-format、session manager 与 resource loader。结论是：

1. Pi 使用的仍是 JSONL，因此可以继承 `TranscriptSource` 的递归发现、逐行读取、行数 cursor 和时间戳读取；
2. 真正需要宿主定制的是 `classify()`，而不是整个增量处理流程；
3. Pi 有稳定的全局 instruction、skills、headless CLI 和 session ID 环境变量，可以用一个 `HostSpec` 表达；
4. 不需要新抽象、新依赖或数据库修改。

初始分支从当时的 `origin/main` `8b17fa4` 建立。实现前还对真实 session 做了只读分类统计，避免只根据手写样本猜格式。

### 5.2 第二步：实现 `PiTranscriptSource`

初始实现位于 `src/memu/hosts/pi/sessions.py`，核心先只有目录和分类规则。

#### 目录

```python
AGENT_DIR = os.environ.get("PI_CODING_AGENT_DIR", "~/.pi/agent")
SESSION_DIR = os.environ.get(
    "PI_CODING_AGENT_SESSION_DIR",
    f"{AGENT_DIR}/sessions",
)
```

`root()` 对路径执行 `expanduser()`。文件发现继续使用基类的 `rglob("*.jsonl")`，所以可以跨多个 `<encoded-cwd>` 子目录扫描，并按文件修改时间从新到旧排列。

命令行显式传入的 `--session-dir` 会在构造 `PiTranscriptSource` 时覆盖默认值，因此最终优先级是：CLI 明确路径优先，其次 `PI_CODING_AGENT_SESSION_DIR`，最后是 `PI_CODING_AGENT_DIR/sessions` 或 `~/.pi/agent/sessions`。

#### 分类

最终分类规则为：

| 输入 | `RecordKind` | prepared 输出 |
| --- | --- | --- |
| user/assistant，`content` 是字符串 | `MESSAGE` | conversation + full |
| user/assistant，content block 中有 `text` | `MESSAGE` | conversation + full |
| assistant，没有 text，但有 `toolCall` | `TOOL` | 仅 full |
| `toolResult` | `TOOL` | 仅 full |
| `bashExecution` | `TOOL` | 仅 full |
| session、compaction、thinking-only、未知 role/type | `OTHER` | 不写入 |
| malformed JSON 或外层/`message` 不是对象 | `OTHER` | 不写入 |

判断顺序特意让 `text` 优先于 `toolCall`。因此 assistant 一边解释一边调用工具时，解释文本不会从 conversation track 中消失；只有纯工具记录才进入 tool track。

#### 初始测试

测试同时覆盖：

- user message；
- 带说明文本的工具调用；
- thinking + toolCall 的纯工具调用；
- tool result；
- bash execution；
- session header、compaction、thinking-only 和 malformed JSON；
- 跨 encoded working directory 的递归发现与新旧顺序。

### 5.3 第三步：用 `HostSpec` 接上整个通用 CLI

`src/memu/hosts/pi/cli.py` 没有逐个实现 `prepare`、`commit`、`retrieve` 等命令，而是声明一份宿主数据：

```python
SPEC = HostSpec(
    host="pi",
    display="pi",
    package="memu.hosts.pi",
    task_name="memu-bridging-pi",
    source_factory=PiTranscriptSource,
    session_dir=SESSION_DIR,
    instruction_path=f"{AGENT_DIR}/AGENTS.md",
    skills_dir=f"{AGENT_DIR}/skills",
    schedule_backend="os",
    schedule_command="pi -p {prompt}",
    schedule_prepare_session_dir=True,
    session_id_env="PI_SESSION_ID",
    needs_headless_auth=True,
    auth_hint="...",
)
```

`main()` 只有一行 `run(SPEC, argv)`。共享 `host_cli.run()` 根据这些字段提供：

- `init`、`config`、`doctor`；
- `prepare`、`commit`；
- `retrieve`；
- `install-instruction`、`remove-instruction`；
- `docs install/task/uninstall`；
- Windows 上的 `schedule install/verify/status/uninstall`；
- lifecycle report。

这里体现了这个 PR 最核心的设计选择：Pi 只声明差异，不复制能力。

随后在 `pyproject.toml` 注册：

```toml
memu-pi = "memu.hosts.pi.cli:main"
```

并在 generic detection 的 `DEDICATED` 映射中加入：

```python
".pi": "memu-pi"
```

所以用户针对 `.pi` 目录运行 generic detect 时，会被明确引导到专用 adapter，而不是继续使用不精确的 generic classifier。

### 5.4 第四步：补齐安装、调度和卸载文档

PR 新增了三份由 Agent 执行的操作指南。

#### `INSTALL.md`

安装被拆为三部分：

1. 安装并配置 `memu-cli`，复用已有 local 或 Cloud backend；
2. 通过 `memu-pi docs task` 注册 record bridge；
3. 把 retrieval managed block 和 `memu-retrieve` skill 安装到 Pi 全局目录。

它还处理 `AGENTS.override.md` 优先级、自定义 agent/session 目录、已有 schedule 的安全刷新和每一步的验证条件。

#### `BRIDGING_TASK.md`

macOS/Linux 指南把长 prompt 保存到文件，只在 crontab 中登记短 wrapper：

```cron
0 * * * * $HOME/.memu/hosts/pi/bridge.sh # memu-bridging-pi
```

`bridge.sh` 提供：

- 目录锁，避免两个整理周期重叠；
- 180 分钟 stale lock 清理；
- `MEMU_BRIDGING_RUN=1` 标记；
- prompt 文件读取；
- `bridge.log` 日志；
- 退出时锁清理。

Windows 则复用共享 `schedule` 命令生成 PowerShell wrapper 和 Task Scheduler 任务。

#### `UNINSTALL.md`

卸载遵循所有权边界：

- 只移除 Pi 的 cron/launchd 或 `memu-bridging-pi` Windows task；
- `remove-instruction` 只删除 memU managed block 和 retrieval skill；
- 默认保留共享 `~/.memu/config.env`、memory store 和已提交 cursor；
- 只有没有其他宿主使用时才移除 `memu-cli`。

#### 用户可见入口

README、根 `SKILL.md` 和 `INSTALL-LATEST.md` 同步增加 Pi adapter 与 `memu-pi` 命令。`INSTALL-LATEST.md` 当时的 host 表还缺少已经存在的 Cola，因此该文件的数量从 7 调整为 9，并同时列出 Cola 与 Pi；其余入口只增加 Pi。

### 5.5 第五步：提交初始 PR

初始实现 commit 为 `139c78e`，rebase 后对应当前 commit `bff4145`：

```text
feat(hosts): add pi coding agent adapter
```

当时的验证结果：

- 聚焦测试：126 passed；
- `make check`：通过；
- 全量测试：604 passed，8 skipped；
- `git diff --check`：通过；
- `memu-pi --help`：正确显示共享命令；
- 真实 Pi session：385/385 条纯 tool-call 记录被分类为 `TOOL`。

之后创建 Issue #674 和 PR #675。Reviewer 明确说明，新 host 会按 installation、scheduler lifecycle、真实唤醒、transcript shape、self-session exclusion、retrieval injection、跨平台 cleanup 等 seam 分轮验证，因此多轮 `CHANGES_REQUESTED` 是逐层验收，而不是每轮重新否定整个实现。

## 6. Reviewer 第一轮：Windows S4U 真实任务无法启动 Pi

### 6.1 真实问题

Windows 安装流程可以成功注册 `\\memU\\memu-bridging-pi`，`schedule status` 和 `schedule verify` 也能返回成功，但 reviewer 实际触发 Task Scheduler 后发现：

```text
LastTaskResult: 1
NativeCommandError: 系统找不到指定的文件
```

PowerShell wrapper 已经启动，也成功读取了 prompt，失败位置是：

```powershell
& '...\pi.CMD' -p $prompt
```

结果是 `bridge.log` 没有内容、没有新 Pi session、jobs 和 manifest 都没有推进。把同一个 S4U task 临时改成 `node.exe + Pi CLI JavaScript 入口` 后立即成功，因此问题被限定为 Windows 调度进程怎样启动 npm launcher，而不是 S4U、Pi 登录、模型或 prompt 本身。

### 6.2 S4U、`.CMD` 和 `.ps1` 的实际含义

S4U 是 Windows Task Scheduler 的一种登录方式。任务可以在用户没有打开桌面会话时，以该用户身份运行，而且不在任务中保存用户密码。它运行在非交互的 session 0，环境与当前 PowerShell 窗口不同。

npm 在 Windows 的可执行目录里通常同时生成：

- `pi.CMD`：由 `cmd.exe` 解释的批处理入口；
- `pi.ps1`：由 PowerShell 解释的脚本入口。

Python 的 `shutil.which("pi")` 在 reviewer 的机器上返回 `pi.CMD`。初始共享 scheduler 把这个查找结果的绝对路径直接写进 PowerShell wrapper，于是 S4U 中固定执行 `.CMD`，实际启动失败。

### 6.3 第一版修复：改用同目录 `.ps1`

我们先按具体失败实现 `_resolve_scheduled_agent()`：

- 普通 exe 路径保持不变；
- `.cmd/.bat` 改为同目录同名 `.ps1`；
- 没有 `.ps1` 时 fail closed，不注册一个已知不能启动的任务；
- `schedule verify` 也检查同一条件。

同时补了完整的 `schedule install → 读取生成 wrapper` 回归，而不是只测一个路径转换函数。还修正文案，明确 `schedule verify` 只检查注册状态和当前进程中的 headless auth，不会触发真实 S4U task。

这个版本当时是 `0da3459`，rebase 后为 `b3642b2`。

### 6.4 macOS cron 黑盒验证

Reviewer 要求不能用手工执行 `pi -p` 或直接运行 wrapper 代替真实 OS scheduler。我们在 macOS 上完成了完整黑盒：

1. 从没有 Pi host 数据和 crontab 的状态开始；
2. 给一个 fresh Pi session 只提供渲染后的安装指南；
3. 让 Pi 创建 wrapper、prompt、retrieval 安装和 hourly cron；
4. 临时把该 cron 调到下一分钟；
5. 等待 macOS cron daemon 自己触发；
6. 完成后恢复 `0 * * * *`。

观察到：

- `bridge.log` 从不存在变为 777 bytes；
- Pi session 数量从 53 增加到 54；
- jobs 从 21 个遗留任务，变为 7 个新任务，最后归零；
- pending manifest 被更新，commit 后晋升并删除；
- `.bridge.lock` 运行时存在，正常退出后清理；
- scheduled Pi 报告总共完成 28 个 jobs，两次 commit 都成功。

这证明的不是“Pi 命令能运行”，而是 macOS 的非交互 cron 环境能够从调度器入口走完整条 record 链路。

### 6.5 收窄无关改动

修正 `schedule verify` 语义时，我们一度顺手修改了 Claude Code、Cursor、Hermes 的 `BRIDGING_TASK.md`。这些说明在共享行为上是一致的，但不属于 reviewer 对 Pi PR 的明确要求，也扩大了审查范围。

随后用 `c2af7cb` 撤回这三份文档的净改动；rebase 后对应 `a237249`。最终只保留共享 Windows scheduler 实现/测试和 Pi 自己的调度文档。

## 7. Reviewer 第二轮：修复点不应绑定 npm 文件布局

第一版 `.CMD → .ps1` 修复解决了当前机器上的现象，但 reviewer 指出它把宿主契约放错了层级。

### 7.1 真正的契约是 PATH 中能解析 `pi`

Pi adapter 声明的是：

```text
schedule_command = "pi -p {prompt}"
```

它没有声明“Pi 必须由 npm 安装”，也没有声明 `.CMD/.ps1` 的目录关系。Pi 可能由其他包管理方式安装，npm shim 的实现也可能变化。

因此 scheduler 需要分开处理两件事：

1. **安装前检查**：用 `shutil.which("pi")` 确认当前环境确实能找到 Pi，并获取其目录；
2. **计划任务实际调用**：在 wrapper 的 PATH 前面加入该目录，但只执行裸命令 `pi`，让计划任务里的 PowerShell 按自己的命令解析规则选择正确入口。

这里的“裸命令”就是不带绝对路径和扩展名的 `pi`。最终 wrapper 关键部分变成：

```powershell
$env:Path = '<resolved-pi-directory>;...' + $env:Path
$prompt = Get-Content -Raw -Encoding UTF8 -LiteralPath '<prompt-file>'
& 'pi' -p $prompt
```

`shutil.which()` 返回的绝对路径仍有用途：preflight、headless auth probe 和构造 PATH。它不再被冻结为计划任务的启动目标。

因此第二版删除了：

- `_resolve_scheduled_agent()`；
- `.ps1` companion 要求；
- `.ps1` 缺失时的 install/verify guard；
- 与 npm 文件布局绑定的测试。

替代测试从 `pi.CMD` 的 preflight 结果出发，断言最终 wrapper：

- 调用 `& 'pi' -p $prompt`；
- PATH 含已解析 launcher 的目录；
- 不含 `.CMD` 绝对路径；
- 也不含 `.ps1` 绝对路径。

该修复当时是 `85aee52`，rebase 后为 `46b92f2`。Reviewer 随后在真实 Windows S4U 环境确认 Pi 已经能够启动。

### 7.2 memU 的安装指南不负责安装 Pi

初始 `INSTALL.md` 包含 `npm install -g ...pi-coding-agent` 和额外的 `pi -p "Reply with exactly: ok"` 探针，`HostSpec` 里还有 npm-specific `install_hint`。

Reviewer 指出：这份指南是在已经运行的 Pi 内被读取的，因此 Pi 不可能在这里“尚未安装”。memU 也不应规定宿主必须通过 npm 安装。计划任务中找不到 `pi` 时，本质是该非交互环境的 PATH 问题，不应被诊断成“请按这一种方式重装 Pi”。

最终调整为：

- `INSTALL.md` 只安装和验证 memU adapter，Part 1 只运行 `memu-pi doctor`；
- 删除 Pi 的 npm 安装命令；
- 删除安装指南中的独立 Pi auth probe；
- 删除 `HostSpec.install_hint`，让共享错误信息只要求 PATH 中存在可解析的 Pi CLI；
- 保留 Windows `schedule install` 自己的 headless auth gate，因为它验证的是计划任务前置条件，属于 scheduler seam，而不是让 memU 重新验证或安装宿主。

前两项包含在 `85aee52`/当前 `46b92f2`。`install_hint` 的一行删除直接应用了 reviewer suggestion，当时生成 `d936208`，rebase 后为当前 `01bf120`。

## 8. Reviewer 第三轮：后台 session 的身份比较不一致

### 8.1 问题怎样产生

所有 OS-scheduled bridge 都会启动一个新的 Pi session。这个 session 里记录的是：

- bridging prompt；
- `memu-pi prepare` 和 `commit`；
- job 读取与 Markdown 编辑；
- 工具结果和最终汇报。

如果下一轮把它当成普通用户 session，就会为这些 memU 内部记录继续生成新 jobs。每次定时运行又产生下一份 session，最终形成持续自我摄取，而且这些最新 session 会优先占用 `max_jobs` 名额。

共享逻辑已经在 scheduled run 内读取 `PI_SESSION_ID`，写入 self-session 列表，并在后续 `prepare_transcripts(..., skip_sessions=...)` 中跳过。但 `PiTranscriptSource` 最初继承了默认实现：

```python
def session_id(path: Path) -> str:
    return path.stem
```

Pi 实际的两边是：

```text
PI_SESSION_ID
01a061ac-aaf3-7f05-a295-d95115fef655

session 文件名
2026-09-02T10-31-41-043Z_01a061ac-aaf3-7f05-a295-d95115fef655.jsonl
```

默认 `path.stem` 返回“时间戳_UUID”，永远不等于环境变量里的 UUID，所以 skip 机制虽然执行了，实际匹配不到文件。

### 8.2 修复

Pi 覆盖 `session_id()`：

```python
def session_id(self, path: Path) -> str:
    return path.stem.rsplit("_", 1)[-1]
```

它只从最后一个下划线处分割，返回 Pi 导出的 UUID，与 `PI_SESSION_ID` 使用同一个身份空间。

### 8.3 为什么要同时测试当前和历史 bridging session

回归测试覆盖两个对象：

- 当前 scheduled run：由 `MEMU_BRIDGING_RUN=1 + PI_SESSION_ID` 在本轮 `prepare` 前记录；
- 上一轮 scheduled run：已经存在 self-session 文件中。

测试创建两个带时间戳前缀的 Pi transcript，执行真实 `_cmd_prepare()` seam，最终断言：

- self-session 列表同时保留旧 UUID 和新 UUID；
- 两个 session 都没有生成 prepared transcript；
- 没有 memory/skill job。

这比只测试字符串截取更重要，因为它证明 `HostSpec.session_id_env → _cmd_prepare → self_sessions.remember/load → prepare_transcripts → PiTranscriptSource.session_id()` 的完整链路能够闭合。

修复当时是 `4a3a102`，rebase 后为 `8a0c4d1`。

## 9. Reviewer 第四轮：prepared transcript 泄露运行字段

### 9.1 为什么要在输出边界处理

初始 Pi classifier 只决定一条记录是否进入 prepared transcript，没有修改记录内容。因此被保留的真实 Pi 行会原样带入：

- record 层的 ID、父子关系和时间；
- provider、model、usage、response ID、停止原因；
- tool result 的详细运行信息；
- thinking signature；
- 失败响应的 error message。

这些字段是 Pi 运行和恢复 session 所需的数据，但不是 memory/skill mining 的必要输入。它们会扩大 staged transcript，也会把宿主私有运行上下文暴露给后续整理任务。Reviewer 对 21 个真实 Pi session 的 field-only census 显示，498 条被分类记录全部带 record ID/时间字段；只删除已知运行字段即可让序列化体积下降 26.9%。

处理位置不能放在原始 session 读取阶段，原因是：

- classifier 仍需要看到原始 provider-native 结构；
- cursor 必须按原始行数和原始 timestamp 计算；
- memU 不应修改 Pi 自己的 session 文件；
- conversation 和 full 两份输出应该使用同一份清理结果。

在此期间，上游 PR [#677](https://github.com/NevaMind-AI/memU/pull/677)、[#680](https://github.com/NevaMind-AI/memU/pull/680)、[#681](https://github.com/NevaMind-AI/memU/pull/681) 已经给 `TranscriptSource` 增加 identity-by-default、path-aware 的 `sanitize(path, record)` seam，并在共享 `_split()` 中只对 `MESSAGE`/`TOOL` 调用它。分支先 rebase 到包含该 seam 的 `main` `54f9468`，再为 Pi 实现覆盖。

最终顺序是：

```text
原始 record
→ classify(original)
→ 仅对 MESSAGE / TOOL 执行 sanitize(original)
→ 写 prepared conversation/full

同时：
original records
→ read_incremental 计算原始行数
→ timestamp(original) 读取原始时间
→ 写 pending cursor
```

### 9.2 为什么选择 delete-only

另一种做法是只挑出 `role`、`content`、`toolName` 等白名单字段重新组装对象，但 Pi 未来增加一个有语义的新字段时，旧 memU 会静默丢掉它。

本实现反过来只删除 reviewer 已确认的运行字段：

| 层级 | 删除字段 |
| --- | --- |
| record | `id`、`parentId`、`timestamp` |
| message | `api`、`provider`、`model`、`usage`、`stopReason`、`rawStopReason`、`responseId`、`timestamp`、`errorMessage` |
| tool-result message | `details` |
| content block | `thinkingSignature` |

其余字段全部保留，包括：

- 用户和助手文本；
- `thinking` 正文；
- `toolCall` 的 name、arguments、ID；
- `toolResult` 的 tool name、call ID、content、isError；
- record、message 和 content block 三层的未知新字段。

`details` 只在 `message.role == "toolResult"` 时删除，不把其他 role 中未来可能出现的同名业务字段一并删掉。

### 9.3 具体实现

四组 `frozenset` 表达各层的已知删除项，小型 `_drop_known_fields()` 原地删除已解析字典中的命中字段并返回是否发生变化。

`sanitize()` 的处理步骤为：

1. JSON 解析失败或外层不是对象时原样返回；
2. 删除 record 层字段；
3. `message` 不是对象时，只在 record 确实改变后重新序列化；
4. 删除通用 message 运行字段；
5. 对 tool result 额外删除 `details`；
6. 遍历字典类型 content block，删除 `thinkingSignature`；
7. 没有变化时返回原字符串，有变化时用 `ensure_ascii=False` 序列化。

原始文件从未被打开为写模式。所有删除都发生在 `json.loads()` 得到的新对象上。

### 9.4 两层测试

字段级测试证明：

- 所有指定字段确实删除；
- conversation/tool 内容不变；
- 三个层级的未知字段不变；
- tool-result 内容和调用身份不变。

`prepare_transcripts()` 集成测试进一步证明：

- `<n>.jsonl` 和 `<n>_full.jsonl` 都使用清理后的记录；
- 原始 Pi JSONL byte-for-byte 不变；
- pending cursor 仍是原始 `lines: 1`；
- `last_timestamp` 仍来自已经从 prepared 输出删除的原始 timestamp。

这次修复为当前 commit `efc80cf`。

## 10. Rebase 后的 commit 对照

最后一轮按 reviewer 要求把分支 rebase 到当时最新 `main` `54f9468`。rebase 重放提交后，前六个 SHA 改变；PR 旧评论和我们的旧回复仍显示原 SHA。两者内容对应关系如下：

| 开发阶段 | 当时 PR 回复中的 SHA | 当前分支 SHA | 内容 |
| --- | --- | --- | --- |
| 初始 adapter | `139c78e` | `bff4145` | Pi source、HostSpec、CLI、文档和初始测试 |
| 第一版 S4U 修复 | `0da3459` | `b3642b2` | `.CMD → .ps1` 与 verify 语义修正；后续部分被更准确方案替代 |
| 范围清理 | `c2af7cb` | `a237249` | 撤回 Claude Code/Cursor/Hermes 文档改动 |
| CLI boundary 修复 | `85aee52` | `46b92f2` | wrapper 调用裸 `pi`，移除 npm 文件布局依赖和安装指南越界内容 |
| 应用 reviewer suggestion | `d936208` | `01bf120` | 删除 npm-specific `install_hint` |
| self-session identity | `4a3a102` | `8a0c4d1` | 文件名映射到 Pi 导出的 UUID |
| prepared 输出脱敏 | — | `efc80cf` | rebase 后新增 Pi `sanitize()` 与两层测试 |

这也解释了为什么当前 PR commit 列表中看不到 `139c78e`、`0da3459` 等旧 SHA：不是提交内容丢失，而是父提交改变后 Git 重新计算了 commit ID。

## 11. 最终代码按文件分工

| 文件 | 最终职责 |
| --- | --- |
| `src/memu/hosts/pi/sessions.py` | Pi 路径、分类、session ID 归一化、prepared 输出脱敏 |
| `src/memu/hosts/pi/cli.py` | 声明 Pi `HostSpec`，复用共享 CLI |
| `src/memu/hosts/pi/__init__.py` | 导出 `PiTranscriptSource` |
| `src/memu/hosts/pi/INSTALL.md` | 配置 backend、安装 record bridge 与 retrieval |
| `src/memu/hosts/pi/BRIDGING_TASK.md` | macOS/Linux wrapper/cron 与 Windows schedule 操作 |
| `src/memu/hosts/pi/UNINSTALL.md` | 只清理 Pi 自己拥有的安装状态 |
| `src/memu/hosts/scheduling/windows.py` | preflight 用解析路径，计划任务调用 PATH-resolvable CLI name |
| `pyproject.toml` | 注册 `memu-pi` console script |
| `src/memu/hosts/generic/detect.py` | `.pi` 目录路由到专用 adapter |
| `README.md`、`SKILL.md`、`INSTALL-LATEST.md` | 展示 Pi 是正式 host adapter |
| `tests/test_host_sessions.py` | 分类、发现、session ID、sanitize 与 prepare 集成回归 |
| `tests/test_bridging_self_sessions.py` | 当前和历史 Pi bridging session 的端到端跳过 |
| `tests/test_host_generic.py` | generic detect 指向 `memu-pi` |
| `tests/test_scheduling_windows.py` | Pi task identity、裸命令 wrapper、verify 语义、prompt/doc 一致性和卸载边界 |

## 12. 最终关键状态边界

### 12.1 原始 session 与 prepared transcript

```text
Pi 原始 JSONL：只读，结构完整
prepared JSONL：只含分类后需要的记录，并删除已知运行字段
cursor：按原始记录计算，不受 sanitize 影响
```

### 12.2 手工 prepare 与定时 prepare

```text
用户手工执行 memu-pi prepare
→ 没有 scheduled-run 标记
→ 不登记当前 session 为 self-session
→ 当前对话仍可被整理

OS scheduler 启动 Pi 后执行 memu-pi prepare
→ MEMU_BRIDGING_RUN=1
→ 读取 PI_SESSION_ID
→ 在扫描前登记当前 UUID
→ 当前及历史 bridging session 全部跳过
```

### 12.3 `schedule verify` 与真实黑盒

```text
schedule verify
→ 检查任务注册
→ 检查当前进程 PATH
→ 在当前进程做 headless auth probe
→ 不触发 S4U task

真实黑盒
→ 由 OS scheduler 触发
→ 检查 bridge.log、新 Pi session、jobs、pending/promoted manifest 和锁
```

因此 `schedule verify` 通过只能说明必要条件通过，不能替代真实 scheduler wake-up 证据。

### 12.4 安装所有权

```text
Pi 是否安装、通过什么方式安装：Pi 项目或用户负责
memu-pi 是否安装、backend 是否可用：memU 安装指南负责
非交互环境能否找到并认证 Pi：scheduler 安装/验证负责
```

这个划分是 review 第二轮最重要的设计修正。

## 13. 验证结果

### 初始提交

| 检查 | 结果 |
| --- | --- |
| focused tests | 126 passed |
| `make check` | 通过 |
| full suite | 604 passed，8 skipped |
| real-session classifier | 385/385 pure tool-call rows → `TOOL` |
| `memu-pi --help` | 通过 |

### 第一轮 scheduler 修复

| 检查 | 结果 |
| --- | --- |
| Windows scheduler tests | 69 passed |
| `make check` | 通过 |
| full suite | 607 passed，8 skipped |
| macOS cron black-box | 真实 cron 唤醒、28 jobs 完成、manifest 推进、锁清理 |

### CLI boundary 修复

| 检查 | 结果 |
| --- | --- |
| Windows scheduler tests | 68 passed |
| `make check` | 通过 |
| full suite | 606 passed，8 skipped |
| Windows S4U | reviewer 后续确认能启动 Pi |

### self-session 修复

| 检查 | 结果 |
| --- | --- |
| focused host/self-session tests | 73 passed |
| `make check` | 通过 |
| full suite | 608 passed，8 skipped |

### rebase + sanitize 最终状态

| 检查 | 结果 |
| --- | --- |
| focused host/self-session/scheduler tests | 149 passed |
| `make check` | 通过，含 pre-commit、Ruff、format、mypy、deptry |
| full suite | 646 passed，8 skipped |
| `git diff --check` | 通过 |
| GitHub CI | PR title、Python 3.11、Python 3.13 全部通过 |
| PR mergeability | `MERGEABLE` |
| review 状态（2026-09-02） | `REVIEW_REQUIRED`，等待 reviewer 再次批准 |

不同阶段的全量测试数量变化主要来自分支期间 `main` 持续合入其他测试，不能把数字差值理解成这个 PR 自己增加了对应数量的测试。

## 14. 这次实现与 review 最值得保留的结论

第一，新增宿主时先找 seam，不要先复制流程。Pi 最终只需要一个 `TranscriptSource`、一个 `HostSpec` 和宿主文档，就接入了 memU 的完整 record 与 retrieval 能力。

第二，宿主格式适配不能只看 role。Pi 的纯 `toolCall` 也写成 assistant message，必须检查 content block，且让 text 优先，才能同时保留对话语义和工具轨迹。

第三，当前机器上的可执行文件路径不等于稳定宿主契约。Windows preflight 可以记录解析目录，但 scheduled wrapper 应调用 `HostSpec` 声明的 PATH-resolvable `pi`，不应依赖 npm 的 `.CMD/.ps1` 布局。

第四，验证命令与端到端验证必须分开。`schedule verify` 没有进入 S4U/cron 环境，只有 OS scheduler 真正触发后产生的新 session、日志、jobs 和 manifest 才能证明 record bridge 能工作。

第五，后台 Agent session 也是普通宿主 session。只要 session ID 的两端格式不同，跳过机制就会静默失效。`session_id()` 的契约不是“返回文件 stem”，而是“返回与 `session_id_env` 完全相同的宿主身份”。

第六，脱敏应发生在 prepared 输出边界。这样可以同时保住原始 session、分类依据和 cursor，又能减少交给整理 Agent 的运行元数据。对会持续演化的 provider-native JSON，删除已知字段比重建固定白名单更能保持向前兼容。

第七，review 修复要检查最终净 diff。共享行为修正不代表应顺手修改所有宿主文档；本 PR 曾扩到 Claude Code、Cursor、Hermes，随后主动撤回，只保留 Pi 与必要的共享 scheduler 改动。

