[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.05) ](./ch05_agents_protocol.md) | [ ➡️ 下一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ 🌐 English ](../en/ch06_reasoning_steer.md)

# Ch.06 思维纠偏：如何像技术总监一样透视推理过程

在传统开发中，管理初级程序员时，最担心的场景是其默默闭门造车，最终交付一堆偏离业务逻辑的代码，甚至导致系统崩溃。



在使用强推理模型（GPT-5.5）驱动的 Codex 时，这种情况同样存在。虽然 AI 拥有强大的推理能力，但一旦它的前置假设出错，它就会顺着错误的逻辑一路狂奔，甚至陷入自我纠错的“无限循环”。



本章教你如何穿透 Codex 的**推理过程**，在它偏离航线时，像一个资深技术总监一样精准介入。

---

## 6.1 为什么要看模型的推理过程？

强推理模型与普通大模型的最大区别在于：它在输出最终代码前，会先在内部“打草稿”进行推理和自我模拟。Codex TUI 会在交互界面上**以推理摘要（Reasoning Summary）的形式**展示这个过程。

```Plaintext
[用户需求] ──> 1. 解析目标与限制 ──> 2. 规划步骤 ──> 3. 运行测试 ──> 4. 自我修正 ──> [最终输出]
                 └───(在 TUI 中显示为 Reasoning Summary，即你的“监考视窗”)───┘
```

如果你只看最终结果，你只能“被动接受”。如果你学会监控推理摘要，你就能在步骤 2 或 3 发现它的逻辑漏洞，提前干预，避免浪费你的 API Token 和时间。

> ⚠️ 注意：完整的 “思维链 (Chain of Thought)” 原始内容是 OpenAI 内部的，不会对用户暴露。TUI 中看到的是模型自己生成的**摘要**——已经足够用来判断它的方向是否走偏。

---

## 6.2 如何在 TUI 中观察并解读推理过程

两种典型用法：

### 1. 交互模式（TUI）

直接运行 `codex`，进入 TUI 后，Codex 会自动在主面板的“Reasoning”分栏里实时滚动它的推理摘要。

如果你要查看更详细的 turn 信息，可以使用斜杠命令：

```Bash
# TUI 中输入以下斜杠命令
/diff       # 查看当前 turn 的代码变更
/review     # 让另一个 Codex 子 agent 审查最近的变更
/copy       # 复制最后一次响应到剪贴板
```

### 2. 非交互模式（脚本化分析）

如果想做日志化分析，运行：

```Bash
# 非交互模式，输出 JSONL 流，可管道给日志处理脚本
codex exec --json "<your task>" > task.jsonl
```

JSONL 中会包含 `reasoning` 事件、工具调用、模型回复等结构化数据，方便你做监控告警或回放。

### 实时推理摘要示例

当 Codex 收到“修复 Redis 限流器连接超时”的任务时，Reasoning 面板会输出类似下方的思考流：

```Plaintext
[Reasoning Summary - 示意]
- User wants to fix Redis rate limiter connection timeout.
- Checking existing implementation in src/lib/redis.ts...
- I see `redis = new Redis()` without retryStrategy.
- If Redis is down, it hangs the Express app. This violates the 3000ms timeout constraint in AGENTS.md.
- Plan:
  1. Add `maxRetriesPerRequest: null` and `enableReadyCheck: false`.
  2. Implement custom retryStrategy up to 3 times.
  3. Write mock connection test to verify.
```

---

## 6.3 识别 AI 陷入的典型“死循环”

在AI 项目实操经历中，我总结了 AI 容易陷入的三个死循环，一旦看到推理摘要中出现以下特征，必须立刻介入：

### 1. 无限 npm install 循环 (The Dependency Loop)

- **现象**：AI 试图使用某个新库，运行安装报错；它在 CoT 里决定更换版本再次安装，又报错；接着它试图安装另一个同类库……

- **CoT 特征**：`Error: Cannot resolve dependency \.\.\. Running npm install \-\-legacy\-peer\-deps \.\.\.` 重复出现 3 次以上。

### 2. 代码重构自毁循环 (The Regression Loop)

- **现象**：AI 修改了 A 文件导致单元测试 B 失败；它去修改 B 测试，结果导致 C 模块报错；它又去改 C，结果 A 又坏了。

- **CoT 特征**：不断在两三个文件之间往返修改，并且测试通过率反复在 80% 和 90% 之间横跳。

---

## 6.4 介入三部曲：打断、修正与接管

当发现 AI 走偏或陷入死循环时，不要坐以待毙。请按照以下步骤进行干预：

### 第一步：果断打断 (`Ctrl \\\+ C`)

在终端直接按下 `Ctrl \\\+ C`。这会立刻中止 Codex 的当前任务，阻止它继续消耗 Token。

### 第二步：点对点纠偏（直接对话）

打断后，Codex 会回到 TUI 等待新指令。**Codex CLI 并没有专门的 ****`refine`**** 子命令**——你只需要直接输入下一条指令，明确指出它思考过程中的逻辑盲区：

```Plaintext
# 在 TUI 中继续输入：
你刚才试图安装 axios-retry，但本项目禁止安装任何第三方 HTTP 重试库。请使用原生的 AbortController 来实现超时重试，并把这条规则追加到 AGENTS.md。
```

如果想接着上一次会话继续，也可以用：

```Bash
codex resume     # 在新终端中恢复之前的会话
```

### 第三步：人手接管与回滚

如果 AI 已经把代码改得面目全非，不要试图让它自己改回去。直接运行 Git 命令回滚，并在 `AGENTS\.md` 中追加一条硬性红线：

```Bash
# 撤销 AI 刚才的错误修改
git checkout -- src/lib/redis.ts
```



然后在 [AGENTS.md](./AGENTS.md) 中追加：

```Markdown
- 禁止为任何简单的网络超时问题引入外部重试依赖库。
```

---

[ 🏠 主目录 ](../README.md) | [ ⬅️ 上一章 (Ch.05) ](./ch05_agents_protocol.md) | [ ➡️ 下一章 (Ch.07) ](./ch07_desktop_computer_use.md) | [ 🌐 English ](../en/ch06_reasoning_steer.md)
